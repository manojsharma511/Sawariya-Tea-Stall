/**
 * Opens a WhatsApp chat with the specified phone number and message.
 * @param phoneNumber The WhatsApp number (including country code, e.g., 917340030949)
 * @param message The optional pre-filled message
 */
export const openWhatsApp = (phoneNumber: string, message?: string): void => {
  if (!phoneNumber) return;
  const cleanNumber = phoneNumber.replace(/\+/g, '').replace(/\s+/g, '').replace(/-/g, '');
  const encodedMessage = message ? encodeURIComponent(message) : '';
  const url = `https://wa.me/${cleanNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};
