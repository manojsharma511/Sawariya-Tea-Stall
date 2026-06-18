import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, MessageSquare, Coffee, Image, Settings, LogOut, ArrowLeft, Sparkles, DollarSign, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminTestimonials from './AdminTestimonials';
import AdminMenu from './AdminMenu';
import AdminGallery from './AdminGallery';
import AdminContent from './AdminContent';
import AdminOffers from './AdminOffers';
import AdminPrices from './AdminPrices';
import AdminProfile from './AdminProfile';
import SEO from '../../components/common/SEO';

type TabId = 'testimonials' | 'offers' | 'menu' | 'prices' | 'gallery' | 'content' | 'profile';

export default function AdminDashboard() {
  const { user, logout, isMock } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('testimonials');

  const tabs = [
    { id: 'testimonials' as TabId, label: 'Testimonials', icon: <MessageSquare size={16} />, desc: 'Approve, edit and delete customer reviews' },
    { id: 'offers' as TabId, label: 'Offers Management', icon: <Sparkles size={16} />, desc: 'Manage promotional coupons and live offers' },
    { id: 'menu' as TabId, label: 'Menu Items', icon: <Coffee size={16} />, desc: 'Add items, configure tags and descriptions' },
    { id: 'prices' as TabId, label: 'Prices Management', icon: <DollarSign size={16} />, desc: 'Real-time pricing for all menu items' },
    { id: 'gallery' as TabId, label: 'Gallery Images', icon: <Image size={16} />, desc: 'Upload images to the stall photo grid' },
    { id: 'content' as TabId, label: 'General Content', icon: <Settings size={16} />, desc: 'Configure hero, story, owner bio and phone' },
    { id: 'profile' as TabId, label: 'Admin Profile', icon: <User size={16} />, desc: 'Change admin username, name and security password' },
  ];

  return (
    <div className="bg-cream min-h-screen pt-24 md:pt-32 pb-24">
      <SEO pageKey="home" />

      {/* --- Main Dashboard Wrapper --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Top Header Card --- */}
        <div className="bg-secondary rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden mb-8 pattern-overlay">
          <div className="absolute top-0 right-0 p-6 opacity-5 select-none text-9xl">⚙️</div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-saffron text-white p-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Shield size={12} /> Admin Mode
                </span>
                {isMock && (
                  <span className="bg-yellow-500 text-white px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    Mock Mode Active
                  </span>
                )}
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold leading-tight">
                Sawariya <span className="text-saffron">Control Panel</span>
              </h1>
              <p className="font-hindi text-sm text-primary-light">
                मुकेश शर्मा जी - व्यवस्थापक डैशबोर्ड
              </p>
            </div>

            {/* Admin Profile & Log out */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-saffron flex items-center justify-center bg-saffron/10 text-lg">
                {user?.photoURL && user.photoURL.startsWith('http') ? (
                  <img src={user.photoURL} alt={user.displayName || 'Admin'} className="w-full h-full object-cover" />
                ) : (
                  <span>🙏</span>
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">{user?.displayName || 'Admin'}</p>
                <p className="text-[10px] text-white/50">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="ml-2 p-2 rounded-xl bg-white/10 hover:bg-red-550/25 text-white/80 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* --- Sidebar & Panel Container --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Dashboard Left Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-3">
            <a
              href="/"
              className="px-4 py-3 bg-white hover:bg-gray-50 border border-gray-100 text-secondary rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft size={14} />
              <span>Back to Public Site</span>
            </a>

            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider px-2 block mb-3">Management</span>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-semibold flex items-center gap-3 transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-saffron to-accent text-white shadow-lg shadow-saffron/15 scale-102 font-bold'
                      : 'text-secondary-light hover:bg-saffron/5 hover:text-saffron'
                  }`}
                >
                  <span className="shrink-0">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dashboard Main Panel View */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header info for currently active tab */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-heading font-bold text-secondary text-xl">
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <p className="text-gray-400 text-xs mt-1">
                {tabs.find(t => t.id === activeTab)?.desc}
              </p>
            </div>

            {/* Tab content renders */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'testimonials' && <AdminTestimonials />}
              {activeTab === 'offers' && <AdminOffers />}
              {activeTab === 'menu' && <AdminMenu />}
              {activeTab === 'prices' && <AdminPrices />}
              {activeTab === 'gallery' && <AdminGallery />}
              {activeTab === 'content' && <AdminContent />}
              {activeTab === 'profile' && <AdminProfile />}
            </motion.div>

          </div>

        </div>

      </div>
    </div>
  );
}
