import { useState, useEffect } from 'react';
import { contentService, GalleryItem } from '../../services/content.service';
import { Plus, Trash2, Search, Image as ImageIcon, AlertCircle } from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', name: 'All Photos' },
  { id: 'tea', name: 'Brewed Tea' },
  { id: 'shop', name: 'Stall & Shop' },
  { id: 'snacks', name: 'Snacks' },
  { id: 'customer', name: 'Devotees & Temple' }
];

export default function AdminGallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Form Field State
  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [captionHi, setCaptionHi] = useState('');
  const [category, setCategory] = useState('tea');
  const [alt, setAlt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await contentService.getGallery();
      setGallery(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openAddModal = () => {
    setCaption('');
    setCaptionHi('');
    setCategory('tea');
    setAlt('');
    setImageFile(null);
    setImageUrl('');
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setErrorMessage('Please select an image file to upload.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        alt: alt.trim() || caption.trim() || 'Gallery Image',
        caption: caption.trim(),
        captionHi: captionHi.trim(),
        category
      };

      await contentService.addGalleryItem(payload, imageFile);
      await fetchGallery();
      setIsOpen(false);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to add gallery item.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contentService.deleteGalleryItem(id);
      setGallery(prev => prev.filter(g => g.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to delete image.');
    }
  };

  const filtered = gallery.filter(item => activeTab === 'all' || item.category === activeTab);

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p className="animate-pulse">Loading gallery images...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Control Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm gap-4">
        <div>
          <h4 className="font-heading font-bold text-secondary text-lg">Stall Gallery Photos</h4>
          <p className="text-gray-400 text-xs mt-0.5">Manage photos shown in the client-side masonry layout</p>
        </div>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-5 py-3 bg-saffron hover:bg-accent text-white rounded-full font-bold shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 text-xs"
        >
          <Plus size={16} />
          <span>Upload New Photo</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {CATEGORY_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-secondary text-white shadow-md'
                : 'bg-white text-gray-400 hover:text-secondary hover:bg-gray-50 border border-gray-100'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 text-gray-400">
          <p className="text-lg">No images found in category "{activeTab}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(img => (
            <div key={img.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 relative aspect-square shadow-sm hover:shadow-md transition-all duration-300">
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                <button
                  onClick={() => setDeleteConfirmId(img.id)}
                  className="self-end p-2 bg-red-500 hover:bg-red-600 rounded-xl text-white transition-all shadow-md"
                  title="Delete Photo"
                >
                  <Trash2 size={14} />
                </button>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-saffron uppercase tracking-widest bg-saffron/10 px-2 py-0.5 rounded-full inline-block">
                    {img.category}
                  </span>
                  <p className="text-xs font-bold leading-tight line-clamp-2">{img.caption || 'No Caption'}</p>
                  {img.captionHi && <p className="font-hindi text-[10px] text-white/80 line-clamp-1">{img.captionHi}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-gray-100 shadow-2xl relative overflow-hidden animate-scale-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-saffron" />
            <h3 className="font-heading text-xl font-bold text-secondary mb-4 flex items-center gap-1.5">
              <ImageIcon size={18} className="text-saffron" />
              <span>Upload Gallery Image</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                >
                  {CATEGORY_TABS.filter(t => t.id !== 'all').map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Caption (English) */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Caption (English)</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Special ginger cardamom tea preparation"
                  className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                />
              </div>

              {/* Caption (Hindi) */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Caption (Hindi)</label>
                <input
                  type="text"
                  value={captionHi}
                  onChange={(e) => setCaptionHi(e.target.value)}
                  placeholder="e.g. स्पेशल अदरक इलायची चाय"
                  className="w-full font-hindi bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                />
              </div>

              {/* Alt description */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Alt Description <span className="text-xs text-gray-400 font-normal">(for screen readers)</span></label>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="e.g. Chai stall master brewing tea in clay cup"
                  className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                />
              </div>

              {/* Select File */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-500">Photo File <span className="text-red-500">*</span></label>
                <div className="flex flex-col gap-2">
                  {imageUrl && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-150 relative">
                      <img src={imageUrl} alt="Upload preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImageUrl(URL.createObjectURL(file));
                      }
                    }}
                    className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-saffron hover:file:bg-orange-100"
                  />
                </div>
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
                  {submitting ? 'Uploading...' : 'Upload Photo'}
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

            <h4 className="font-heading font-bold text-secondary text-lg mb-1">Delete Photo?</h4>
            <p className="text-gray-400 text-xs mb-6">Are you sure you want to permanently delete this photo? This action cannot be undone.</p>

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
