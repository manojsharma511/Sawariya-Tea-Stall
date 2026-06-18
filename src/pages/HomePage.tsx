import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { MapPin, ArrowRight, Flame, Leaf, Heart, Star, Compass, ArrowDown } from 'lucide-react';
import SEO from '../components/common/SEO';
import socialData from '../data/social.json';
import { useCall } from '../hooks/useCall';
import { useRealTimeCollection, useRealTimeDocument } from '../hooks/useRealTime';
import { HeroConfig, ContactConfig, MenuItem, PriceDoc } from '../services/content.service';
import { Testimonial } from '../services/testimonial.service';
import testimonialsData from '../data/testimonials.json';
import Loader from '../components/common/Loader';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 }
};

const defaultHero: HeroConfig = {
  blessing: '🙏 श्री खाटू श्याम जी की जय 🙏',
  shopName: 'Sawariya Tea Stall',
  shopNameHi: 'साँवरिया टी स्टॉल',
  subtitle: 'Serving the finest spiced tea and warm snacks to devotees at Khatu Shyam Ji',
  subtitleHi: 'खाटू श्याम जी आओ, साँवरिया की स्पेशल चाय का मज़ा लो',
  bgImage: '/images/hero-bg.jpg'
};

const defaultContact: ContactConfig = {
  phone: '7340030949',
  whatsapp: '917340030949',
  email: 'mukeshsharma.khatu@gmail.com',
  address: 'Near Toran Gate, Khatu Shyam Ji, Rajasthan, India',
  addressHi: 'तोरण गेट के पास, खाटू श्याम जी, सीकर, राजस्थान',
  workingHours: {
    daily: '6:00 AM - 10:00 PM',
    dailyHi: 'सुबह 6 बजे से रात 10 बजे तक',
    festivals: 'Extended Hours',
    festivalsHi: 'त्योहारों के दिनों में अतिरिक्त समय तक खुली',
    ekadashi: 'Open Early',
    ekadashiHi: 'श्याम एकादशी पर जल्दी खुलती है'
  }
};

