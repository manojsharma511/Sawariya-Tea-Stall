/**
 * Triggers a native telephone call to the specified phone number.
 * @param phoneNumber The phone number (with or without country code)
 */
export const makeCall = (phoneNumber: string): void => {
  if (!phoneNumber) return;
  const cleanNumber = phoneNumber.replace(/\s+/g, '').replace(/-/g, '');
  // If cleanNumber already starts with '+' or tel:, use it, otherwise add +91 by default for this business
  let finalNumber = cleanNumber;
  if (!cleanNumber.startsWith('+') && !cleanNumber.startsWith('tel:')) {
    finalNumber = cleanNumber.length === 10 ? `+91${cleanNumber}` : `+${cleanNumber}`;
  }
  window.location.href = `tel:${finalNumber}`;
};
