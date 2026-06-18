import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Loader from '../components/common/Loader';

// Lazy Loaded Page Views
const HomePage = lazy(() => import('../pages/HomePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const MenuPage = lazy(() => import('../pages/MenuPage'));
const GalleryPage = lazy(() => import('../pages/GalleryPage'));
const TestimonialsPage = lazy(() => import('../pages/TestimonialsPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const LocationPage = lazy(() => import('../pages/LocationPage'));
const OffersPage = lazy(() => import('../pages/OffersPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
import AdminProtected from '../components/admin/AdminProtected';

/**
 * Declares all paths and lazy loads views under a unified Suspense fallback.
 */
export default function AppRoutes() {
  return (
    <MainLayout>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/admin" element={<AdminProtected><AdminDashboard /></AdminProtected>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

