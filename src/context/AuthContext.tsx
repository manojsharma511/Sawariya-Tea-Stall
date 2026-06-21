import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isMockEnabled } from '../services/firebase';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAdmin: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isAdminMode: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsAdmin: (username: string, password: string) => Promise<boolean>;
  signUpDevotee: (name: string, usernameOrEmail: string, password: string) => Promise<void>;
  signInDevotee: (usernameOrEmail: string, password: string) => Promise<boolean>;
  updateUserProfile: (name: string, password?: string) => Promise<void>;
  updateAdminProfile: (name: string, username: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  isMock: boolean;
  confirmAdminMode: (confirm: boolean) => void;
  setAdminMode: (active: boolean) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'manojkumarsharma27096@gmail.com';
const MOCK_USER_KEY = 'sawariya_mock_user';
const ADMIN_MODE_SESSION_KEY = 'sawariya_admin_mode_active';
const MOCK_ADMIN_CREDS_KEY = 'sawariya_mock_admin_creds';
const MOCK_USERS_ARRAY_KEY = 'sawariya_mock_users_list';

const DEFAULT_ADMIN_CREDS = {
  username: 'admin',
  password: 'Sawariya@123',
  name: 'Manoj Kumar (Admin)'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Sync auth state
  useEffect(() => {
    if (isMockEnabled) {
      // Load mock user from localStorage
      const savedMockUser = localStorage.getItem(MOCK_USER_KEY);
      if (savedMockUser) {
        try {
          const profile = JSON.parse(savedMockUser);

          // Verify if user is mock admin and credentials flag is set
          const isVerifiedAdmin = profile.email === ADMIN_EMAIL && localStorage.getItem('sawariya_admin_verified') === 'true';
          const updatedProfile = {
            ...profile,
            isAdmin: isVerifiedAdmin
          };

          setUser(updatedProfile);

          if (isVerifiedAdmin) {
            const savedChoice = sessionStorage.getItem(ADMIN_MODE_SESSION_KEY);
            if (savedChoice !== null) {
              setIsAdminMode(savedChoice === 'true');
            } else {
              setIsAdminMode(true);
            }
          }
        } catch (e) {
          console.error('Error parsing mock user', e);
        }
      }
      setLoading(false);
    } else if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // Admin flag check strictly checks if email matches admin
          const isUserAdmin = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
          let displayName = firebaseUser.displayName;

          if (isUserAdmin) {
            try {
              // Try loading custom name from firestore profile config
              const docSnap = await getDoc(doc(db, 'site_content', 'admin_profile'));
              if (docSnap.exists() && docSnap.data().name) {
                displayName = docSnap.data().name;
              }
            } catch (e) {
              console.error('Error reading custom admin profile name:', e);
            }
          } else {
            try {
              // Try loading custom devotee name from users collection
              const docSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (docSnap.exists() && docSnap.data().name) {
                displayName = docSnap.data().name;
              }
            } catch (e) {
              console.error('Error reading devotee user profile:', e);
            }
          }

          const profile: UserProfile = {
            uid: firebaseUser.uid,
            displayName: displayName || (isUserAdmin ? 'Manoj Kumar (Admin)' : 'Devotee'),
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || (isUserAdmin ? '🙏' : `https://api.dicebear.com/7.x/adventurer/svg?seed=${displayName || 'Devotee'}`),
            isAdmin: isUserAdmin
          };
          setUser(profile);

          if (profile.isAdmin) {
            const savedChoice = sessionStorage.getItem(ADMIN_MODE_SESSION_KEY);
            if (savedChoice !== null) {
              setIsAdminMode(savedChoice === 'true');
            } else {
              setIsAdminMode(true);
            }
          }
        } else {
          setUser(null);
          setIsAdminMode(false);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const confirmAdminMode = (confirm: boolean) => {
    setIsAdminMode(confirm);
    sessionStorage.setItem(ADMIN_MODE_SESSION_KEY, confirm ? 'true' : 'false');
  };

  const setAdminMode = (active: boolean) => {
    setIsAdminMode(active);
    sessionStorage.setItem(ADMIN_MODE_SESSION_KEY, active ? 'true' : 'false');
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    if (isMockEnabled) {
      // Direct mock devotee sign-in
      const mockProfile: UserProfile = {
        uid: `mock_user_${Date.now()}`,
        displayName: 'Rajesh Devotee',
        email: 'devotee@gmail.com',
        photoURL: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rajesh',
        isAdmin: false
      };
      setUser(mockProfile);
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockProfile));
      setShowLoginModal(false);
      setLoading(false);
    } else if (auth) {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const firebaseUser = result.user;

        // Google login devotee user
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${firebaseUser.displayName || 'Devotee'}`,
          isAdmin: false
        };
        setUser(profile);

        // Sync devotee to firestore
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Devotee',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        setShowLoginModal(false);
      } catch (error: any) {
        console.error('Google Sign-In Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const loginAsAdmin = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    const targetUsername = username.trim();

    if (isMockEnabled) {
      const creds = JSON.parse(
        localStorage.getItem(MOCK_ADMIN_CREDS_KEY) || JSON.stringify(DEFAULT_ADMIN_CREDS)
      );

      if (targetUsername === creds.username && password === creds.password) {
        localStorage.setItem('sawariya_admin_verified', 'true');
        const mockProfile: UserProfile = {
          uid: 'mock_admin',
          displayName: creds.name,
          email: ADMIN_EMAIL,
          photoURL: '🙏',
          isAdmin: true
        };
        setUser(mockProfile);
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockProfile));
        setIsAdminMode(true);
        sessionStorage.setItem(ADMIN_MODE_SESSION_KEY, 'true');
        setShowLoginModal(false);
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    }

    // Real Firebase Email/Password Authentication for Admin
    try {
      // 1. Authenticate with Firebase Auth first using email and password
      const result = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      const firebaseUser = result.user;

      // 2. Once authenticated, try reading custom admin username and name from Firestore
      let allowedUsername = 'admin';
      let allowedName = 'Manoj Kumar (Admin)';

      try {
        const docRef = doc(db, 'site_content', 'admin_profile');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          allowedUsername = docSnap.data().username || 'admin';
          allowedName = docSnap.data().name || 'Manoj Kumar (Admin)';
        } else {
          // If no doc exists, write it now that we are authenticated as Admin
          await setDoc(docRef, { username: 'admin', name: allowedName });
        }
      } catch (dbErr) {
        console.warn('Could not read admin profile from Firestore, using default allowed username "admin":', dbErr);
      }

      // 3. Verify if typed username matches configured allowed admin username (default 'admin')
      if (targetUsername.toLowerCase() !== allowedUsername.toLowerCase()) {
        console.error('Admin username mismatch');
        await firebaseSignOut(auth);
        setLoading(false);
        return false;
      }

      localStorage.setItem('sawariya_admin_verified', 'true');

      const profile: UserProfile = {
        uid: firebaseUser.uid,
        displayName: allowedName,
        email: firebaseUser.email,
        photoURL: '🙏',
        isAdmin: true
      };
      setUser(profile);
      setIsAdminMode(true);
      sessionStorage.setItem(ADMIN_MODE_SESSION_KEY, 'true');
      setShowLoginModal(false);
      setLoading(false);
      return true;
    } catch (err: any) {
      if (
        (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') &&
        password === 'Sawariya@123' &&
        targetUsername === 'admin'
      ) {
        try {
          console.log('Admin user account not found in Firebase Auth, auto-creating admin user...');
          const result = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, password);
          const firebaseUser = result.user;
          const allowedName = 'Manoj Kumar (Admin)';
          await updateProfile(firebaseUser, { displayName: allowedName });

          try {
            await setDoc(doc(db, 'site_content', 'admin_profile'), { username: 'admin', name: allowedName });
          } catch (dbErr) {
            console.warn('Could not write admin profile doc in Firestore:', dbErr);
          }

          localStorage.setItem('sawariya_admin_verified', 'true');

          const profile: UserProfile = {
            uid: firebaseUser.uid,
            displayName: allowedName,
            email: firebaseUser.email,
            photoURL: '🙏',
            isAdmin: true
          };
          setUser(profile);
          setIsAdminMode(true);
          sessionStorage.setItem(ADMIN_MODE_SESSION_KEY, 'true');
          setShowLoginModal(false);
          setLoading(false);
          return true;
        } catch (createErr) {
          console.error('Failed to auto-create admin user:', createErr);
        }
      }
      console.error('Credentials admin auth failed:', err);
      setLoading(false);
      return false;
    }
  };

  const signUpDevotee = async (name: string, usernameOrEmail: string, password: string) => {
    setLoading(true);
    const targetUser = usernameOrEmail.trim().toLowerCase();

    if (targetUser === 'admin') {
      setLoading(false);
      throw new Error('Username "admin" is reserved.');
    }

    if (isMockEnabled) {
      const mockUsers = JSON.parse(localStorage.getItem(MOCK_USERS_ARRAY_KEY) || '[]');
      const userExists = mockUsers.some((u: any) => u.username === targetUser || u.email === targetUser);

      if (userExists) {
        setLoading(false);
        throw new Error('Username or Email already registered.');
      }

      const mockProfile: UserProfile & { username: string; password: string } = {
        uid: `mock_user_${Date.now()}`,
        displayName: name,
        email: targetUser.includes('@') ? targetUser : `${targetUser}@sawariya.com`,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
        isAdmin: false,
        username: targetUser,
        password: password
      };

      mockUsers.push(mockProfile);
      localStorage.setItem(MOCK_USERS_ARRAY_KEY, JSON.stringify(mockUsers));
      setUser(mockProfile);
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockProfile));
      setShowLoginModal(false);
      setLoading(false);
      return;
    }

    // Real Firebase Sign Up for Devotees
    try {
      const email = targetUser.includes('@') ? targetUser : `${targetUser}@sawariya.com`;
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });

      // Save profile metadata in firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        name: name,
        username: targetUser,
        email: email,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
        createdAt: new Date().toISOString()
      });

      const profile: UserProfile = {
        uid: result.user.uid,
        displayName: name,
        email: email,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
        isAdmin: false
      };
      setUser(profile);
      setShowLoginModal(false);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const signInDevotee = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    setLoading(true);
    const targetUser = usernameOrEmail.trim().toLowerCase();

    // Check if it is the admin username
    let allowedAdminUsername = 'admin';
    if (isMockEnabled) {
      const creds = JSON.parse(
        localStorage.getItem(MOCK_ADMIN_CREDS_KEY) || JSON.stringify(DEFAULT_ADMIN_CREDS)
      );
      allowedAdminUsername = creds.username || 'admin';
    } else {
      try {
        const docSnap = await getDoc(doc(db, 'site_content', 'admin_profile'));
        if (docSnap.exists()) {
          allowedAdminUsername = docSnap.data().username || 'admin';
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (targetUser === allowedAdminUsername.toLowerCase() || targetUser === 'admin') {
      return loginAsAdmin(usernameOrEmail, password);
    }

    if (isMockEnabled) {
      const mockUsers = JSON.parse(localStorage.getItem(MOCK_USERS_ARRAY_KEY) || '[]');
      const foundUser = mockUsers.find((u: any) =>
        (u.username === targetUser || u.email === targetUser) && u.password === password
      );

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(foundUser));
        setShowLoginModal(false);
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    }

    // Real Firebase Devotee Sign In
    try {
      const email = targetUser.includes('@') ? targetUser : `${targetUser}@sawariya.com`;
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Load display name
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      let displayName = result.user.displayName;
      if (userDoc.exists() && userDoc.data().name) {
        displayName = userDoc.data().name;
      }

      const profile: UserProfile = {
        uid: result.user.uid,
        displayName: displayName || 'Devotee',
        email: result.user.email,
        photoURL: result.user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${displayName || 'Devotee'}`,
        isAdmin: false
      };
      setUser(profile);
      setShowLoginModal(false);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Devotee sign in failed:', err);
      setLoading(false);
      return false;
    }
  };

  const updateUserProfile = async (name: string, password?: string) => {
    setLoading(true);
    const targetName = name.trim();

    if (user?.isAdmin) {
      // If user is Admin, call updateAdminProfile instead
      let allowedAdminUsername = 'admin';
      if (isMockEnabled) {
        const creds = JSON.parse(
          localStorage.getItem(MOCK_ADMIN_CREDS_KEY) || JSON.stringify(DEFAULT_ADMIN_CREDS)
        );
        allowedAdminUsername = creds.username || 'admin';
      } else {
        try {
          const docSnap = await getDoc(doc(db, 'site_content', 'admin_profile'));
          if (docSnap.exists()) {
            allowedAdminUsername = docSnap.data().username || 'admin';
          }
        } catch (e) {
          console.error(e);
        }
      }
      await updateAdminProfile(targetName, allowedAdminUsername, password);
      setLoading(false);
      return;
    }

    if (isMockEnabled) {
      const mockUsers = JSON.parse(localStorage.getItem(MOCK_USERS_ARRAY_KEY) || '[]');
      const userIndex = mockUsers.findIndex((u: any) => u.uid === user?.uid);

      if (userIndex !== -1) {
        mockUsers[userIndex].displayName = targetName;
        mockUsers[userIndex].photoURL = `https://api.dicebear.com/7.x/adventurer/svg?seed=${targetName}`;
        if (password) {
          mockUsers[userIndex].password = password;
        }
        localStorage.setItem(MOCK_USERS_ARRAY_KEY, JSON.stringify(mockUsers));

        const updated = {
          ...mockUsers[userIndex]
        };
        setUser(updated);
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(updated));
      }
      setLoading(false);
      return;
    }

    // Real Firebase Devotee profile update
    if (!auth.currentUser) {
      setLoading(false);
      throw new Error('Not authenticated');
    }

    try {
      if (password) {
        await updatePassword(auth.currentUser, password);
      }
      const newPhotoURL = `https://api.dicebear.com/7.x/adventurer/svg?seed=${targetName}`;
      await updateProfile(auth.currentUser, {
        displayName: targetName,
        photoURL: newPhotoURL
      });

      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        name: targetName,
        photoURL: newPhotoURL,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setUser(prev => prev ? {
        ...prev,
        displayName: targetName,
        photoURL: newPhotoURL
      } : null);
      setLoading(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setLoading(false);
      throw err;
    }
  };

  const updateAdminProfile = async (name: string, username: string, password?: string) => {
    setLoading(true);
    const targetName = name.trim();
    const targetUsername = username.trim();

    if (isMockEnabled) {
      const creds = JSON.parse(
        localStorage.getItem(MOCK_ADMIN_CREDS_KEY) || JSON.stringify(DEFAULT_ADMIN_CREDS)
      );

      creds.name = targetName;
      creds.username = targetUsername;
      if (password) {
        creds.password = password;
      }

      localStorage.setItem(MOCK_ADMIN_CREDS_KEY, JSON.stringify(creds));
      setUser(prev => prev ? { ...prev, displayName: targetName } : null);

      const savedMockUser = localStorage.getItem(MOCK_USER_KEY);
      if (savedMockUser) {
        const profile = JSON.parse(savedMockUser);
        profile.displayName = targetName;
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(profile));
      }

      setLoading(false);
      return;
    }

    if (!auth.currentUser) {
      setLoading(false);
      throw new Error('Not authenticated');
    }

    try {
      if (password) {
        await updatePassword(auth.currentUser, password);
      }
      await updateProfile(auth.currentUser, { displayName: targetName });
      const docRef = doc(db, 'site_content', 'admin_profile');
      await setDoc(docRef, { username: targetUsername, name: targetName });

      setUser(prev => prev ? { ...prev, displayName: targetName } : null);
      setLoading(false);
    } catch (err) {
      console.error('Error updating admin profile:', err);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('sawariya_admin_verified');
    if (isMockEnabled) {
      setUser(null);
      setIsAdminMode(false);
      localStorage.removeItem(MOCK_USER_KEY);
      sessionStorage.removeItem(ADMIN_MODE_SESSION_KEY);
      setLoading(false);
    } else if (auth) {
      try {
        await firebaseSignOut(auth);
        setUser(null);
        setIsAdminMode(false);
        sessionStorage.removeItem(ADMIN_MODE_SESSION_KEY);
      } catch (error: any) {
        console.error('Logout Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin: !!user?.isAdmin,
      isAdminMode,
      loading,
      loginWithGoogle,
      loginAsAdmin,
      signUpDevotee,
      signInDevotee,
      updateUserProfile,
      updateAdminProfile,
      logout,
      isMock: isMockEnabled,
      confirmAdminMode,
      setAdminMode,
      showLoginModal,
      setShowLoginModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
