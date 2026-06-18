import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Save, User, Key, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

export default function AdminProfile() {
  const { user, isMock, updateAdminProfile } = useAuth();

  const [name, setName] = useState(user?.displayName || 'Mukesh Kumar (Admin)');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load custom username on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (isMock) {
        const savedMockCreds = localStorage.getItem('sawariya_mock_admin_creds');
        if (savedMockCreds) {
          try {
            const creds = JSON.parse(savedMockCreds);
            setUsername(creds.username || 'admin');
            setName(creds.name || 'Mukesh Kumar (Admin)');
          } catch (e) {
            console.error(e);
          }
        }
        return;
      }

      setLoading(true);
      try {
        const docSnap = await getDoc(doc(db, 'site_content', 'admin_profile'));
        if (docSnap.exists()) {
          setUsername(docSnap.data().username || 'admin');
          setName(docSnap.data().name || 'Mukesh Kumar (Admin)');
        }
      } catch (err) {
        console.error('Failed to load admin profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isMock, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const targetName = name.trim();
    const targetUser = username.trim();

    if (!targetName || !targetUser) {
      setErrorMsg('Name and Username are required!');
      return;
    }

    if (password) {
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long!');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match!');
        return;
      }
    }

    setSaving(true);
    try {
      await updateAdminProfile(targetName, targetUser, password || undefined);
      setSuccessMsg('Admin profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update admin profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p className="animate-pulse">Loading profile settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h4 className="font-heading font-bold text-secondary text-base">Admin Security Settings</h4>
        <p className="text-gray-400 text-xs mt-0.5">Update administrative access details. Change username or password immediately to prevent unauthorized entry.</p>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl flex items-center gap-2 animate-scale-in text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 text-green-500 animate-bounce" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-2 animate-scale-in text-sm font-semibold">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Admin Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                <User size={13} />
                <span>Admin Display Name</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mukesh Kumar"
                className="w-full bg-cream border border-transparent focus:border-saffron/20 rounded-xl px-4 py-3 text-secondary text-sm outline-none transition-all"
                disabled={saving}
              />
            </div>

            {/* Username */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                <Shield size={13} />
                <span>Login Username</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin_stall"
                className="w-full bg-cream border border-transparent focus:border-saffron/20 rounded-xl px-4 py-3 text-secondary text-sm outline-none transition-all"
                disabled={saving}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                <Key size={13} />
                <span>New Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••• (At least 6 chars)"
                className="w-full bg-cream border border-transparent focus:border-saffron/20 rounded-xl px-4 py-3 text-secondary text-sm outline-none transition-all"
                disabled={saving}
              />
              <span className="text-[10px] text-gray-400 block mt-1">Leave empty to keep current password</span>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                <Key size={13} />
                <span>Confirm New Password</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-cream border border-transparent focus:border-saffron/20 rounded-xl px-4 py-3 text-secondary text-sm outline-none transition-all"
                disabled={saving}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-55/60 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3.5 bg-secondary hover:bg-saffron text-white rounded-full font-bold shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5 text-xs disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? 'Updating...' : 'Save Profile & Credentials'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
