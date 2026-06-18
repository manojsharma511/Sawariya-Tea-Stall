import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Car, Compass, Info } from 'lucide-react';
import SEO from '../components/common/SEO';
import businessData from '../data/business.json';
import socialData from '../data/social.json';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 }
};

export default function LocationPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-cream min-h-screen pt-24 md:pt-32 pb-20"
    >
      <SEO pageKey="location" />

      {/* --- Page Header --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <span className="inline-block px-4 py-1.5 bg-saffron/10 text-saffron rounded-full text-sm font-medium mb-4">
          📍 Find Us
        </span>
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-secondary mb-4">
          Our <span className="text-saffron">Location</span>
        </h1>
        <p className="font-hindi text-xl text-primary-dark mb-4">हमारा पता</p>
        <div className="flex items-center justify-center gap-3">
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-saffron" />
          <div className="w-2 h-2 rounded-full bg-saffron" />
          <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-saffron" />
        </div>
      </div>

      {/* --- Map and details grid --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Map display box (2/3 width on wide screens) */}
          <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white min-h-[450px]">
            <iframe
              title="Sawariya Tea Stall Location Map"
              src={socialData.maps.embedUrl}
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Details side bar (1/3 width) */}
          <div className="space-y-6">
            
            {/* Address box */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-secondary text-lg mb-1">Stall Address</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Sawariya Tea Stall, Near Toran Gate, Khatu Shyam Ji, Tehsil Danta Ramgarh, Sikar, Rajasthan - 332602
                  </p>
                  <p className="font-hindi text-xs text-primary-dark mt-2.5 bg-saffron/5 p-2.5 rounded-xl border-l-2 border-saffron">
                    साँवरिया टी स्टॉल, तोरण गेट के पास, खाटू श्याम जी, सीकर, राजस्थान
                  </p>
                </div>
              </div>
            </div>

            {/* Operating hours box */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                  <Clock size={22} />
                </div>
                <div className="w-full">
                  <h4 className="font-heading font-bold text-secondary text-lg mb-1">Opening Hours</h4>
                  <div className="space-y-2 mt-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-gray-500">Every Day</span>
                      <span className="font-semibold text-saffron">{businessData.workingHours.daily}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-gray-500">Mela Days</span>
                      <span className="font-semibold text-green-600">24 Hours / Extended</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500">Shyam Ekadashi</span>
                      <span className="font-semibold text-green-600">Opens 5:00 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel instruction guide */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                  <Compass size={22} />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-secondary text-lg mb-1">How to Reach</h4>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3">
                    As you walk towards Khatu Shyam Temple, you will pass the famous Toran Gate/Dwar. Our stall is situated within 50 meters of the gate. Easily accessible by foot, e-rickshaw, or auto.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <Car className="w-4 h-4 text-green-500" />
                    <span>Public parking details available nearby.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google maps direct button */}
            <a
              href={socialData.maps.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-6 py-4 bg-gradient-to-r from-saffron to-accent text-white rounded-3xl font-bold text-center shadow-xl shadow-saffron/20 hover:scale-[1.01] hover:shadow-saffron/30 transition-all"
            >
              <span className="flex items-center justify-center gap-2">
                <Navigation size={18} />
                Get Driving Directions
              </span>
              <span className="text-[10px] text-white/80 font-hindi block mt-0.5">गूगल मैप पर रास्ता देखें</span>
            </a>

          </div>
        </div>
      </div>

      {/* --- Temple Association Note --- */}
      <div className="mt-16 max-w-7xl mx-auto px-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4 max-w-3xl mx-auto">
          <Info className="w-6 h-6 text-saffron shrink-0 mt-0.5" />
          <div className="text-xs text-gray-500 leading-relaxed">
            <p className="font-semibold text-secondary text-sm mb-1">Important Pilgrim Note:</p>
            <p>During peak Shyam Baba Melas or Ekadashi festivals, vehicle access near Toran Gate is barricaded by authorities for pilgrim safety. Visitors are advised to travel on foot or use designated local e-rickshaw loops to reach our stall safely.</p>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
