import { useState } from 'react';
import { contentService, OfferItem } from '../../services/content.service';
import { useRealTimeCollection } from '../../hooks/useRealTime';
import { Plus, Edit2, Trash2, Tag, Sparkles, Calendar, ToggleLeft, ToggleRight, Check, AlertCircle } from 'lucide-react';
import { AdminSkeleton } from '../../components/common/Skeletons';

export default function AdminOffers() {
  const { data: offers, loading, setData: setOffers } = useRealTimeCollection<OfferItem>('offers');
  
  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OfferItem | null>(null);
  
  // Form State Fields
  const [type, setType] = useState('daily');
  const [title, setTitle] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionHi, setDescriptionHi] = useState('');
  const [discount, setDiscount] = useState('');
  const [validity, setValidity] = useState('');
  const [badge, setBadge] = useState('');
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Confirm delete overlay state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingItem(null);
    setType('daily');
    setTitle('');
    setTitleHi('');
    setDescription('');
    setDescriptionHi('');
    setDiscount('');
    setValidity('');
    setBadge('');
    setActive(true);
    setIsOpen(true);
  };

  const openEditModal = (item: OfferItem) => {
    setEditingItem(item);
    setType(item.type);
    setTitle(item.title);
    setTitleHi(item.titleHi);
    setDescription(item.description);
    setDescriptionHi(item.descriptionHi);
    setDiscount(item.discount);
    setValidity(item.validity);
    setBadge(item.badge);
    setActive(item.active);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !discount) {
      setErrorMessage('Title and Benefit are required!');
      return;
    }

    setSubmitting(true);
    const payload = {
      type,
      title,
      titleHi,
      description,
      descriptionHi,
      discount,
      validity,
      badge,
      active
    };

    const prevOffers = [...offers];
    if (editingItem && setOffers) {
      setOffers(offers.map(o => 
        o.id === editingItem.id ? { ...o, ...payload } : o
      ));
    }
    setIsOpen(false);

    try {
      await contentService.saveOffer(
        editingItem ? { ...payload, id: editingItem.id } : payload
      );
    } catch (err: any) {
      console.error('Error saving offer:', err);
      if (editingItem && setOffers) {
        setOffers(prevOffers);
      }
      setErrorMessage(`Failed to save offer: ${err.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (item: OfferItem) => {
    const prevOffers = [...offers];
    if (setOffers) {
      setOffers(offers.map(o => o.id === item.id ? { ...o, active: !o.active } : o));
    }
    try {
      await contentService.saveOffer({
        ...item,
        active: !item.active
      });
    } catch (err: any) {
      console.error('Error toggling offer:', err);
      if (setOffers) {
        setOffers(prevOffers);
      }
      setErrorMessage(`Failed to toggle status: ${err.message || err}`);
    }
  };

  const handleDelete = async (id: string) => {
    const prevOffers = [...offers];
    if (setOffers) {
      setOffers(offers.filter(o => o.id !== id));
    }
    setDeleteConfirmId(null);
    try {
      await contentService.deleteOffer(id);
    } catch (err: any) {
      console.error('Error deleting offer:', err);
      if (setOffers) {
        setOffers(prevOffers);
      }
      setErrorMessage(`Failed to delete offer: ${err.message || err}`);
    }
  };


  if (loading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Control Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm gap-4">
        <div>
          <h4 className="font-heading font-bold text-secondary text-lg">Special Deals & Offers</h4>
          <p className="text-gray-400 text-xs mt-0.5">Manage promotional cards shown on the public Offers page</p>
        </div>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-5 py-3 bg-saffron hover:bg-accent text-white rounded-full font-bold shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 text-xs"
        >
          <Plus size={16} />
          <span>Add New Offer</span>
        </button>
      </div>

      {/* Offers List */}
      {offers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 text-gray-400">
          <p className="text-lg">No offers created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map(offer => {
            let cardIcon = <Tag className="w-5 h-5 text-saffron" />;
            let badgeBg = 'bg-saffron/10 text-saffron';
            
            if (offer.type === 'festival') {
              cardIcon = <Sparkles className="w-5 h-5 text-red-500" />;
              badgeBg = 'bg-red-50 text-red-500';
            } else if (offer.type === 'seasonal') {
              cardIcon = <Calendar className="w-5 h-5 text-green-600" />;
              badgeBg = 'bg-green-50 text-green-600';
            }

            return (
              <div key={offer.id} className={`bg-white rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                offer.active ? 'border-gray-100 shadow-sm' : 'border-gray-250/60 bg-gray-50/20 opacity-75'
              }`}>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center">
                      {cardIcon}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${badgeBg}`}>
                      {offer.badge}
                    </span>
                  </div>

                  <h5 className="font-heading font-bold text-secondary text-lg leading-tight">{offer.title}</h5>
                  <p className="font-hindi text-xs text-primary-dark mt-0.5 mb-2">{offer.titleHi}</p>
                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">{offer.description}</p>
                </div>

                <div>
                  <div className="pt-3 border-t border-gray-50 mb-4 flex justify-between items-center text-xs text-gray-400">
                    <span>Benefit: <strong className="text-saffron font-bold">{offer.discount}</strong></span>
                    <span>Timings: <strong className="text-secondary font-semibold">{offer.validity}</strong></span>
                  </div>

                  {/* Toggle Switch & Action Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => handleToggleActive(offer)}
                      className={`flex items-center gap-1 text-xs font-semibold ${
                        offer.active ? 'text-green-600' : 'text-gray-400'
                      }`}
                      title={offer.active ? 'Deactivate Offer' : 'Activate Offer'}
                    >
                      {offer.active ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} className="text-gray-300" />}
                      <span>{offer.active ? 'Active' : 'Inactive'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(offer)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                        title="Edit Offer"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(offer.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                        title="Delete Offer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Add / Edit Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-gray-100 shadow-2xl relative animate-scale-in max-h-[90vh] flex flex-col my-auto">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-saffron shrink-0" />
            <h3 className="font-heading text-xl font-bold text-secondary mb-4 shrink-0">
              {editingItem ? 'Edit Special Offer' : 'Create Special Offer'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-grow">
              {/* Type Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Offer Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                >
                  <option value="daily">🏷️ Daily Combo</option>
                  <option value="festival">✨ Festival Special</option>
                  <option value="seasonal">📅 Seasonal / Group Deal</option>
                </select>
              </div>

              {/* Title (English) */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Title (English) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Free biscuits on Kesar Tea"
                  className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                />
              </div>

              {/* Title (Hindi) */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Title (Hindi)</label>
                <input
                  type="text"
                  value={titleHi}
                  onChange={(e) => setTitleHi(e.target.value)}
                  placeholder="e.g. केसर चाय के साथ बिस्कुट मुफ्त"
                  className="w-full font-hindi bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                />
              </div>

              {/* Discount Benefit */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Benefit/Discount Detail <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="e.g. Save ₹5, Free Biscuits, Buy 4 Get 1"
                  className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                />
              </div>

              {/* Validity */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Validity Timings</label>
                <input
                  type="text"
                  value={validity}
                  onChange={(e) => setValidity(e.target.value)}
                  placeholder="e.g. Available Daily, Valid on Ekadashi"
                  className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                />
              </div>

              {/* Badge */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Badge Title</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Daily Best Seller, Limited Time"
                  className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                />
              </div>

              {/* Description (English) */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none resize-none"
                />
              </div>

              {/* Description (Hindi) */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Description (Hindi)</label>
                <textarea
                  rows={2}
                  value={descriptionHi}
                  onChange={(e) => setDescriptionHi(e.target.value)}
                  className="w-full font-hindi bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none resize-none"
                />
              </div>

              {/* Active Toggle */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-secondary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="accent-saffron h-4 w-4 rounded"
                  />
                  <span>Activate offer on live site</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-secondary font-semibold rounded-xl text-xs transition-all"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-saffron hover:bg-accent text-white font-semibold rounded-xl text-xs transition-all shadow-md"
                >
                  {submitting ? 'Saving...' : 'Save Offer'}
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

            <h4 className="font-heading font-bold text-secondary text-lg mb-1">Delete Offer?</h4>
            <p className="text-gray-400 text-xs mb-6">Are you sure you want to permanently delete this offer? This action cannot be undone.</p>

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
                Delete Permanently
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
            <p className="text-gray-405 text-xs mb-6">{errorMessage}</p>

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
