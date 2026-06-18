import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Home } from 'lucide-react';
import SEO from '../components/common/SEO';

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 }
};

export default function NotFoundPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-cream min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center"
    >
      <SEO pageKey="notFound" />

      {/* Spilled Tea Cup Graphic */}
      <div className="relative w-36 h-36 flex flex-col items-center justify-center mb-8">
        {/* Falling/Spilled Cup body */}
        <div className="w-24 h-18 bg-gradient-to-br from-saffron to-accent rounded-b-2xl border-t border-saffron/10 relative shadow-lg rotate-[75deg] translate-x-4 translate-y-2">
          {/* Handle */}
          <div className="absolute left-[-10px] top-[20%] w-4 h-6 border-2 border-r-0 border-accent rounded-l-full" />
          {/* Spilled liquid drop */}
          <div className="absolute bottom-[-16px] left-[50%] w-8 h-8 rounded-full bg-saffron/90 blur-[1px] rotate-45 scale-x-[0.5]" />
        </div>
        
        {/* Puddle */}
        <div className="w-40 h-2 bg-saffron/60 rounded-full blur-[1.5px] mt-4 opacity-80" />
      </div>

      {/* Error Texts */}
      <h1 className="font-heading text-6xl md:text-8xl font-bold text-secondary mb-2">404</h1>
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-secondary mb-4">
        Oops! Tea Spilled on the Way!
      </h2>
      <p className="font-hindi text-lg text-primary-dark mb-6">
        क्षमा करें! यह पेज मौजूद नहीं है। ☕
      </p>
      
      <p className="text-gray-500 max-w-sm mb-8 text-xs md:text-sm leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back to safety.
      </p>

      {/* Home Redirect Button */}
      <NavLink
        to="/"
        className="px-8 py-3.5 bg-gradient-to-r from-saffron to-accent text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
      >
        <Home size={16} />
        <span>Return to Home Page</span>
      </NavLink>

    </motion.div>
  );
}
