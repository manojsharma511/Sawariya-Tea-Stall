import { useCallback } from 'react';
import { makeCall as serviceMakeCall } from '../services/call.service';
import businessData from '../data/business.json';

/**
 * Reusable hook for making phone calls with business default numbers.
 */
export const useCall = () => {
  const makeCall = useCallback((phoneNumber: string = businessData.phone) => {
    serviceMakeCall(phoneNumber);
  }, []);

  return { makeCall };
};
