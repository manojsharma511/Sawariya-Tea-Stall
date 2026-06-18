import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, MessageSquare, Send, User, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import SEO from '../components/common/SEO';
import businessData from '../data/business.json';
import { useCall } from '../hooks/useCall';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { sendContactMessage } from '../services/contact.service';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 }
};

export default function ContactPage() {
  const { makeCall } = useCall();
  const { openWhatsApp } = useWhatsApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setStatusMsg('');

    try {
      const response = await sendContactMessage(formData);
      if (response.success) {
        setSuccess(true);
        setStatusMsg(response.message);
        setFormData({ name: '', phone: '', message: '' });
      } else {
        setSuccess(false);
        setStatusMsg(response.message);
      }
    } catch (err) {
      setSuccess(false);
      setStatusMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-cream min-h-screen pt-24 md:pt-32 pb-20"
    >
      <SEO pageKey="contact" />

      {/* --- Page Header --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <span className="inline-block px-4 py-1.5 bg-saffron/10 text-saffron rounded-full text-sm font-medium mb-4">
          📞 Contact Us
        </span>
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-secondary mb-4">
          Get in <span className="text-saffron">Touch</span>
        </h1>
        <p className="font-hindi text-xl text-primary-dark mb-4">संपर्क करें</p>
        <div className="flex items-center justify-center gap-3">
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-saffron" />
          <div className="w-2 h-2 rounded-full bg-saffron" />
          <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-saffron" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* --- Contact Details Side --- */}
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-secondary mb-4">
              We'd Love to <span className="text-saffron">Hear</span> From You!
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Planning a group visit to Khatu Shyam Ji? Want to order catering packets of tea and samosas? Or do you have feedback about our flavor? Write to us, call us, or chat on WhatsApp!
            </p>
            <p className="text-primary-dark font-hindi text-base bg-saffron/5 p-4 rounded-2xl border-l-4 border-saffron mb-8">
              किसी भी प्रकार के सामूहिक आर्डर या सुझाव के लिए हमसे बेझिझक संपर्क करें। हम आपकी सेवा में तत्पर हैं। 🙏
            </p>

            {/* Information Cards */}
            <div className="space-y-4">
              
              {/* Call Card */}
              <button
                onClick={() => makeCall(businessData.phone)}
                className="w-full text-left group flex items-center gap-4 bg-white hover:bg-saffron/5 rounded-3xl p-5 border border-gray-100 shadow-sm transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron to-accent flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Phone Call</h4>
                  <p className="text-secondary font-heading text-xl font-bold mt-0.5">+91 {businessData.phone}</p>
                  <p className="text-primary-dark text-xs font-hindi mt-0.5">मुकेश शर्मा जी को कॉल करें</p>
                </div>
              </button>

              {/* WhatsApp Card */}
              <button
                onClick={() => openWhatsApp("Namaste Mukesh Ji! I would like to inquire about Sawariya Tea Stall.")}
                className="w-full text-left group flex items-center gap-4 bg-white hover:bg-green-500/5 rounded-3xl p-5 border border-gray-100 shadow-sm transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">WhatsApp Message</h4>
                  <p className="text-green-600 font-heading text-xl font-bold mt-0.5">+91 {businessData.whatsapp.substring(2)}</p>
                  <p className="text-primary-dark text-xs font-hindi mt-0.5">व्हाट्सएप चैट शुरू करें</p>
                </div>
              </button>

              {/* Location Details Card */}
              <div className="flex items-center gap-4 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white shadow-md">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Address</h4>
                  <p className="text-secondary text-sm font-semibold mt-0.5">{businessData.address}</p>
                  <p className="text-primary-dark text-xs font-hindi mt-0.5">{businessData.addressHi}</p>
                </div>
              </div>

              {/* Operating Hours Card */}
              <div className="flex items-center gap-4 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Business Hours</h4>
                  <p className="text-secondary text-sm font-semibold mt-0.5">Open Daily: {businessData.workingHours.daily}</p>
                  <p className="text-primary-dark text-xs font-hindi mt-0.5">{businessData.workingHours.dailyHi}</p>
                </div>
              </div>

            </div>
          </div>

          {/* --- Contact Form Side --- */}
          <div>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/5 rounded-full blur-2xl translate-x-10 -translate-y-10" />

              <h3 className="font-heading text-xl font-bold text-secondary mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-saffron" />
                Send a Quick Message
              </h3>

              {success ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto text-green-500 mb-6">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-secondary font-heading text-2xl font-bold mb-2">Message Sent!</h4>
                  <p className="text-gray-500 text-sm mb-2">{statusMsg}</p>
                  <p className="text-primary-dark font-hindi text-sm">धन्यवाद! हम आपसे जल्द ही संपर्क करेंगे।</p>
                  
                  <button
                    onClick={() => setSuccess(null)}
                    className="mt-6 px-6 py-2.5 bg-cream hover:bg-cream-dark text-secondary border border-gray-200 rounded-full text-xs font-semibold transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Input */}
                  <div>
                    <label className="block text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
                      Your Name <span className="font-hindi text-xs text-primary-dark font-normal">(आपका नाम)</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-cream rounded-2xl px-12 py-3.5 text-secondary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron/20 border border-transparent focus:border-saffron/30 transition-all text-sm"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
                      Phone Number <span className="font-hindi text-xs text-primary-dark font-normal">(फ़ोन नंबर)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-cream rounded-2xl px-12 py-3.5 text-secondary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron/20 border border-transparent focus:border-saffron/30 transition-all text-sm"
                        placeholder="Enter your mobile number"
                        required
                      />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
                      Message <span className="font-hindi text-xs text-primary-dark font-normal">(संदेश)</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full bg-cream rounded-2xl px-12 py-3.5 text-secondary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron/20 border border-transparent focus:border-saffron/30 transition-all text-sm resize-none"
                        placeholder="Type your message details here..."
                        required
                      />
                    </div>
                  </div>

                  {/* Error response if any */}
                  {success === false && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs leading-relaxed border border-red-100">
                      {statusMsg}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-saffron to-accent text-white rounded-2xl font-bold shadow-xl shadow-saffron/20 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                        <span className="font-hindi font-normal text-xs ml-1">भेजें</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

    </motion.div>
  );
}
