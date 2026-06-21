import { motion } from 'framer-motion';
import { Coffee, Users, Clock, Award, ShieldCheck, Star, Heart } from 'lucide-react';
import SEO from '../components/common/SEO';
import { useRealTimeDocument } from '../hooks/useRealTime';
import { AboutConfig, ContactConfig } from '../services/content.service';
import { useCall } from '../hooks/useCall';
import { HomeSkeleton } from '../components/common/Skeletons';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20 }
};

const iconMap: Record<string, React.ReactNode> = {
  Coffee: <Coffee className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Clock: <Clock className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-saffron" />,
  Star: <Star className="w-6 h-6 text-saffron" />,
  Heart: <Heart className="w-6 h-6 text-saffron" />,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || <Coffee className="w-6 h-6" />;
};

const defaultAbout: AboutConfig = {
  story: 'Welcome to Sawariya Tea Stall near Toran Gate...',
  storyHi: 'साँवरिया टी स्टॉल में आपका स्वागत है...',
  ownerName: 'Mukesh Kumar',
  ownerNameHi: 'मनोज कुमार',
  ownerTitle: 'Owner & Tea Master',
  ownerImage: '/sawariya-photos/a251a44f-d0aa-4c88-894c-b0ccf80c16ad.png',
  stats: [
    { icon: 'Coffee', value: '1000+', label: 'Cups Daily', labelHi: 'कप प्रतिदिन' },
    { icon: 'Users', value: '10K+', label: 'Happy Customers', labelHi: 'खुश ग्राहक' },
    { icon: 'Clock', value: '6AM - 10PM', label: 'Open Hours', labelHi: 'खुलने का समय' },
    { icon: 'Award', value: 'Premium', label: 'Near Toran Gate', labelHi: 'तोरण गेट पर' }
  ],
  coreValues: [
    {
      icon: 'ShieldCheck',
      title: 'Uncompromised Purity',
      titleHi: 'शुद्धता की गारंटी',
      description: 'We use premium Assam tea leaves, fresh thick milk, and pure spices. We never use artificial flavors or colors.'
    },
    {
      icon: 'Star',
      title: 'Consistency of Taste',
      titleHi: 'स्वाद में निरंतरता',
      description: 'Every cup is prepared with exact measurements of spices, ginger, and cardamom, ensuring the same rich taste every single day.'
    },
    {
      icon: 'Heart',
      title: 'Service with Devotion',
      titleHi: 'सेवा भाव',
      description: 'As we serve devotees visiting Khatu Shyam Ji, we treat our service as an offering to Shyam Baba, welcoming everyone with warmth.'
    }
  ]
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

export default function AboutPage() {
  const { makeCall } = useCall();

  // Real-time document subscriptions
  const { data: config, loading: loadingAbout } = useRealTimeDocument<AboutConfig>('site_content', 'about', defaultAbout);
  const { data: contact, loading: loadingContact } = useRealTimeDocument<ContactConfig>('site_content', 'contact', defaultContact);

  const loading = loadingAbout || loadingContact;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-24 pb-20">
        <HomeSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-cream min-h-screen pt-24 md:pt-32"
    >
      <SEO pageKey="about" />

      {/* --- Page Header --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <span className="inline-block px-4 py-1.5 bg-saffron/10 text-saffron rounded-full text-sm font-medium mb-4">
          🏪 About Us - Best Tea Stall in Khatu Shyam Ji
        </span>
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-secondary mb-4">
          Famous <span className="text-saffron">Kulhad Chai Near Khatu Temple</span> - Our Story
        </h1>
        <p className="font-hindi text-xl text-primary-dark mb-4">खाटू श्याम जी में सबसे मशहूर कुलहद चाय की दुकान</p>
        <div className="flex items-center justify-center gap-3">
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-saffron" />
          <div className="w-2 h-2 rounded-full bg-saffron" />
          <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-saffron" />
        </div>
      </div>

      {/* --- Content Grid --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={config.ownerImage}
                alt="Famous Tea Stall in Khatu Shyam Ji - Mukesh Sharma at Sawariya Tea Stall near Toran Gate"
                className="w-full h-[400px] md:h-[500px] object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/sawariya-photos/a251a44f-d0aa-4c88-894c-b0ccf80c16ad.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />

              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-dark rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-saffron to-accent flex items-center justify-center text-2xl shadow-lg shrink-0">
                      🙏
                    </div>
                    <div>
                      <h4 className="text-white font-heading font-bold text-lg">{config.ownerName}</h4>
                      <p className="text-white/70 text-sm">{config.ownerTitle}</p>
                      <p className="text-saffron text-sm font-hindi">मालिक - {config.ownerNameHi}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 md:top-6 md:-right-6 w-24 h-24 bg-gradient-to-br from-saffron to-accent rounded-2xl flex flex-col items-center justify-center text-white shadow-xl rotate-6 hover:rotate-0 transition-transform duration-300">
              <span className="text-2xl">☕</span>
              <span className="text-[10px] font-medium uppercase tracking-wider">Best Chai</span>
            </div>
          </div>

          {/* Text Content */}
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-secondary mb-6 leading-tight">
              Best Tea Stall in Khatu Shyam Ji - A Tradition of <span className="text-saffron">Flavor</span> & <span className="text-saffron">Devotion</span>
            </h2>

            <div className="space-y-4 mb-8 text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
              <p>
                {config.story}
              </p>
              {config.storyHi && (
                <p className="font-hindi text-base text-primary-dark bg-saffron/5 p-4 rounded-2xl border-l-4 border-saffron">
                  {config.storyHi}
                </p>
              )}
            </div>

            {/* Quick Points */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: '🌿', text: '100% Fresh Ingredients' },
                { emoji: '🏺', text: 'Traditional Clay Kulhads' },
                { emoji: '😊', text: 'Humble & Friendly Service' },
                { emoji: '📍', text: 'Right Near Toran Gate' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-xs md:text-sm font-semibold text-secondary">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* --- Stats Counter --- */}
      <section className="bg-secondary py-16 text-white pattern-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {config.stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 text-center border border-white/5 shadow-lg hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-saffron/20 flex items-center justify-center text-saffron">
                  {getIcon(stat.icon)}
                </div>
                <div className="font-heading text-2xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-white/60">{stat.label}</div>
                <div className="font-hindi text-xs text-saffron mt-1">{stat.labelHi}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Core Values --- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-saffron/10 text-saffron rounded-full text-sm font-medium mb-4">
            🌟 Our Principles
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-secondary mb-4">
            Our Core <span className="text-saffron">Values</span>
          </h2>
          <p className="font-hindi text-xl text-primary-dark mb-4">हमारे सिद्धांत</p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-saffron" />
            <div className="w-2 h-2 rounded-full bg-saffron" />
            <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-saffron" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {config.coreValues.map((value, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                {getIcon(value.icon)}
              </div>
              <h3 className="font-heading text-xl font-bold text-secondary mb-1">
                {value.title}
              </h3>
              <p className="font-hindi text-sm text-primary-dark mb-4">{value.titleHi}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Call to Action --- */}
      <section className="py-16 bg-cream text-center pb-24">
        <h3 className="font-heading text-2xl md:text-3xl font-bold text-secondary mb-4">
          Want to place a Bulk Order for your Pilgrimage Group?
        </h3>
        <p className="text-gray-500 max-w-xl mx-auto mb-8 text-sm md:text-base">
          Contact {config.ownerName} directly. We offer customized tea packets, fresh snacks, and catering services for large gatherings.
        </p>
        <button
          onClick={() => makeCall(contact.phone)}
          className="px-8 py-4 bg-gradient-to-r from-saffron to-accent text-white rounded-full font-bold shadow-xl shadow-saffron/30 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
        >
          <span>📞 Call {config.ownerName} - {contact.phone}</span>
        </button>
      </section>

    </motion.div>
  );
}
