import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';
import Logo from '../common/Logo';
import { Lock, ShieldAlert, Key, LogIn, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  const { user, isAdmin, isAdminMode, loading, loginAsAdmin, confirmAdminMode } = useAuth();
  
  // Credentials form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    const handleDbError = () => setDbError(true);
    window.addEventListener('sawariya_db_permission_error', handleDbError);
    return () => window.removeEventListener('sawariya_db_permission_error', handleDbError);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const targetUser = username.trim();
    const targetPass = password.trim();

    if (!targetUser || !targetPass) {
      setError('Please enter both username and password!');
      return;
    }

    setSubmitting(true);
    try {
      const success = await loginAsAdmin(targetUser, targetPass);
      if (!success) {
        setError('Invalid admin credentials! Please check username or password.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // If not logged in as admin (either not logged in at all, or logged in as standard devotee)
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl text-center relative overflow-hidden"
        >
          {/* Top Saffron/Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-saffron via-accent to-saffron" />
          
          {/* Logo */}
          <div className="flex justify-center mb-6 mt-2">
            <Logo size={56} showText={false} className="text-secondary" />
          </div>

          <h2 className="font-heading text-2xl font-bold text-secondary mb-1">
            Sawariya Admin Portal
          </h2>
          <p className="font-hindi text-sm text-primary-dark mb-6">
            सवारिया व्यवस्थापक लॉगिन
          </p>
          
          {error && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-2xl mb-4 text-left font-semibold"
            >
              {error}
            </motion.div>
          )}

          {/* Credentials Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full bg-cream border border-transparent focus:border-saffron/30 rounded-2xl px-4 py-3 text-secondary text-sm outline-none transition-all"
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-cream border border-transparent focus:border-saffron/30 rounded-2xl px-4 py-3 text-secondary text-sm outline-none transition-all"
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-saffron to-accent text-white rounded-full font-bold shadow-lg shadow-saffron/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <LogIn size={16} />
              <span>{submitting ? 'Verifying Credentials...' : 'Sign In as Admin'}</span>
            </button>
          </form>

          {/* Helper link back to home */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex justify-between items-center text-xs">
            <a
              href="/"
              className="text-gray-400 hover:text-saffron transition-colors flex items-center gap-1 font-semibold"
            >
              <ArrowLeft size={12} />
              <span>Back to Home</span>
            </a>
            <span className="text-gray-400 flex items-center gap-1">
              <Lock size={12} />
              <span>Secure Session</span>
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // If user is Admin, but Admin Mode is not currently active (fallback, though loginAsAdmin sets it true)
  if (isAdmin && !isAdminMode) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-saffron via-accent to-saffron" />
          
          <div className="w-16 h-16 bg-saffron/10 text-saffron rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={32} className="animate-pulse" />
          </div>

          <h2 className="font-heading text-2xl font-bold text-secondary mb-2">
            Activate Admin Mode?
          </h2>
          <p className="font-hindi text-sm text-primary-dark mb-4">
            क्या व्यवस्थापक मोड सक्रिय करना है?
          </p>
          
          <p className="text-gray-500 text-sm mb-8">
            You are logged in as the Site Admin ({user.email}), but your session is currently in standard browse mode. Please activate Admin Mode to enter the control panel.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => confirmAdminMode(true)}
              className="w-full py-3.5 bg-gradient-to-r from-saffron to-accent text-white rounded-full font-bold shadow-lg shadow-saffron/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              <span>Activate Admin Mode</span>
            </button>
            
            <a
              href="/"
              className="block w-full py-3.5 bg-cream hover:bg-cream-dark text-secondary font-semibold rounded-full text-sm transition-all"
            >
              Browse as Regular User
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Authorized and Admin Mode active
  return (
    <>
      {dbError && (
        <div className="bg-red-500 text-white text-sm font-bold p-3 text-center sticky top-0 z-[100] flex items-center justify-center gap-2 shadow-md">
          <ShieldAlert size={18} className="shrink-0" />
          <span>⚠️ DATABASE DISCONNECTED: Firestore Security Rules are blocking access. Please run `npx firebase-tools deploy --only firestore:rules` in your terminal to enable updates.</span>
        </div>
      )}
      {children}
    </>
  );
}
