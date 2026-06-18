import { auth, isMockEnabled } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export const authService = {
  async signInWithGoogle(): Promise<any> {
    if (isMockEnabled) {
      throw new Error('Running in Mock Mode. Use AuthContext to perform mock sign-in.');
    }
    if (!auth) throw new Error('Firebase Auth not initialized.');
    
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  },

  async logOut(): Promise<void> {
    if (isMockEnabled) {
      return;
    }
    if (!auth) throw new Error('Firebase Auth not initialized.');
    await signOut(auth);
  }
};
