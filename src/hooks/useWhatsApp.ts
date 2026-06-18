import { useCallback } from 'react';
import { openWhatsApp as serviceOpenWhatsApp } from '../services/whatsapp.service';
import businessData from '../data/business.json';

/**
 * Reusable hook to initiate WhatsApp chats with business default numbers.
 */
export const useWhatsApp = () => {
  const openWhatsApp = useCallback((message?: string, phoneNumber: string = businessData.whatsapp) => {
    serviceOpenWhatsApp(phoneNumber, message);
  }, []);

  return { openWhatsApp };
};
