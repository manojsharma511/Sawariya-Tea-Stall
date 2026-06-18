import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tag, Sparkles, Calendar, Coffee, MessageCircle } from 'lucide-react';
import SEO from '../components/common/SEO';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { useRealTimeCollection } from '../hooks/useRealTime';
import { OfferItem } from '../services/content.service';
import Loader from '../components/common/Loader';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 }
};

export default function OffersPage() {
  const { openWhatsApp } = useWhatsApp();
  const { data: rawOffers, loading } = useRealTimeCollection<OfferItem>('offers');

  // Filter only active offers
  const activeOffers = useMemo(() => {
    return rawOffers.filter(offer => offer.active);
  }, [rawOffers]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-cream min-h-screen pt-24 md:pt-32 pb-20"
    >
      <SEO pageKey="offers" />

      {/* --- Page Header --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <span className="inline-block px-4 py-1.5 bg-saffron/10 text-saffron rounded-full text-sm font-medium mb-4">
          🏷️ Special Offers
        </span>
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-secondary mb-4">
          Deals & <span className="text-saffron">Combos</span>
        </h1>
        <p className="font-hindi text-xl text-primary-dark mb-4">विशेष ऑफर्स</p>
        <div className="flex items-center justify-center gap-3">
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-saffron" />
          <div className="w-2 h-2 rounded-full bg-saffron" />
          <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-saffron" />
        </div>
        <p className="text-gray-500 max-w-xl mx-auto mt-4 text-sm md:text-base">
          Save money on your favorite traditional combinations. Check out our daily group savings and festival specials!
        </p>
      </div>

      {/* --- Offers Listing --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader />
          </div>
        ) : activeOffers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-lg mx-auto">
            <span className="text-4xl block mb-3">🏷️</span>
            <h3 className="font-heading text-xl font-bold text-secondary">No Active Offers</h3>
            <p className="text-gray-400 text-sm mt-1">There are no special promos available right now. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeOffers.map((offer) => {
              // Determine icon and theme color depending on category
              let cardIcon = <Tag className="w-6 h-6 text-saffron" />;
              let badgeBg = 'bg-saffron/10 text-saffron';
              let borderStyle = 'hover:border-saffron/30';
              
              if (offer.type === 'festival') {
                cardIcon = <Sparkles className="w-6 h-6 text-red-500" />;
                badgeBg = 'bg-red-50 text-red-500';
                borderStyle = 'hover:border-red-500/30';
              } else if (offer.type === 'seasonal') {
                cardIcon = <Calendar className="w-6 h-6 text-green-600" />;
                badgeBg = 'bg-green-50 text-green-600';
                borderStyle = 'hover:border-green-600/30';
              }

              return (
                <div
                  key={offer.id}
                  className={`bg-white rounded-3xl p-8 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-between relative overflow-hidden ${borderStyle}`}
                >
                  {/* Decorative background shape */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cream opacity-40 rounded-bl-full" />

                  <div>
                    {/* Top Badge and Icon */}
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center">
                        {cardIcon}
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${badgeBg}`}>
                        {offer.badge}
                      </span>
                    </div>

                    {/* Title and Translations */}
                    <h3 className="font-heading text-2xl font-bold text-secondary mb-1">
                      {offer.title}
                    </h3>
                    <p className="font-hindi text-base text-primary-dark mb-4">
                      {offer.titleHi}
                    </p>

                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      {offer.description}
                    </p>

                    {/* Hindi detailed desc */}
                    {offer.descriptionHi && (
                      <p className="font-hindi text-xs text-primary-dark/80 bg-cream p-4 rounded-2xl leading-relaxed mb-6 border border-primary-light/10">
                        {offer.descriptionHi}
                      </p>
                    )}
                  </div>

                  <div>
                    {/* Value / Validity indicators */}
                    <div className="pt-4 border-t border-gray-50 mb-6 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-gray-400 block uppercase font-bold tracking-wider">Benefit</span>
                        <span className="font-bold text-saffron text-sm">{offer.discount}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 block uppercase font-bold tracking-wider">Validity</span>
                        <span className="text-secondary font-semibold">{offer.validity}</span>
                      </div>
                    </div>

                    {/* Claim Offer CTA */}
                    <button
                      onClick={() => openWhatsApp(`Namaste Mukesh Ji! I want to claim the "${offer.title}" offer at Sawariya Tea Stall.`)}
                      className="w-full py-3 bg-secondary hover:bg-saffron text-white rounded-2xl font-semibold shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={16} />
                      <span>Claim Offer on WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- Catering Prompt --- */}
      <div className="mt-16 text-center max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md max-w-3xl mx-auto flex flex-col items-center">
          <Coffee className="w-10 h-10 text-saffron mb-4 animate-float" />
          <h3 className="font-heading text-2xl font-bold text-secondary mb-2">Pilgrimage Group Bookings</h3>
          <p className="text-gray-500 text-sm max-w-lg mb-6 leading-relaxed">
            Are you organizing a bus or tour package of devotees to Khatu Shyam Ji temple? Contact us in advance for discounted breakfast/tea packages customized to your travel times.
          </p>
          <button
            onClick={() => openWhatsApp("Namaste Mukesh Ji! We are bringing a pilgrim group to Khatu Shyam Ji and want to book tea packages.")}
            className="px-8 py-3.5 bg-gradient-to-r from-saffron to-accent text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
          >
            <span>💬 Inquire for Group Discount</span>
          </button>
        </div>
      </div>

    </motion.div>
  );
}
