import { Link } from 'react-router-dom';
import { Heart, Phone, MapPin, ArrowUp, Mail } from 'lucide-react';
import businessData from '../../data/business.json';
import { useCall } from '../../hooks/useCall';
import { useWhatsApp } from '../../hooks/useWhatsApp';

/**
 * Enhanced footer displaying structured navigation links, business address, and dynamic links.
 */
export default function Footer() {
  const { makeCall } = useCall();
  const { openWhatsApp } = useWhatsApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Menu', path: '/menu' },
    { name: 'About Us', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Special Offers', path: '/offers' },
    { name: 'Location', path: '/location' },
    { name: 'Contact', path: '/contact' },
  ];

  const popularItems = [
    'Masala Chai ☕',
    'Kulhad Chai 🏺',
    'Kesar Tea ✨',
    'Elaichi Chai 🌿',
    'Adrak Chai 🫚',
    'Samosa 🥟',
  ];

  return (
    <footer className="bg-dark-brown relative overflow-hidden">
      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-saffron via-accent to-saffron" />

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron to-accent flex items-center justify-center text-2xl shadow-lg">
                ☕
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-white">{businessData.shopName.split(' ')[0]}</h3>
                <p className="text-xs text-primary tracking-widest uppercase">{businessData.shopName.split(' ').slice(1).join(' ')}</p>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              Serving the finest chai in Khatu Shyam Ji near Toran Gate. A refreshing stop for devotees and travelers seeking authentic traditional flavor.
            </p>
            <p className="font-hindi text-sm text-primary-light/60">
              साँवरिया टी स्टॉल — चाय का असली स्वाद ☕
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-heading text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-saffron rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-white/40 hover:text-saffron text-sm transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-saffron transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Menu Items */}
          <div>
            <h4 className="font-heading text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-saffron rounded-full" />
              Popular Items
            </h4>
            <ul className="space-y-2">
              {popularItems.map((item) => (
                <li key={item}>
                  <Link
                    to="/menu"
                    className="text-white/40 hover:text-saffron text-sm transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-saffron transition-all duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h4 className="font-heading text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-saffron rounded-full" />
              Contact Info
            </h4>
            <div className="space-y-4">
              {/* Phone */}
              <button
                onClick={() => makeCall(businessData.phone)}
                className="flex items-start gap-3 group text-left w-full"
              >
                <Phone className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/70 text-sm group-hover:text-saffron transition-colors">+91 {businessData.phone}</p>
                  <p className="text-white/30 text-xs font-hindi">{businessData.ownerName}</p>
                </div>
              </button>

              {/* Email */}
              <a href={`mailto:${businessData.email}`} className="flex items-start gap-3 group text-left w-full">
                <Mail className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                <p className="text-white/70 text-sm group-hover:text-saffron transition-colors break-all">{businessData.email}</p>
              </a>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/70 text-sm">{businessData.address.split(', ').slice(0, 2).join(', ')}</p>
                  <p className="text-white/70 text-sm">{businessData.address.split(', ').slice(2).join(', ')}</p>
                </div>
              </div>

              {/* WhatsApp Trigger */}
              <button
                onClick={() => openWhatsApp("Namaste Mukesh Ji! I would like to get in touch.")}
                className="inline-flex items-center gap-2 px-5 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-xl text-sm font-medium transition-all border border-green-600/20"
              >
                💬 WhatsApp Us
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            <div className="text-center md:text-left">
              <p className="text-white/30 text-sm flex items-center gap-1 justify-center md:justify-start">
                © {new Date().getFullYear()} {businessData.shopName}. Made with <Heart className="w-3.5 h-3.5 text-red-500" fill="currentColor" /> in Khatu Shyam Ji
              </p>
              <p className="text-white/20 text-xs font-hindi mt-1">
                {businessData.blessing}
              </p>
            </div>

            {/* Scroll To Top Button */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-saffron/20 hover:bg-saffron text-saffron hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg"
              title="Scroll to Top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>

          </div>
        </div>
      </div>
    </footer>
  );
}
