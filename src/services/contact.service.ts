import emailjs from '@emailjs/browser';

export interface ContactMessage {
  name: string;
  phone: string;
  message: string;
}

/**
 * Sends a contact message via EmailJS if configured, otherwise falls back to a simulated delay.
 */
export const sendContactMessage = async (data: ContactMessage): Promise<{ success: boolean; message: string }> => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn('EmailJS environment variables not configured. Simulating success in development.');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Message sent successfully (simulated dev mode).'
        });
      }, 1500);
    });
  }

  try {
    const templateParams = {
      from_name: data.name,
      phone_number: data.phone,
      message: data.message,
      to_name: 'Mukesh Sharma'
    };

    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    if (response.status === 200) {
      return { success: true, message: 'Message sent successfully!' };
    } else {
      throw new Error(`EmailJS responded with status: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      message: error?.text || error?.message || 'Failed to send your message. Please try again.'
    };
  }
};