export default function HomePage() {
  const { makeCall } = useCall();

  // Real-time document subscriptions
  const { data: hero, loading: loadingHero } = useRealTimeDocument<HeroConfig>('site_content', 'hero', defaultHero);
  const { data: contact, loading: loadingContact } = useRealTimeDocument<ContactConfig>('site_content', 'contact', defaultContact);

  // Real-time collection subscriptions
  const { data: rawItems, loading: loadingItems } = useRealTimeCollection<MenuItem>('menu_items');
  const { data: rawPrices, loading: loadingPrices } = useRealTimeCollection<PriceDoc>('prices');
  const { data: rawReviews, loading: loadingReviews } = useRealTimeCollection<Testimonial>('testimonials');

  // Merge popular menu items in real-time
  const popularItems = useMemo(() => {
    const merged = rawItems.map(item => {
      const priceObj = rawPrices.find(p => p.id === item.id);
      return { ...item, price: priceObj ? priceObj.price : 0 };
    });
    return merged.filter(item => item.popular).slice(0, 3);
  }, [rawItems, rawPrices]);

  // Extract featured approved testimonials or static fallback
  const featuredReviews = useMemo(() => {
    const approved = rawReviews.filter(t => t.status === 'approved');
    if (approved && approved.length > 0) {
      return approved.slice(0, 3);
    }
    // Fallback static list
    return testimonialsData.slice(0, 3).map((t, idx) => ({
      id: `static_${idx}`,
      name: t.name,
      nameHi: t.nameHi,
      location: t.location,
      review: t.review,
      reviewHi: t.reviewHi || '',
      rating: t.rating,
      avatar: t.avatar,
      status: 'approved',
      createdAt: new Date().toISOString()
    })) as Testimonial[];
  }, [rawReviews]);

  const loading = loadingHero || loadingContact || loadingItems || loadingPrices || loadingReviews;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const specialties = [
    {
      icon: <Flame className="w-8 h-8 text-orange-600" />,
      title: 'Fresh Brewed',
      titleHi: 'ताज़ी चाय',
      description: 'Every cup is brewed fresh with premium tea leaves and whole spices for authentic flavor.',
      bgColor: 'bg-orange-50'
    },
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: 'Pure Ingredients',
      titleHi: 'शुद्ध सामग्री',
      description: 'We use only pure desi ghee, fresh milk, and hand-picked spices — no compromises.',
      bgColor: 'bg-green-50'
    },
    {
      icon: <Heart className="w-8 h-8 text-rose-600" />,
      title: 'Made with Love',
      titleHi: 'प्यार से बनी',
      description: 'Serving devotees with love and devotion, making every visit to Khatu Shyam Ji more special.',
      bgColor: 'bg-pink-50'
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-600" />,
      title: 'Best in Town',
      titleHi: 'सबसे बेहतरीन',
      description: 'Known for the best chai near Toran Gate — trusted by thousands of happy visitors every day.',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-cream min-h-screen"
    >
      <SEO pageKey="home" />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={hero.bgImage}
            alt="Sawariya Tea Stall Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/40 to-transparent" />
        </div>

        {/* Floating elements */}
        <div className="absolute top-24 left-10 text-6xl opacity-20 animate-float hidden md:block">☕</div>
        <div className="absolute top-44 right-20 text-4xl opacity-15 animate-float delay-300 hidden md:block">🍵</div>
        <div className="absolute bottom-44 left-20 text-5xl opacity-10 animate-float delay-500 hidden md:block">🫖</div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-16">
          <div className="mb-6 animate-fade-in-up">
            <span className="inline-block px-6 py-2 rounded-full glass text-saffron text-sm md:text-base font-hindi tracking-wide shadow-md">
              {hero.blessing}
            </span>
          </div>

          <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
            <span className="text-saffron">{hero.shopName.split(' ')[0]}</span>
          </h1>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-light text-white/90 mb-4 tracking-wider">
            {hero.shopName.split(' ').slice(1).join(' ')}
          </h2>
          <p className="font-hindi text-2xl md:text-3xl text-primary-light mb-6">
            {hero.shopNameHi}
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-saffron" />
            <span className="text-saffron text-2xl">☕</span>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-saffron" />
          </div>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-3 font-light leading-relaxed">
            {hero.subtitle}
          </p>
          <p className="font-hindi text-lg text-primary-light max-w-2xl mx-auto mb-10 leading-relaxed">
            {hero.subtitleHi}
          </p>
          <div className="flex items-center justify-center gap-2 text-white/60 text-sm md:text-base mb-10">
            <MapPin size={16} className="text-saffron shrink-0" />
            <span>{contact.address}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NavLink
              to="/menu"
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-saffron to-accent text-white rounded-full text-lg font-semibold shadow-2xl shadow-saffron/30 hover:shadow-saffron/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>View Our Menu</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </NavLink>
            <button
              onClick={() => makeCall(contact.phone)}
              className="w-full sm:w-auto px-8 py-4 glass text-white rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>📞 Call Mukesh Ji</span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#highlights" className="text-white/50 hover:text-saffron transition-colors flex flex-col items-center gap-2">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <ArrowDown size={18} />
          </a>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent" />
      </section>


      {/* --- BUSINESS HIGHLIGHTS (SPECIALTIES) --- */}
      <section id="highlights" className="py-20 md:py-28 bg-cream pattern-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-saffron/10 text-saffron rounded-full text-sm font-medium mb-4">
              ✨ Why Choose Us
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-secondary mb-4">
              What Makes Us <span className="text-saffron">Special</span>
            </h2>
            <p className="font-hindi text-xl text-primary-dark mb-4">हमारी खासियत</p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-saffron" />
              <div className="w-2 h-2 rounded-full bg-saffron" />
              <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-saffron" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {specialties.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-saffron/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-gray-100/50"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-saffron/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className={`w-16 h-16 rounded-2xl ${item.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>

                <h3 className="font-heading text-xl font-bold text-secondary mb-1 group-hover:text-saffron transition-colors">
                  {item.title}
                </h3>
                <p className="font-hindi text-sm text-primary-dark mb-3">{item.titleHi}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* --- BEST SELLERS / POPULAR ITEMS --- */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-saffron/10 text-saffron rounded-full text-sm font-medium mb-4">
              🔥 Best Sellers
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-secondary mb-4">
              Popular <span className="text-saffron">Chai & Snacks</span>
            </h2>
            <p className="font-hindi text-xl text-primary-dark mb-4">विशेष लोकप्रिय आइटम</p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-saffron" />
              <div className="w-2 h-2 rounded-full bg-saffron" />
              <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-saffron" />
            </div>
          </div>

          {popularItems.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">No featured best sellers currently.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {popularItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-saffron/10 hover:-translate-y-1.5 transition-all duration-500 border border-gray-100"
                >
                  <div className="relative h-56 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-orange-50/50 flex items-center justify-center text-4xl">☕</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 right-4 px-3.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                      <span className="font-heading text-lg font-bold text-saffron">₹{item.price}</span>
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold uppercase rounded-full flex items-center gap-1 shadow-md">
                        <Flame size={10} /> Popular
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold text-secondary mb-1 group-hover:text-saffron transition-colors">
                      {item.name}
                    </h3>
                    <p className="font-hindi text-sm text-primary-dark mb-3">{item.nameHi}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <NavLink
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-secondary hover:bg-saffron text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-300"
            >
              <span>Explore Full Menu</span>
              <ArrowRight size={16} />
            </NavLink>
          </div>
        </div>
      </section>


      {/* --- BLESSING / CTA BANNER --- */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-saffron via-accent to-saffron" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M20 0L40 20L20 40L0 20z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-white/30" />
            <span className="text-3xl">🙏</span>
            <div className="h-[1px] w-12 bg-white/30" />
          </div>

          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Visiting Khatu Shyam Ji?<br />
            <span className="text-yellow-200">Taste the Best Kulhad Chai!</span>
          </h2>
          <p className="font-hindi text-xl md:text-2xl text-white/95 mb-6">
            खाटू श्याम जी आओ, साँवरिया की स्पेशल चाय का मज़ा लो
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => makeCall(contact.phone)}
              className="w-full sm:w-auto px-8 py-4 bg-white text-accent rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all duration-300"
            >
              📞 Call: {contact.phone}
            </button>
            <NavLink
              to="/location"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300"
            >
              Get Directions 📍
            </NavLink>
          </div>
        </div>
      </section>


      {/* --- REVIEWS HIGHLIGHTS --- */}
      <section className="py-20 md:py-28 bg-cream pattern-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-saffron/10 text-saffron rounded-full text-sm font-medium mb-4">
              💬 Customer Reviews
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-secondary mb-4">
              Loved by <span className="text-saffron">Devotees</span>
            </h2>
            <p className="font-hindi text-xl text-primary-dark mb-4">ग्राहकों के प्यारे शब्द</p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-saffron" />
              <div className="w-2 h-2 rounded-full bg-saffron" />
              <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-saffron" />
            </div>
          </div>

          {featuredReviews.length === 0 ? (
            <p className="text-center text-gray-450 py-12 text-sm">No devotee reviews added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {featuredReviews.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-3xl p-8 shadow-lg shadow-black/5 hover:shadow-xl border border-gray-100 hover:border-saffron/10 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                      ))}
                      {[...Array(5 - t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-gray-200" />
                      ))}
                    </div>
                    <p className="text-gray-650 text-sm leading-relaxed mb-3 italic">"{t.review}"</p>
                    {t.reviewHi && <p className="font-hindi text-xs text-primary-dark mb-5">{t.reviewHi}</p>}
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron/20 to-accent/20 flex items-center justify-center text-lg overflow-hidden shrink-0">
                      {t.avatar && t.avatar.startsWith('http') ? (
                        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{t.avatar || '🧑'}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary text-sm">{t.name}</h4>
                      <p className="text-xs text-gray-400">{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <NavLink
              to="/testimonials"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-secondary hover:bg-saffron text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-300"
            >
              <span>See All Reviews</span>
              <ArrowRight size={16} />
            </NavLink>
          </div>
        </div>
      </section>


      {/* --- QUICK LOCATION PREVIEW --- */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-saffron/10 text-saffron rounded-full text-sm font-medium mb-4">
                📍 Location Preview
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-secondary mb-4">
                Find Us Near <span className="text-saffron">Toran Gate</span>
              </h2>
              <p className="font-hindi text-lg text-primary-dark mb-6">तोरण गेट के पास, खाटू श्याम जी</p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We are situated at a prime location right near the historic Toran Gate, the main gateway leading to the holy shrine of Shree Khatu Shyam Ji. Stop by on your way to the temple for a comforting cup of traditional spiced chai.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-saffron">
                    <MapPin size={18} />
                  </div>
                  <span className="text-sm font-medium text-secondary">{contact.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-saffron">
                    <Compass size={18} />
                  </div>
                  <span className="text-sm font-medium text-secondary">Just a few steps from Toran Gate</span>
                </div>
              </div>

              <NavLink
                to="/location"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-saffron to-accent text-white rounded-full font-bold shadow-xl shadow-saffron/30 hover:scale-105 transition-all duration-300"
              >
                <span>View Map & Directions</span>
                <ArrowRight size={16} />
              </NavLink>
            </div>

            {/* Map Frame Preview */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white h-[350px]">
              <iframe
                title="Sawariya Tea Stall Location Map"
                src={socialData.maps.embedUrl}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

    </motion.div>
  );
}
