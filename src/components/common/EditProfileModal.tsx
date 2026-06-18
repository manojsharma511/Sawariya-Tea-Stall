import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { X, User, Key, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, updateUserProfile } = useAuth();
  
  const [name, setName] = useState(user?.displayName || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Sync state with user when modal opens or user changes
  useEffect(() => {
    if (isOpen && user) {
      setName(user.displayName || '');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess('');
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const targetName = name.trim();
    if (!targetName) {
      setError('Display Name is required!');
      return;
    }

    if (password) {
      if (password.length < 6) {
        setError('New password must be at least 6 characters long!');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match!');
        return;
      }
    }

    setSubmitting(true);
    try {
      await updateUserProfile(targetName, password || undefined);
      setSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white rounded-3xl w-full max-w-md p-8 border border-gray-150 shadow-2xl overflow-hidden z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-650 hover:bg-gray-100 rounded-xl transition-all"
            >
              <X size={16} />
            </button>

            {/* Saffron Gradient Header Bar */}
            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-saffron via-accent to-saffron" />

            <div className="w-12 h-12 bg-saffron/10 text-saffron rounded-2xl flex items-center justify-center mx-auto mb-5">
              <User className="w-6 h-6" />
            </div>

            <h2 className="font-heading text-xl font-bold text-secondary text-center mb-1">
              Edit Your Profile
            </h2>
            <p className="text-gray-400 text-xs text-center mb-6">
              Update your display name or rotate your credentials.
            </p>

            {/* Notifications */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-2.5 rounded-xl mb-4 text-center font-semibold flex items-center gap-1.5 justify-center">
                <CheckCircle2 size={14} className="text-green-500" />
                <span>{success}</span>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl mb-4 text-center font-semibold flex items-center gap-1.5 justify-center">
                <AlertCircle size={14} className="text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Display Name */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <User size={12} />
                  <span>Display Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Devotee"
                  className="w-full bg-cream border border-transparent focus:border-saffron/30 rounded-2xl px-4 py-3 text-secondary text-sm outline-none transition-all"
                  disabled={submitting}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Key size={12} />
                  <span>New Password</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••• (At least 6 chars)"
                  className="w-full bg-cream border border-transparent focus:border-saffron/30 rounded-2xl px-4 py-3 text-secondary text-sm outline-none transition-all"
                  disabled={submitting}
                />
                <span className="text-[10px] text-gray-400 block mt-1">Leave empty to keep your current password</span>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Key size={12} />
                  <span>Confirm Password</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-cream border border-transparent focus:border-saffron/30 rounded-2xl px-4 py-3 text-secondary text-sm outline-none transition-all"
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-saffron to-accent text-white rounded-full font-bold shadow-lg shadow-saffron/20 hover:scale-[1.01] active:scale-[0.99] transition-transform flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                <Save size={16} />
                <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
