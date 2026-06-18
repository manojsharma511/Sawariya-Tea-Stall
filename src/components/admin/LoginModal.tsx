import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Shield, Key, Sparkles, X, LogIn, UserPlus, User } from 'lucide-react';

export default function LoginModal() {
  const { 
    showLoginModal, 
    setShowLoginModal, 
    loginWithGoogle, 
    signInDevotee, 
    signUpDevotee 
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isAdminSectionOpen, setIsAdminSectionOpen] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  
  // Sign In state
  const [signInUser, setSignInUser] = useState('');
  const [signInPass, setSignInPass] = useState('');
  
  // Sign Up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpUser, setSignUpUser] = useState('');
  const [signUpPass, setSignUpPass] = useState('');
  const [signUpConfirmPass, setSignUpConfirmPass] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const user = signInUser.trim();
    const pass = signInPass.trim();

    if (!user || !pass) {
      setError('Please fill in both username/email and password!');
      return;
    }

    setSubmitting(true);
    try {
      const ok = await signInDevotee(user, pass);
      if (!ok) {
        setError('Invalid username/email or password!');
      } else {
        // Clear fields
        setSignInUser('');
        setSignInPass('');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const name = signUpName.trim();
    const username = signUpUser.trim();
    const pass = signUpPass.trim();
    const confirm = signUpConfirmPass.trim();

    if (!name || !username || !pass || !confirm) {
      setError('Please fill in all registration fields!');
      return;
    }

    if (pass.length < 6) {
      setError('Password must be at least 6 characters long!');
      return;
    }

    if (pass !== confirm) {
      setError('Passwords do not match!');
      return;
    }

    setSubmitting(true);
    try {
      await signUpDevotee(name, username, pass);
      setSuccess('Account registered successfully! Welcome aboard.');
      setTimeout(() => {
        // Clear fields
        setSignUpName('');
        setSignUpUser('');
        setSignUpPass('');
        setSignUpConfirmPass('');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different username/email.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSecretClick = () => {
    const nextClicks = secretClicks + 1;
    setSecretClicks(nextClicks);
    if (nextClicks >= 5) {
      setIsAdminSectionOpen(true);
      setSecretClicks(0); // reset
    }
  };

  const resetAll = () => {
    setShowLoginModal(false);
    setIsAdminSectionOpen(false);
    setSecretClicks(0);
    setError('');
    setSuccess('');
  };

  return (
    <AnimatePresence>
      {showLoginModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={resetAll}
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
              onClick={resetAll}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-650 hover:bg-gray-100 rounded-xl transition-all"
            >
              <X size={16} />
            </button>

            {/* Saffron Gradient Header Bar */}
            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-saffron via-accent to-saffron" />

            {/* Icon (Secret Trigger) */}
            <div 
              onClick={handleSecretClick}
              className="w-14 h-14 bg-saffron/10 text-saffron rounded-2xl flex items-center justify-center mx-auto mb-5 cursor-pointer select-none active:scale-95 transition-transform"
              title="जय श्री श्याम"
            >
              <Sparkles className="w-7 h-7" />
            </div>

            <h2 className="font-heading text-2xl font-bold text-secondary text-center mb-1">
              Join Sawariya Tea Stall
            </h2>
            <p 
              onClick={handleSecretClick}
              className="font-hindi text-sm text-primary-dark text-center mb-6 cursor-pointer select-none"
            >
              जय श्री श्याम - लॉगिन एवं पंजीकरण
            </p>

            {/* Success & Error Banner */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-2.5 rounded-xl mb-4 text-center font-semibold">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl mb-4 text-center font-semibold animate-shake">
                {error}
              </div>
            )}

            {/* Tabbed Selectors */}
            {!isAdminSectionOpen && (
              <div className="flex border-b border-gray-100 mb-5 relative">
                <button
                  onClick={() => {
                    setActiveTab('signin');
                    setError('');
                  }}
                  className={`flex-1 pb-3 text-sm font-bold transition-all relative ${
                    activeTab === 'signin' ? 'text-saffron' : 'text-gray-400 hover:text-secondary'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <LogIn size={14} />
                    <span>Sign In</span>
                  </span>
                  {activeTab === 'signin' && (
                    <motion.div 
                      layoutId="activeTabIndicator" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-saffron" 
                    />
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('signup');
                    setError('');
                  }}
                  className={`flex-1 pb-3 text-sm font-bold transition-all relative ${
                    activeTab === 'signup' ? 'text-saffron' : 'text-gray-400 hover:text-secondary'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <UserPlus size={14} />
                    <span>Sign Up</span>
                  </span>
                  {activeTab === 'signup' && (
                    <motion.div 
                      layoutId="activeTabIndicator" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-saffron" 
                    />
                  )}
                </button>
              </div>
            )}

            {/* Tab Contents */}
            <AnimatePresence mode="wait">
              {isAdminSectionOpen ? (
                // Secret Admin Form
                <motion.form
                  key="admin-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSignInSubmit}
                  className="space-y-4 text-left"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                      <Shield size={10} />
                      <span>Secret Admin Portal</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdminSectionOpen(false);
                        setError('');
                      }}
                      className="text-[9px] font-semibold text-red-500 hover:underline"
                    >
                      Return to Devotee Auth
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      value={signInUser}
                      onChange={(e) => setSignInUser(e.target.value)}
                      placeholder="Admin Username"
                      className="w-full bg-cream border border-transparent focus:border-saffron/20 rounded-2xl px-4 py-2.5 text-secondary text-xs outline-none transition-all"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      required
                      value={signInPass}
                      onChange={(e) => setSignInPass(e.target.value)}
                      placeholder="Admin Password"
                      className="w-full bg-cream border border-transparent focus:border-saffron/20 rounded-2xl px-4 py-2.5 text-secondary text-xs outline-none transition-all"
                      disabled={submitting}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-secondary hover:bg-saffron text-white rounded-full font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    <Key size={12} />
                    <span>{submitting ? 'Verifying Admin...' : 'Login as Admin'}</span>
                  </button>
                </motion.form>
              ) : activeTab === 'signin' ? (
                // Devotee Sign In
                <motion.form
                  key="signin-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSignInSubmit}
                  className="space-y-4"
                >
                  <div>
                    <input
                      type="text"
                      required
                      value={signInUser}
                      onChange={(e) => setSignInUser(e.target.value)}
                      placeholder="Username or Email"
                      className="w-full bg-cream border border-transparent focus:border-saffron/20 rounded-2xl px-4 py-3 text-secondary text-sm outline-none transition-all"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      required
                      value={signInPass}
                      onChange={(e) => setSignInPass(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-cream border border-transparent focus:border-saffron/20 rounded-2xl px-4 py-3 text-secondary text-sm outline-none transition-all"
                      disabled={submitting}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-gradient-to-r from-saffron to-accent text-white rounded-full font-bold shadow-lg shadow-saffron/20 hover:scale-[1.01] transition-transform flex items-center justify-center gap-1.5 text-sm"
                  >
                    <LogIn size={15} />
                    <span>{submitting ? 'Signing In...' : 'Sign In'}</span>
                  </button>
                </motion.form>
              ) : (
                // Devotee Sign Up
                <motion.form
                  key="signup-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSignUpSubmit}
                  className="space-y-3.5"
                >
                  <div>
                    <input
                      type="text"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-cream border border-transparent focus:border-saffron/20 rounded-2xl px-4 py-3 text-secondary text-sm outline-none transition-all"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      value={signUpUser}
                      onChange={(e) => setSignUpUser(e.target.value)}
                      placeholder="Desired Username or Email"
                      className="w-full bg-cream border border-transparent focus:border-saffron/20 rounded-2xl px-4 py-3 text-secondary text-sm outline-none transition-all"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      required
                      value={signUpPass}
                      onChange={(e) => setSignUpPass(e.target.value)}
                      placeholder="Password (Min 6 chars)"
                      className="w-full bg-cream border border-transparent focus:border-saffron/20 rounded-2xl px-4 py-3 text-secondary text-sm outline-none transition-all"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      required
                      value={signUpConfirmPass}
                      onChange={(e) => setSignUpConfirmPass(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full bg-cream border border-transparent focus:border-saffron/20 rounded-2xl px-4 py-3 text-secondary text-sm outline-none transition-all"
                      disabled={submitting}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-gradient-to-r from-saffron to-accent text-white rounded-full font-bold shadow-lg shadow-saffron/20 hover:scale-[1.01] transition-transform flex items-center justify-center gap-1.5 text-sm"
                  >
                    <UserPlus size={15} />
                    <span>{submitting ? 'Registering...' : 'Create Account'}</span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Separator & Google OAuth (Alternative devotee access) */}
            {!isAdminSectionOpen && (
              <div className="mt-5 space-y-4">
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-gray-100" />
                  <span className="px-3 text-gray-400 text-[10px] uppercase font-bold tracking-wider">or sign in with</span>
                  <div className="flex-grow border-t border-gray-100" />
                </div>

                <button
                  onClick={loginWithGoogle}
                  className="w-full py-3 bg-white border border-gray-200 text-secondary hover:bg-cream rounded-full font-bold transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.65 1.4 7.56l3.85 2.99C6.18 7.39 8.87 5.04 12 5.04z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.25 14.45A6.974 6.974 0 0 1 4.79 12c0-.85.15-1.68.46-2.45L1.4 6.56C.51 8.2.01 10.04.01 12c0 1.96.5 3.8 1.39 5.44l3.85-2.99z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.1.74-2.52 1.18-4.23 1.18-3.13 0-5.82-2.35-6.75-5.51l-3.85 2.99C3.37 20.35 7.35 23 12 23z"
                    />
                  </svg>
                  <span>Google Account</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
