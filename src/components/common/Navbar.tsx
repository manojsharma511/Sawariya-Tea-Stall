import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin, LogIn, LogOut, Shield } from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import businessData from '../../data/business.json';
import { useCall } from '../../hooks/useCall';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

/**
 * Responsive navigation bar with scroll state and active page highlights.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { pathname } = useLocation();
  const { makeCall } = useCall();
  const { user, isAdmin, isAdminMode, loginWithGoogle, logout, setShowLoginModal } = useAuth();

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Offers', path: '/offers' },
    { name: 'Location', path: '/location' },
    { name: 'Contact', path: '/contact' },
  ];

  // Dynamic layout styling
  const navbarBg = scrolled
    ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 md:top-0'
    : isHome
      ? 'bg-transparent'
      : 'bg-secondary md:top-0';

  const logoColorClass = scrolled ? 'text-secondary' : 'text-white';

  return (
    <>
      {/* Top Bar (Hidden when scrolled, or on other pages for brevity) */}
      <div className={`bg-secondary text-white text-xs sm:text-sm py-1.5 px-4 hidden md:block transition-all duration-300 ${scrolled ? 'h-0 opacity-0 overflow-hidden' : ''}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => makeCall(businessData.phone)}
              className="flex items-center gap-1.5 hover:text-saffron transition-colors text-left"
            >
              <Phone size={12} className="text-saffron" />
              <span>+91 {businessData.phone}</span>
            </button>
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-saffron" />
              <span>{businessData.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-[11px] text-white/75 flex items-center gap-1">
                Welcome, <span className="font-semibold text-saffron">{user.displayName}</span>
              </span>
            )}
            <span className="font-hindi text-saffron">{businessData.blessing}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'top-0 ' + navbarBg 
          : isHome 
            ? 'top-0 md:top-[34px] ' + navbarBg 
            : 'top-0 ' + navbarBg
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Redesigned Logo */}
            <NavLink to="/" className="flex items-center group">
              <Logo size={42} showText={true} className={logoColorClass} />
            </NavLink>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => `px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? scrolled
                        ? 'bg-saffron/10 text-saffron font-bold'
                        : 'bg-white/10 text-white font-bold'
                      : scrolled
                        ? 'text-secondary-light hover:text-saffron hover:bg-saffron/5'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Conditional Admin Link - Only shown if logged in as Admin and in Admin Mode */}
              {isAdmin && isAdminMode && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `px-3.5 py-2 rounded-full text-sm font-bold flex items-center gap-1 border transition-all duration-300 ${
                    isActive
                      ? 'bg-saffron text-white border-saffron shadow-md'
                      : scrolled
                        ? 'text-saffron border-saffron/30 hover:bg-saffron hover:text-white'
                        : 'text-saffron border-saffron/40 hover:bg-white hover:text-secondary'
                  }`}
                >
                  <Shield size={14} />
                  <span>Admin Panel</span>
                </NavLink>
              )}

              {/* Login / Auth trigger in navbar */}
              {user ? (
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200/20">
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="w-8 h-8 rounded-full overflow-hidden border border-saffron flex items-center justify-center bg-saffron/10 text-base shadow-sm hover:scale-105 active:scale-95 transition-all outline-none"
                    title="Edit Profile"
                  >
                    {user.photoURL && user.photoURL.startsWith('http') ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.photoURL || '🧑'}</span>
                    )}
                  </button>
                  <button
                    onClick={logout}
                    className={`p-2 rounded-full transition-colors ${
                      scrolled ? 'text-secondary hover:text-red-500 hover:bg-red-50' : 'text-white/80 hover:text-saffron hover:bg-white/5'
                    }`}
                    title="Sign Out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={`ml-2 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-all duration-300 ${
                    scrolled 
                      ? 'text-saffron hover:bg-saffron/10' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <LogIn size={15} />
                  <span>Sign In</span>
                </button>
              )}

              <button
                onClick={() => makeCall(businessData.phone)}
                className="ml-3 px-5 py-2.5 bg-gradient-to-r from-saffron to-accent text-white rounded-full text-sm font-semibold shadow-lg shadow-saffron/30 hover:shadow-xl hover:shadow-saffron/40 hover:scale-105 transition-all duration-300"
              >
                Call Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              {user && (
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="w-8 h-8 rounded-full overflow-hidden border border-saffron flex items-center justify-center bg-saffron/10 text-base shadow-sm hover:scale-105 active:scale-95 transition-all outline-none"
                  title="Edit Profile"
                >
                  {user.photoURL && user.photoURL.startsWith('http') ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.photoURL || '🧑'}</span>
                  )}
                </button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  scrolled ? 'text-secondary' : 'text-white'
                }`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ${
          isOpen ? 'max-h-[550px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/97 backdrop-blur-md border-t border-primary/10 shadow-xl">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-saffron/10 text-saffron font-bold'
                      : 'text-secondary-light hover:text-saffron hover:bg-saffron/5'
                  }`}
                >
                  {link.name}
                </NavLink>
              ))}

              {isAdmin && isAdminMode && (
                <NavLink
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-bold text-saffron border border-saffron/20 bg-saffron/5 ${
                    isActive ? 'bg-saffron/15 font-extrabold' : ''
                  }`}
                >
                  🛡️ Admin Panel
                </NavLink>
              )}

              {user ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Sign Out ({user.displayName})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowLoginModal(true);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-saffron hover:bg-saffron/5 transition-all flex items-center gap-2"
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  makeCall(businessData.phone);
                }}
                className="w-full mt-3 px-5 py-3 bg-gradient-to-r from-saffron to-accent text-white rounded-xl text-sm font-semibold text-center shadow-lg block"
              >
                📞 Call Now - {businessData.phone}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <EditProfileModal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} />
    </>
  );
}
