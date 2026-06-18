import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FloatingCallButton from '../components/common/FloatingCallButton';
import FloatingWhatsApp from '../components/common/FloatingWhatsApp';
import ScrollToTop from '../components/common/ScrollToTop';
import LoginModal from '../components/admin/LoginModal';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Common Layout shell wrapping all pages with standard navigation, footers, CTAs, and scroll managers.
 */
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="bg-cream min-h-screen flex flex-col justify-between overflow-x-hidden">
      <ScrollToTop />
      <LoginModal />
      <Navbar />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
      <FloatingCallButton />
      <FloatingWhatsApp />
    </div>
  );
}

