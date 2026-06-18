import { Phone } from 'lucide-react';
import { useCall } from '../../hooks/useCall';
import businessData from '../../data/business.json';

/**
 * Mobile-only floating quick call dial button.
 */
export default function FloatingCallButton() {
  const { makeCall } = useCall();

  return (
    <button
      onClick={() => makeCall(businessData.phone)}
      className="fixed bottom-6 left-6 w-14 h-14 bg-gradient-to-br from-saffron to-accent text-white rounded-full flex items-center justify-center shadow-2xl shadow-saffron/30 hover:scale-110 hover:shadow-saffron/50 transition-all duration-300 z-50 animate-pulse-glow md:hidden"
      title="Call Mukesh Sharma"
    >
      <Phone className="w-6 h-6" fill="currentColor" />
    </button>
  );
}
