import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/common/SEO';
import { useRealTimeCollection } from '../hooks/useRealTime';
import { GalleryItem } from '../services/content.service';
import { GallerySkeleton } from '../components/common/Skeletons';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 }
};

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Real-time subscription to the gallery collection
  const { data: galleryItems, loading } = useRealTimeCollection<GalleryItem>('gallery');

  const tabs = [
    { id: 'all', name: 'All Photos', emoji: '📸' },
    { id: 'tea', name: 'Brewed Tea', emoji: '☕' },
    { id: 'shop', name: 'Stall & Shop', emoji: '🏪' },
    { id: 'snacks', name: 'Snacks', emoji: '🥟' },
    { id: 'customer', name: 'Devotees & Temple', emoji: '🙏' }
  ];

  // Filter gallery items
  const filteredGallery = useMemo(() => {
    if (activeTab === 'all') return galleryItems;
    return galleryItems.filter(item => item.category === activeTab);
  }, [activeTab, galleryItems]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-saffron/10 text-saffron rounded-full text-sm font-medium mb-4">
            📸 Gallery
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-secondary mb-4">
            Chai <span className="text-saffron">Moments</span>
          </h1>
          <p className="font-hindi text-xl text-primary-dark mb-4">फोटो गैलरी</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GallerySkeleton />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-cream min-h-screen pt-24 md:pt-32 pb-20"
    >
      <SEO pageKey="gallery" />

      {/* --- Page Header --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <span className="inline-block px-4 py-1.5 bg-saffron/10 text-saffron rounded-full text-sm font-medium mb-4">
          📸 Gallery
        </span>
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-secondary mb-4">
          Chai <span className="text-saffron">Moments</span>
        </h1>
        <p className="font-hindi text-xl text-primary-dark mb-4">फोटो गैलरी</p>
        <div className="flex items-center justify-center gap-3">
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-saffron" />
          <div className="w-2 h-2 rounded-full bg-saffron" />
          <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-saffron" />
        </div>
        <p className="text-gray-500 max-w-xl mx-auto mt-4 text-sm md:text-base">
          Take a look at our freshly brewed tea varieties, crispy Indian snacks, and cozy stall moments near the holy Toran Gate.
        </p>
      </div>

      {/* --- Navigation Tabs --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-center flex-wrap gap-2.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-saffron to-accent text-white shadow-lg shadow-saffron/20 scale-105'
                : 'bg-white text-secondary-light hover:bg-saffron/10 hover:text-saffron border border-gray-100'
            }`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* --- Masonry Grid Display --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredGallery.map((img, index) => {
              // Custom height distribution for masonry feel
              const heights = ['h-64', 'h-72', 'h-56', 'h-80', 'h-64', 'h-72', 'h-56', 'h-68'];
              const customHeight = heights[index % heights.length];

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={img.id || img.src}
                  className="group relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 break-inside-avoid bg-white"
                >
                  <div className={customHeight}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/hero-bg.jpg';
                      }}
                    />
                  </div>

                  {/* Dark Glass Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                    <div className="p-6 w-full">
                      <span className="text-[10px] uppercase font-bold text-saffron tracking-widest bg-saffron/10 px-2.5 py-1 rounded-full inline-block mb-2">
                        {img.category}
                      </span>
                      <h4 className="text-white font-heading font-bold text-lg leading-tight">
                        {img.caption}
                      </h4>
                      <p className="text-white/70 font-hindi text-sm mt-1">
                        {img.captionHi}
                      </p>
                    </div>
                  </div>

                  {/* Icon Indicator top-right */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-sm border border-white/10">
                    📷
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* --- Call to Action --- */}
      <div className="mt-16 text-center max-w-7xl mx-auto px-4">
        <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-saffron/5 to-accent/5 border border-saffron/20 rounded-3xl">
          <span className="text-2xl">📸</span>
          <div className="text-left">
            <p className="text-sm font-semibold text-secondary">Want to share your own Chai Moment with us?</p>
            <p className="text-xs text-gray-500">Visit our stall, take a snapshot, tag us, or send it to us on WhatsApp!</p>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
