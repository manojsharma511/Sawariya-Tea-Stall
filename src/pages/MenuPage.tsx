import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Flame, Star, Coffee as CoffeeIcon } from 'lucide-react';
import SEO from '../components/common/SEO';
import { CATEGORIES } from '../utils/constants';
import { useRealTimeCollection } from '../hooks/useRealTime';
import { MenuItem, PriceDoc } from '../services/content.service';
import { MenuSkeleton } from '../components/common/Skeletons';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 }
};

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Real-time subscriptions to menu_items and prices collections
  const { data: rawItems, loading: loadingItems } = useRealTimeCollection<MenuItem>('menu_items');
  const { data: rawPrices, loading: loadingPrices } = useRealTimeCollection<PriceDoc>('prices');

  // Merge items and prices in real-time
  const menuItems = useMemo(() => {
    return rawItems.map(item => {
      const priceObj = rawPrices.find(p => p.id === item.id);
      return { ...item, price: priceObj ? priceObj.price : 0 };
    });
  }, [rawItems, rawPrices]);

  const loading = loadingItems || loadingPrices;

  // Filter and Search items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category match
      const categoryMatch = activeCategory === 'all' || item.category === activeCategory;

      // Search match (name, nameHi, description, category)
      const query = searchQuery.toLowerCase().trim();
      const searchMatch = !query || 
        item.name.toLowerCase().includes(query) ||
        item.nameHi.includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, searchQuery, menuItems]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-cream min-h-screen pt-24 md:pt-32 pb-20"
    >
      <SEO pageKey="menu" />

      {/* --- Page Header --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <span className="inline-block px-4 py-1.5 bg-saffron/10 text-saffron rounded-full text-sm font-medium mb-4">
          🍵 Best Chai & Snacks in Khatu Shyam Ji
        </span>
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-secondary mb-4">
          Famous <span className="text-saffron">Kulhad Chai</span> & Snacks Menu
        </h1>
        <p className="font-hindi text-xl text-primary-dark mb-4">खाटू श्याम जी का सबसे बेहतरीन मेन्यू</p>
        <div className="flex items-center justify-center gap-3">
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-saffron" />
          <div className="w-2 h-2 rounded-full bg-saffron" />
          <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-saffron" />
        </div>
        <p className="text-gray-500 max-w-xl mx-auto mt-4 text-sm md:text-base">
          Best Kulhad Chai | Masala Chai | Special Tea | Snacks near Toran Gate Khatu Shyam Ji
        </p>
      </div>

      {/* --- Search and Filter Area --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white rounded-3xl p-6 shadow-md border border-gray-100">
          
          {/* Categories Tab Bar */}
          <div className="flex flex-wrap gap-2.5 order-2 md:order-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-saffron to-accent text-white shadow-lg shadow-saffron/20 scale-105'
                    : 'bg-cream text-secondary-light hover:bg-saffron/10 hover:text-saffron'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 order-1 md:order-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chai or snacks..."
              className="w-full bg-cream rounded-full pl-12 pr-4 py-3 text-secondary text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron/20 border border-transparent focus:border-saffron/30 transition-all"
            />
          </div>

        </div>
      </div>

      {/* --- Menu Grid Display --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <MenuSkeleton />
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="font-heading text-xl font-bold text-secondary mb-1">No Items Found</h3>
            <p className="text-gray-400 text-sm">We couldn't find anything matching "{searchQuery}"</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-md shadow-black/5 hover:shadow-2xl hover:shadow-saffron/15 hover:-translate-y-1.5 transition-all duration-500 border border-gray-100 flex flex-col justify-between"
                >
                  {/* Item Image & Badge overlay */}
                  <div className="relative h-48 overflow-hidden">
                     {item.image ? (
                       <img
                         src={item.image}
                         alt={`Famous ${item.name} in Khatu Shyam Ji - Best Tea Stall near Toran Gate`}
                         loading="lazy"
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                         onError={(e) => {
                           e.currentTarget.onerror = null;
                           e.currentTarget.src = '/images/masala-chai.jpg';
                         }}
                       />
                     ) : (
                      <div className="w-full h-full bg-orange-50/50 flex items-center justify-center text-4xl">☕</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    
                    {/* Price Tag */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                      <span className="font-heading text-lg font-bold text-saffron">₹{item.price}</span>
                    </div>

                    {/* Popular/New Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {item.popular && (
                        <span className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold uppercase rounded-full flex items-center gap-1 shadow-md">
                          <Flame size={10} /> Popular
                        </span>
                      )}
                      {item.new && (
                        <span className="px-2.5 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold uppercase rounded-full flex items-center gap-1 shadow-md">
                          <Star size={10} /> New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card description */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-heading text-lg font-bold text-secondary group-hover:text-saffron transition-colors">
                            {item.name}
                          </h3>
                          <p className="font-hindi text-sm text-primary-dark">{item.nameHi}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">{item.description}</p>
                    </div>
                    
                    {/* Quick indicator */}
                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                      <span className="uppercase tracking-wider">{item.category} Category</span>
                      <CoffeeIcon size={12} className="text-saffron/40" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* --- Footer Notes --- */}
      <div className="mt-16 text-center max-w-7xl mx-auto px-4">
        <div className="inline-flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-3xl shadow-sm">
          <span className="text-2xl">💡</span>
          <div className="text-left text-xs text-gray-500">
            <p className="font-semibold text-secondary">Note on Pricing:</p>
            <p>Prices are subject to minor modifications during festive seasons or Melas. <span className="font-hindi text-primary-dark ml-1">कीमतों में थोड़ा बदलाव हो सकता है।</span></p>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
