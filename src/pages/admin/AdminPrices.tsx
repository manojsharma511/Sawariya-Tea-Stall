import { useState, useMemo } from 'react';
import { contentService, MenuItem, PriceDoc } from '../../services/content.service';
import { useRealTimeCollection } from '../../hooks/useRealTime';
import { DollarSign, Save, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminPrices() {
  const { data: rawItems, loading: loadingItems } = useRealTimeCollection<MenuItem>('menu_items');
  const { data: rawPrices, loading: loadingPrices } = useRealTimeCollection<PriceDoc>('prices');
  
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [tempPrices, setTempPrices] = useState<Record<string, string>>({});
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Merge items and prices
  const menuItems = useMemo(() => {
    return rawItems.map(item => {
      const priceObj = rawPrices.find(p => p.id === item.id);
      return { ...item, price: priceObj ? priceObj.price : 0 };
    });
  }, [rawItems, rawPrices]);

  const handlePriceChange = (id: string, value: string) => {
    setTempPrices(prev => ({ ...prev, [id]: value }));
  };

  const handleSavePrice = async (itemId: string) => {
    const newPriceVal = tempPrices[itemId];
    if (newPriceVal === undefined || newPriceVal.trim() === '') return;

    const newPrice = Number(newPriceVal);
    if (isNaN(newPrice) || newPrice < 0) {
      setErrorMessage('Please enter a valid positive number for price.');
      return;
    }

    setUpdatingId(itemId);
    try {
      await contentService.updateItemPrice(itemId, newPrice);
      
      // Show checkmark animation
      setSuccessId(itemId);
      setTimeout(() => setSuccessId(null), 3000);

      // Clean temp state
      setTempPrices(prev => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to update price.');
    } finally {
      setUpdatingId(null);
    }
  };


  const loading = loadingItems || loadingPrices;

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p className="animate-pulse">Loading items and prices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h4 className="font-heading font-bold text-secondary text-base">Menu Item Prices</h4>
        <p className="text-gray-400 text-xs mt-0.5">Edit price values in real-time. Changes sync instantly to all public client views.</p>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cream border-b border-gray-100 text-secondary text-xs uppercase tracking-wider font-semibold">
              <th className="p-4 md:p-5">Item Details</th>
              <th className="p-4 md:p-5">Category</th>
              <th className="p-4 md:p-5">Current Price</th>
              <th className="p-4 md:p-5 text-right">Update Price (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {menuItems.map(item => {
              const currentInputVal = tempPrices[item.id] !== undefined 
                ? tempPrices[item.id] 
                : item.price.toString();

              const hasChanged = tempPrices[item.id] !== undefined && tempPrices[item.id] !== item.price.toString();

              return (
                <tr key={item.id} className="hover:bg-cream/20 transition-colors">
                  {/* Item Details */}
                  <td className="p-4 md:p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">☕</span>
                        )}
                      </div>
                      <div>
                        <h5 className="font-bold text-secondary">{item.name}</h5>
                        <p className="font-hindi text-xs text-primary-dark mt-0.5">{item.nameHi}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4 md:p-5 text-xs font-semibold text-gray-400 capitalize">
                    {item.category}
                  </td>

                  {/* Current Price */}
                  <td className="p-4 md:p-5">
                    <span className="inline-block px-3 py-1.5 bg-saffron/10 text-saffron font-bold rounded-full text-xs">
                      ₹{item.price}
                    </span>
                  </td>

                  {/* Action Edit Input */}
                  <td className="p-4 md:p-5">
                    <div className="flex items-center justify-end gap-2">
                      <div className="relative w-24">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={currentInputVal}
                          onChange={(e) => handlePriceChange(item.id, e.target.value)}
                          className="w-full bg-cream border border-transparent focus:border-saffron/20 rounded-xl pl-6 pr-2 py-1.5 text-secondary font-bold text-xs outline-none text-right transition-all"
                        />
                      </div>
                      
                      <button
                        onClick={() => handleSavePrice(item.id)}
                        disabled={updatingId === item.id || !hasChanged}
                        className={`p-2 rounded-xl transition-all ${
                          hasChanged 
                            ? 'bg-saffron hover:bg-accent text-white shadow-md' 
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                        title="Save Price"
                      >
                        {updatingId === item.id ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : successId === item.id ? (
                          <CheckCircle2 size={14} className="text-white" />
                        ) : (
                          <Save size={14} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
