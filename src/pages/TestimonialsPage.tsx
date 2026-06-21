import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquare, Send, Sparkles } from 'lucide-react';
import SEO from '../components/common/SEO';
import testimonialsData from '../data/testimonials.json';
import { testimonialService, Testimonial } from '../services/testimonial.service';
import { useAuth } from '../context/AuthContext';
import { useRealTimeCollection } from '../hooks/useRealTime';
import Loader from '../components/common/Loader';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 }
};

export default function TestimonialsPage() {
  const { user, setShowLoginModal } = useAuth();
  const { data: rawTestimonials, loading } = useRealTimeCollection<Testimonial>('testimonials');

  const [activeIndex, setActiveIndex] = useState(0);

  // Form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviewHi, setReviewHi] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Extract approved testimonials or fallback to static JSON
  const testimonials = useMemo(() => {
    const approved = rawTestimonials.filter(t => t.status === 'approved');
    if (approved && approved.length > 0) {
      return approved;
    }

    // Fallback static list
    return testimonialsData.map((t, idx) => ({
      id: `static_${idx}`,
      name: t.name,
      nameHi: t.nameHi,
      location: t.location,
      review: t.review,
      reviewHi: t.reviewHi || '',
      rating: t.rating,
      avatar: t.avatar,
      status: 'approved',
      createdAt: new Date().toISOString()
    })) as Testimonial[];
  }, [rawTestimonials]);

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!review.trim()) {
      setSubmitError('Please enter a review message.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      await testimonialService.submit({
        name: user.displayName || 'Anonymous Devotee',
        nameHi: '',
        location: location.trim() || 'Pilgrim',
        review: review.trim(),
        reviewHi: reviewHi.trim(),
        rating,
        avatar: user.photoURL || '🧑',
        email: user.email || ''
      });

      setSubmitSuccess(true);
      setReview('');
      setReviewHi('');
      setLocation('');
      setRating(5);

      // Auto-dismiss success message
      setTimeout(() => setSubmitSuccess(false), 8000);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeReview = testimonials[activeIndex];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-cream min-h-screen pt-24 md:pt-32 pb-20 overflow-hidden"
    >
      <SEO pageKey="testimonials" />

      {/* --- Page Header --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <span className="inline-block px-4 py-1.5 bg-saffron/10 text-saffron rounded-full text-sm font-medium mb-4">
          💬 Reviews
        </span>
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-secondary mb-4">
          Devotee <span className="text-saffron">Feedback</span>
        </h1>
        <p className="font-hindi text-xl text-primary-dark mb-4">ग्राहकों के अनुभव</p>
        <div className="flex items-center justify-center gap-3">
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-saffron" />
          <div className="w-2 h-2 rounded-full bg-saffron" />
          <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-saffron" />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {/* --- Featured Carousel Slider --- */}
          {testimonials.length > 0 && activeReview && (
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative">
              <div className="absolute top-0 left-0 text-[180px] md:text-[250px] opacity-[0.03] font-heading font-bold text-saffron select-none -translate-x-12 -translate-y-12">❝</div>
              <div className="absolute bottom-0 right-0 text-[180px] md:text-[250px] opacity-[0.03] font-heading font-bold text-saffron select-none translate-x-12 translate-y-12 rotate-180">❝</div>

              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100/80 relative z-10 flex flex-col md:flex-row items-center gap-8 min-h-[300px]">

                {/* Avatar / Big Icon */}
                <div className="w-24 h-24 shrink-0 rounded-full bg-gradient-to-br from-saffron/10 to-accent/15 flex items-center justify-center text-4xl border border-saffron/20 shadow-md overflow-hidden">
                  {activeReview.avatar && activeReview.avatar.startsWith('http') ? (
                    <img src={activeReview.avatar} alt={`Kulhad Chai review by ${activeReview.name} - Sawariya Tea Stall Khatu Shyam Ji`} className="w-full h-full object-cover" />
                  ) : (
                    <span>{activeReview.avatar || '🧑'}</span>
                  )}
                </div>

                {/* Testimonial body */}
                <div className="flex-grow flex flex-col justify-between h-full w-full">
                  <div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(activeReview.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />
                      ))}
                      {[...Array(5 - activeReview.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-gray-200" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-lg md:text-xl leading-relaxed italic mb-4">
                      "{activeReview.review}"
                    </p>
                    {activeReview.reviewHi && (
                      <p className="font-hindi text-base text-primary-dark mb-6 bg-saffron/5 px-4 py-2.5 rounded-2xl inline-block border-l-2 border-saffron">
                        {activeReview.reviewHi}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <h4 className="font-heading font-bold text-secondary text-base">{activeReview.name}</h4>
                      <p className="text-gray-400 text-xs">{activeReview.location}</p>
                    </div>

                    {/* Carousel Nav buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrev}
                        className="w-10 h-10 rounded-full border border-gray-200 hover:border-saffron hover:bg-saffron/10 text-secondary hover:text-saffron flex items-center justify-center transition-all"
                        title="Previous Review"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={handleNext}
                        className="w-10 h-10 rounded-full border border-gray-200 hover:border-saffron hover:bg-saffron/10 text-secondary hover:text-saffron flex items-center justify-center transition-all"
                        title="Next Review"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* --- Testimonial Grid --- */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-t border-gray-100 pt-16 mb-10 text-center">
              <h3 className="font-heading text-2xl font-bold text-secondary mb-2">More Customer Stories</h3>
              <p className="text-gray-400 text-sm">Real reviews left by pilgrims and visitors near Toran Gate</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <div
                  key={t.id}
                  className={`group bg-white rounded-3xl p-8 border shadow-md transition-all duration-500 relative flex flex-col justify-between ${idx === activeIndex
                      ? 'border-saffron shadow-saffron/10 ring-2 ring-saffron/10 scale-[1.02]'
                      : 'border-gray-100 hover:border-saffron/20 hover:shadow-xl'
                    }`}
                >
                  <div>
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Quote className="w-8 h-8 text-saffron" />
                    </div>

                    {/* Star rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                      ))}
                      {[...Array(5 - t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-gray-200" />
                      ))}
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-3">"{t.review}"</p>
                    {t.reviewHi && <p className="font-hindi text-xs text-primary-dark mb-6">{t.reviewHi}</p>}
                  </div>

                  {/* Author footer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50 mt-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron/20 to-accent/20 flex items-center justify-center text-lg overflow-hidden shrink-0">
                      {t.avatar && t.avatar.startsWith('http') ? (
                        <img src={t.avatar} alt={`Best Kulhad Chai in Khatu review by ${t.name}`} className="w-full h-full object-cover" />
                      ) : (
                        <span>{t.avatar || '🧑'}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary text-sm">{t.name}</h4>
                      <p className="text-xs text-gray-400">{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* --- Review Submission Form & Prompt Section --- */}
      <section className="mt-20 max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-saffron via-accent to-saffron" />

          <div className="p-8 md:p-12">
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="w-12 h-12 bg-saffron/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-saffron">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-secondary mb-2">Share Your Chai Experience</h3>
              <p className="text-gray-500 text-sm">
                Have you recently visited Sawariya Tea Stall? Leave your rating and feedback below.
              </p>
            </div>

            {user ? (
              // SUBMISSION FORM
              <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl flex items-start gap-3 animate-scale-in">
                    <Sparkles className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Review Submitted Successfully!</p>
                      <p className="text-sm">Thank you for your feedback! Your testimonial has been saved and is currently pending administrator approval by Mukesh Kumar.</p>
                    </div>
                  </div>
                )}

                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm">
                    {submitError}
                  </div>
                )}

                <div className="flex items-center gap-4 p-4 bg-cream rounded-2xl border border-gray-100">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-saffron flex items-center justify-center bg-saffron/10 text-xl shrink-0">
                    {user.photoURL && user.photoURL.startsWith('http') ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.photoURL || '🧑'}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Posting publicly as</p>
                    <p className="font-bold text-secondary text-sm">{user.displayName}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>

                {/* Star Rating Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-secondary">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-200'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Input */}
                <div className="space-y-2">
                  <label htmlFor="location" className="block text-sm font-semibold text-secondary">
                    Your Location <span className="text-xs text-gray-400 font-normal">(e.g., Delhi, Jaipur)</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where are you visiting from?"
                    className="w-full bg-cream border border-transparent focus:border-saffron/30 focus:ring-2 focus:ring-saffron/10 rounded-2xl px-5 py-3 text-secondary text-sm placeholder:text-gray-400 outline-none transition-all"
                  />
                </div>

                {/* Testimonial Text (English) */}
                <div className="space-y-2">
                  <label htmlFor="review" className="block text-sm font-semibold text-secondary">
                    Your Testimonial <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="review"
                    required
                    rows={4}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="How was the tea and snacks? Tell us about Mukesh Ji's hospitality..."
                    className="w-full bg-cream border border-transparent focus:border-saffron/30 focus:ring-2 focus:ring-saffron/10 rounded-2xl px-5 py-3.5 text-secondary text-sm placeholder:text-gray-400 outline-none transition-all resize-none"
                  />
                </div>

                {/* Testimonial Text (Hindi) */}
                <div className="space-y-2">
                  <label htmlFor="reviewHi" className="block text-sm font-semibold text-secondary">
                    Your Testimonial in Hindi <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="reviewHi"
                    rows={3}
                    value={reviewHi}
                    onChange={(e) => setReviewHi(e.target.value)}
                    placeholder="चाय का स्वाद कैसा लगा? क्या मनोज जी का स्वभाव अच्छा था? यहाँ अपना अनुभव हिंदी में लिखें..."
                    className="w-full font-hindi bg-cream border border-transparent focus:border-saffron/30 focus:ring-2 focus:ring-saffron/10 rounded-2xl px-5 py-3.5 text-secondary text-sm placeholder:text-gray-400 outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-saffron to-accent text-white rounded-full font-bold shadow-lg shadow-saffron/30 hover:scale-[1.01] hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span>Submitting review...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Testimonial (Pending Approval)</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              // GOOGLE LOGIN PROMPT
              <div className="text-center max-w-md mx-auto py-4 space-y-6">
                <p className="text-gray-500 text-sm leading-relaxed">
                  To keep feedback authentic and prevent spam, we require users to verify their identity via Google Sign-In before leaving a review.
                </p>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="mx-auto px-8 py-3.5 bg-gradient-to-r from-saffron to-accent text-white rounded-full font-bold shadow-lg shadow-saffron/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>🔑 Sign In</span>
                </button>
                <div className="text-xs text-gray-400 border-t border-gray-100 pt-4">
                  Or share your experience directly via{' '}
                  <a
                    href="https://wa.me/917340030949?text=Namaste%20Mukesh%20Ji!%20Here%20is%20my%20review%20for%20Sawariya%20Tea%20Stall%3A%20"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-saffron hover:underline font-semibold"
                  >
                    WhatsApp Message 💬
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
