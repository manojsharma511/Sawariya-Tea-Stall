import { useState, useEffect } from 'react';
import { testimonialService, Testimonial } from '../../services/testimonial.service';
import { Star, Check, X, Edit2, Trash2, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  
  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editReview, setEditReview] = useState('');
  const [editReviewHi, setEditReviewHi] = useState('');
  const [editRating, setEditRating] = useState(5);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getAll();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await testimonialService.update(id, { status });
      setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await testimonialService.delete(id);
      setTestimonials(prev => prev.filter(t => t.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to delete testimonial.');
    }
  };

  const startEdit = (item: Testimonial) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditLocation(item.location);
    setEditReview(item.review);
    setEditReviewHi(item.reviewHi || '');
    setEditRating(item.rating);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const updates = {
        name: editName,
        location: editLocation,
        review: editReview,
        reviewHi: editReviewHi,
        rating: editRating
      };
      await testimonialService.update(editingItem.id, updates);
      setTestimonials(prev => prev.map(t => t.id === editingItem.id ? { ...t, ...updates } : t));
      setEditingItem(null);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to save edits.');
    }
  };

  const filtered = testimonials.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const stats = {
    total: testimonials.length,
    pending: testimonials.filter(t => t.status === 'pending').length,
    approved: testimonials.filter(t => t.status === 'approved').length,
    rejected: testimonials.filter(t => t.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p className="animate-pulse">Loading testimonials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Testimonials', value: stats.total, color: 'border-blue-100 bg-blue-50/30 text-blue-700' },
          { label: 'Pending Approval', value: stats.pending, color: 'border-yellow-100 bg-yellow-50/30 text-yellow-700' },
          { label: 'Approved & Public', value: stats.approved, color: 'border-green-100 bg-green-50/30 text-green-700' },
          { label: 'Rejected / Hidden', value: stats.rejected, color: 'border-red-100 bg-red-50/30 text-red-700' },
        ].map((stat, i) => (
          <div key={i} className={`p-4 border rounded-2xl ${stat.color} flex flex-col justify-between`}>
            <span className="text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
            <span className="text-3xl font-bold mt-2">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs / Filter Controls */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              filter === type
                ? 'bg-secondary text-white shadow-md'
                : 'bg-white text-gray-400 hover:text-secondary hover:bg-gray-50 border border-gray-100'
            }`}
          >
            {type} ({type === 'all' ? stats.total : stats[type]})
          </button>
        ))}
      </div>

      {/* Testimonials List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 text-gray-400">
          <p className="text-lg">No reviews found matching filter "{filter}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              
              {/* Left Column: Author and Review */}
              <div className="flex items-start gap-4 flex-grow max-w-3xl">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-saffron/20 bg-saffron/5 flex items-center justify-center text-xl shrink-0">
                  {item.avatar && item.avatar.startsWith('http') ? (
                    <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{item.avatar || '🧑'}</span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-heading font-bold text-secondary text-base">{item.name}</h4>
                    <span className="text-xs text-gray-400">({item.location})</span>
                    {item.email && <span className="text-[10px] bg-gray-50 border border-gray-100 text-gray-400 px-1.5 py-0.5 rounded">{item.email}</span>}
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    ))}
                    {[...Array(5 - item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-gray-200" />
                    ))}
                  </div>
                  <p className="text-gray-650 text-sm italic">"{item.review}"</p>
                  {item.reviewHi && <p className="font-hindi text-xs text-primary-dark">{item.reviewHi}</p>}
                </div>
              </div>

              {/* Right Column: Status & Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t border-gray-50 md:border-0 pt-4 md:pt-0">
                {/* Status Badges */}
                <div className="mr-3">
                  {item.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-100">
                      <Clock size={12} /> Pending
                    </span>
                  )}
                  {item.status === 'approved' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                      <CheckCircle2 size={12} /> Approved
                    </span>
                  )}
                  {item.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                      <XCircle size={12} /> Rejected
                    </span>
                  )}
                </div>

                {/* Operations */}
                <div className="flex gap-1.5">
                  {item.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusChange(item.id, 'approved')}
                      className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-all"
                      title="Approve & Publish"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  {item.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(item.id, 'rejected')}
                      className="p-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-xl transition-all"
                      title="Reject & Hide"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                    title="Edit Review"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                    title="Delete Review"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Editing Dialog Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-gray-100 shadow-2xl relative overflow-hidden animate-scale-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-saffron" />
            <h3 className="font-heading text-xl font-bold text-secondary mb-4 flex items-center gap-2">
              <Edit2 size={18} className="text-saffron" />
              <span>Edit Testimonial</span>
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Devotee Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Rating Stars (1-5)</label>
                <select
                  value={editRating}
                  onChange={(e) => setEditRating(Number(e.target.value))}
                  className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                >
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Review Text (English)</label>
                <textarea
                  required
                  rows={3}
                  value={editReview}
                  onChange={(e) => setEditReview(e.target.value)}
                  className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Review Text (Hindi)</label>
                <textarea
                  rows={2}
                  value={editReviewHi}
                  onChange={(e) => setEditReviewHi(e.target.value)}
                  className="w-full font-hindi bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-secondary font-semibold rounded-xl text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-saffron hover:bg-accent text-white font-semibold rounded-xl text-xs transition-all shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-gray-150 shadow-2xl relative overflow-hidden animate-scale-in text-center">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500" />
            
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>

            <h4 className="font-heading font-bold text-secondary text-lg mb-1">Delete Testimonial?</h4>
            <p className="text-gray-400 text-xs mb-6">Are you sure you want to permanently delete this testimonial? This action cannot be undone.</p>

            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-secondary font-semibold rounded-xl text-xs transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-xs transition-all shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Error Modal */}
      {errorMessage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-gray-150 shadow-2xl relative overflow-hidden animate-scale-in text-center">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500" />
            
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>

            <h4 className="font-heading font-bold text-secondary text-lg mb-1">Error</h4>
            <p className="text-gray-400 text-xs mb-6">{errorMessage}</p>

            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="w-full py-2.5 bg-secondary hover:bg-saffron text-white font-semibold rounded-xl text-xs transition-all shadow-md"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
