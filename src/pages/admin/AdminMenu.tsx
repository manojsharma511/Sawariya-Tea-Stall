import { useState, useEffect } from 'react';
import { contentService, MenuItem } from '../../services/content.service';
import { CATEGORIES } from '../../utils/constants';
import { Plus, Edit2, Trash2, Search, Flame, Star, AlertCircle } from 'lucide-react';

export default function AdminMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Form modal triggers
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form Fields State (Price removed!)
  const [name, setName] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('tea');
  const [popular, setPopular] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Custom Delete Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const data = await contentService.getMenu();
      setMenu(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setNameHi('');
    setDescription('');
    setCategory('tea');
    setPopular(false);
    setIsNew(false);
    setImageFile(null);
    setImageUrl('');
    setIsOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setNameHi(item.nameHi);
    setDescription(item.description);
    setCategory(item.category);
    setPopular(item.popular);
    setIsNew(item.new);
    setImageFile(null);
    setImageUrl(item.image);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setErrorMessage('Name is required!');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        nameHi,
        description,
        category,
        popular,
        new: isNew,
        image: imageUrl 
      };

      // saveMenuItem does not write price here unless added, content service handles merging
      await contentService.saveMenuItem(
        editingItem ? { ...payload, id: editingItem.id } : payload,
        imageFile || undefined
      );

      await fetchMenu();
      setIsOpen(false);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to save menu item.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contentService.deleteMenuItem(id);
      setMenu(prev => prev.filter(m => m.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to delete item.');
    }
  };


  // Filter
  const filtered = menu.filter(item => {
    const catMatch = activeCategory === 'all' || item.category === activeCategory;
    const queryMatch = !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.nameHi.includes(search) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return catMatch && queryMatch;
  });

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p className="animate-pulse">Loading menu items...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu items..."
            className="w-full bg-cream rounded-full pl-10 pr-4 py-2.5 text-secondary text-xs placeholder:text-gray-400 outline-none border border-transparent focus:border-saffron/20 transition-all"
          />
        </div>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-5 py-3 bg-saffron hover:bg-accent text-white rounded-full font-bold shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 text-xs"
        >
          <Plus size={16} />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeCategory === cat.id
                ? 'bg-secondary text-white shadow-md'
                : 'bg-white text-gray-400 hover:text-secondary hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Grid List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 text-gray-400">
          <p className="text-lg">No menu items found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative h-40 bg-gray-50 overflow-hidden border-b border-gray-50">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-orange-50 text-saffron">☕</div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {item.popular && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[9px] font-bold uppercase rounded-full flex items-center gap-0.5">
                        <Flame size={9} /> Popular
                      </span>
                    )}
                    {item.new && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[9px] font-bold uppercase rounded-full flex items-center gap-0.5">
                        <Star size={9} /> New
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">{item.category}</span>
                  <h4 className="font-heading font-bold text-secondary text-base leading-snug mt-0.5">{item.name}</h4>
                  <p className="font-hindi text-xs text-primary-dark mb-2">{item.nameHi}</p>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 pb-5 pt-3 border-t border-gray-50 flex gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="flex-grow py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1"
                >
                  <Edit2 size={12} />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                  title="Delete Item"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-gray-100 shadow-2xl relative animate-scale-in max-h-[90vh] flex flex-col my-auto">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-saffron shrink-0" />
            <h3 className="font-heading text-xl font-bold text-secondary mb-4 shrink-0">
              {editingItem ? 'Edit Menu Details' : 'Create Menu Item'}
            </h3>
            
            <p className="text-xs text-gray-400 mb-4 bg-orange-50 border border-orange-100 p-2.5 rounded-xl shrink-0">
              💡 **Pricing Note**: Menu prices are decoupled from basic descriptions. Set or modify prices under the dedicated **Prices** tab.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-grow">
              {/* Category Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Name (English) */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Item Name (English) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Masala Kulhad Chai"
                  className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                />
              </div>

              {/* Name (Hindi) */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Item Name (Hindi)</label>
                <input
                  type="text"
                  value={nameHi}
                  onChange={(e) => setNameHi(e.target.value)}
                  placeholder="e.g. मसाला कुल्हड़ चाय"
                  className="w-full font-hindi bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brewed with fresh milk, ginger, cardamoms..."
                  className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none resize-none"
                />
              </div>

              {/* Image Input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-500">Image</label>
                <div className="flex flex-col gap-2">
                  {imageUrl && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-150 relative">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <input
                      type="file"
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
                    <p className="text-[10px] text-gray-400">Or type image URL path below:</p>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageFile(null);
                        setImageUrl(e.target.value);
                      }}
                      placeholder="/images/example.jpg"
                      className="w-full bg-cream border-0 rounded-xl px-4 py-2 text-secondary text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-secondary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={popular}
                    onChange={(e) => setPopular(e.target.checked)}
                    className="accent-saffron h-4 w-4 rounded"
                  />
                  <span>Popular Item</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-secondary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="accent-saffron h-4 w-4 rounded"
                  />
                  <span>New Item</span>
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
                  {submitting ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-gray-150 shadow-2xl relative overflow-hidden animate-scale-in text-center">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500" />
            
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>

            <h4 className="font-heading font-bold text-secondary text-lg mb-1">Delete Menu Item?</h4>
            <p className="text-gray-400 text-xs mb-4">Deleting this item will permanently remove it from the menu and delete its associated price record.</p>

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
