import { useState, useEffect } from 'react';
import { contentService, HeroConfig, ContactConfig, AboutConfig } from '../../services/content.service';
import { useRealTimeDocument } from '../../hooks/useRealTime';
import { LayoutGrid, Phone, User, Save, Upload, Sparkles, AlertCircle } from 'lucide-react';

import defaultBusiness from '../../data/business.json';

const defaultHero: HeroConfig = {
  blessing: defaultBusiness.blessing,
  shopName: defaultBusiness.shopName,
  shopNameHi: defaultBusiness.shopNameHi,
  subtitle: 'Serving the finest spiced tea and warm snacks to devotees at Khatu Shyam Ji',
  subtitleHi: 'खाटू श्याम जी आओ, साँवरिया की स्पेशल चाय का मज़ा लो',
  bgImage: '/sawariya-photos/cb5dc902-122f-49a9-a4f6-d03afe90cb10.png'
};

const defaultContact: ContactConfig = {
  phone: defaultBusiness.phone,
  whatsapp: defaultBusiness.whatsapp,
  email: defaultBusiness.email,
  address: defaultBusiness.address,
  addressHi: defaultBusiness.addressHi,
  workingHours: {
    daily: defaultBusiness.workingHours.daily,
    dailyHi: defaultBusiness.workingHours.dailyHi,
    festivals: defaultBusiness.workingHours.festivals,
    festivalsHi: defaultBusiness.workingHours.festivalsHi,
    ekadashi: defaultBusiness.workingHours.ekadashi,
    ekadashiHi: defaultBusiness.workingHours.ekadashiHi
  }
};

const defaultAbout: AboutConfig = {
  story: '',
  storyHi: '',
  ownerName: defaultBusiness.ownerName,
  ownerNameHi: defaultBusiness.ownerNameHi,
  ownerTitle: 'Owner & Tea Master',
  ownerImage: '/sawariya-photos/a251a44f-d0aa-4c88-894c-b0ccf80c16ad.png',
  stats: [
    { icon: 'Coffee', value: '1000+', label: 'Cups Daily', labelHi: 'कप प्रतिदिन' },
    { icon: 'Users', value: '10K+', label: 'Happy Customers', labelHi: 'खुश ग्राहक' },
    { icon: 'Clock', value: '6AM - 10PM', label: 'Open Hours', labelHi: 'खुलने का समय' },
    { icon: 'Award', value: 'Premium', label: 'Near Toran Gate', labelHi: 'तोरण गेट पर' }
  ],
  coreValues: []
};

export default function AdminContent() {
  const [subTab, setSubTab] = useState<'hero' | 'contact' | 'about'>('hero');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real-time document hooks
  const { data: heroData, loading: loadingHero } = useRealTimeDocument<HeroConfig>('site_content', 'hero', defaultHero);
  const { data: contactData, loading: loadingContact } = useRealTimeDocument<ContactConfig>('site_content', 'contact', defaultContact);
  const { data: aboutData, loading: loadingAbout } = useRealTimeDocument<AboutConfig>('site_content', 'about', defaultAbout);

  const loading = loadingHero || loadingContact || loadingAbout;

  // --- Hero Banner Form Fields ---
  const [blessing, setBlessing] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopNameHi, setShopNameHi] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroSubtitleHi, setHeroSubtitleHi] = useState('');
  const [heroBgFile, setHeroBgFile] = useState<File | null>(null);
  const [heroBgUrl, setHeroBgUrl] = useState('');

  // --- Contact Info Form Fields ---
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [addressHi, setAddressHi] = useState('');
  const [hoursDaily, setHoursDaily] = useState('');
  const [hoursDailyHi, setHoursDailyHi] = useState('');
  const [hoursFestivals, setHoursFestivals] = useState('');
  const [hoursFestivalsHi, setHoursFestivalsHi] = useState('');
  const [hoursEkadashi, setHoursEkadashi] = useState('');
  const [hoursEkadashiHi, setHoursEkadashiHi] = useState('');

  // --- About Page Form Fields ---
  const [aboutStory, setAboutStory] = useState('');
  const [aboutStoryHi, setAboutStoryHi] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerNameHi, setOwnerNameHi] = useState('');
  const [ownerTitle, setOwnerTitle] = useState('');
  const [ownerImageFile, setOwnerImageFile] = useState<File | null>(null);
  const [ownerImageUrl, setOwnerImageUrl] = useState('');

  // Sync real-time data → form fields (only when not saving, to avoid overwriting mid-edit)
  useEffect(() => {
    if (!saving && heroData) {
      setBlessing(heroData.blessing || '');
      setShopName(heroData.shopName || '');
      setShopNameHi(heroData.shopNameHi || '');
      setHeroSubtitle(heroData.subtitle || '');
      setHeroSubtitleHi(heroData.subtitleHi || '');
      setHeroBgUrl(heroData.bgImage || '');
    }
  }, [heroData]);

  useEffect(() => {
    if (!saving && contactData) {
      setPhone(contactData.phone || '');
      setWhatsapp(contactData.whatsapp || '');
      setEmail(contactData.email || '');
      setAddress(contactData.address || '');
      setAddressHi(contactData.addressHi || '');
      setHoursDaily(contactData.workingHours?.daily || '');
      setHoursDailyHi(contactData.workingHours?.dailyHi || '');
      setHoursFestivals(contactData.workingHours?.festivals || '');
      setHoursFestivalsHi(contactData.workingHours?.festivalsHi || '');
      setHoursEkadashi(contactData.workingHours?.ekadashi || '');
      setHoursEkadashiHi(contactData.workingHours?.ekadashiHi || '');
    }
  }, [contactData]);

  useEffect(() => {
    if (!saving && aboutData) {
      setAboutStory(aboutData.story || '');
      setAboutStoryHi(aboutData.storyHi || '');
      setOwnerName(aboutData.ownerName || '');
      setOwnerNameHi(aboutData.ownerNameHi || '');
      setOwnerTitle(aboutData.ownerTitle || '');
      setOwnerImageUrl(aboutData.ownerImage || '');
    }
  }, [aboutData]);


  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const configPayload: HeroConfig = {
        blessing,
        shopName,
        shopNameHi,
        subtitle: heroSubtitle,
        subtitleHi: heroSubtitleHi,
        bgImage: heroBgUrl
      };
      await contentService.saveHeroConfig(configPayload, heroBgFile || undefined);
      setHeroBgFile(null);
      showSuccess('Hero Banner configuration updated successfully!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Failed to save Hero configurations: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const configPayload: ContactConfig = {
        phone,
        whatsapp,
        email,
        address,
        addressHi,
        workingHours: {
          daily: hoursDaily,
          dailyHi: hoursDailyHi,
          festivals: hoursFestivals,
          festivalsHi: hoursFestivalsHi,
          ekadashi: hoursEkadashi,
          ekadashiHi: hoursEkadashiHi
        }
      };
      await contentService.saveContactConfig(configPayload);
      showSuccess('Contact details & working hours updated successfully!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Failed to save Contact configurations: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const configPayload: AboutConfig = {
        ...aboutData,
        story: aboutStory,
        storyHi: aboutStoryHi,
        ownerName,
        ownerNameHi,
        ownerTitle,
        ownerImage: ownerImageUrl
      };
      await contentService.saveAboutConfig(configPayload, ownerImageFile || undefined);
      setOwnerImageFile(null);
      showSuccess('About page content updated successfully!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Failed to save About configurations: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p className="animate-pulse">Loading settings content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub Tabs Controls */}
      <div className="flex flex-wrap gap-2 border-b border-gray-150 pb-4">
        {[
          { id: 'hero', name: 'Hero Banner', icon: <LayoutGrid size={14} /> },
          { id: 'contact', name: 'Contact Details', icon: <Phone size={14} /> },
          { id: 'about', name: 'About Content', icon: <User size={14} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              subTab === tab.id
                ? 'bg-saffron text-white shadow-md shadow-saffron/10 scale-102'
                : 'bg-white text-gray-400 hover:text-secondary hover:bg-gray-50 border border-gray-100'
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl flex items-center gap-2 animate-scale-in text-sm font-semibold">
          <Sparkles className="w-4 h-4 text-green-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form Panels */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
        
        {/* ========================================== */}
        {/* HERO BANNER SECTION */}
        {/* ========================================== */}
        {subTab === 'hero' && (
          <form onSubmit={handleSaveHero} className="space-y-6 max-w-3xl">
            <h4 className="font-heading font-bold text-secondary text-base">Hero Section Settings</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Blessing Banner</label>
                <input
                  type="text"
                  value={blessing}
                  onChange={(e) => setBlessing(e.target.value)}
                  className="w-full bg-cream border-0 rounded-xl px-4 py-3 text-secondary text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Shop Name</label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full bg-cream border-0 rounded-xl px-4 py-3 text-secondary text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Shop Name (Hindi)</label>
                <input
                  type="text"
                  value={shopNameHi}
                  onChange={(e) => setShopNameHi(e.target.value)}
                  className="w-full font-hindi bg-cream border-0 rounded-xl px-4 py-3 text-secondary text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Hero Subtitle</label>
                <input
                  type="text"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full bg-cream border-0 rounded-xl px-4 py-3 text-secondary text-sm outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Hero Subtitle (Hindi)</label>
                <input
                  type="text"
                  value={heroSubtitleHi}
                  onChange={(e) => setHeroSubtitleHi(e.target.value)}
                  className="w-full font-hindi bg-cream border-0 rounded-xl px-4 py-3 text-secondary text-sm outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Background Image</label>
                {heroBgUrl && (
                  <div className="w-40 h-24 rounded-2xl overflow-hidden border border-gray-100 mb-2">
                    <img src={heroBgUrl} alt="Hero Background preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setHeroBgFile(file);
                      setHeroBgUrl(URL.createObjectURL(file));
                    }
                  }}
                  className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-saffron hover:file:bg-orange-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3.5 bg-secondary hover:bg-saffron text-white rounded-full font-bold shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5 text-xs disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Hero Banner'}</span>
            </button>
          </form>
        )}

        {/* ========================================== */}
        {/* CONTACT INFO SECTION */}
        {/* ========================================== */}
        {subTab === 'contact' && (
          <form onSubmit={handleSaveContact} className="space-y-6 max-w-3xl">
            <h4 className="font-heading font-bold text-secondary text-base">Contact details & timings</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-cream border-0 rounded-xl px-4 py-3 text-secondary text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-cream border-0 rounded-xl px-4 py-3 text-secondary text-sm outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Email ID</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cream border-0 rounded-xl px-4 py-3 text-secondary text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Shop Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-cream border-0 rounded-xl px-4 py-3 text-secondary text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Address in Hindi</label>
                <input
                  type="text"
                  value={addressHi}
                  onChange={(e) => setAddressHi(e.target.value)}
                  className="w-full font-hindi bg-cream border-0 rounded-xl px-4 py-3 text-secondary text-sm outline-none"
                />
              </div>

              {/* Timings */}
              <div className="md:col-span-2 border-t border-gray-100 pt-6">
                <h5 className="font-heading font-bold text-secondary text-sm mb-4">Working Hours</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Daily Timings</label>
                    <input
                      type="text"
                      value={hoursDaily}
                      onChange={(e) => setHoursDaily(e.target.value)}
                      className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Daily Timings (Hindi)</label>
                    <input
                      type="text"
                      value={hoursDailyHi}
                      onChange={(e) => setHoursDailyHi(e.target.value)}
                      className="w-full font-hindi bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Festivals Timings</label>
                    <input
                      type="text"
                      value={hoursFestivals}
                      onChange={(e) => setHoursFestivals(e.target.value)}
                      className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Festivals Timings (Hindi)</label>
                    <input
                      type="text"
                      value={hoursFestivalsHi}
                      onChange={(e) => setHoursFestivalsHi(e.target.value)}
                      className="w-full font-hindi bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Ekadashi Days</label>
                    <input
                      type="text"
                      value={hoursEkadashi}
                      onChange={(e) => setHoursEkadashi(e.target.value)}
                      className="w-full bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Ekadashi Days (Hindi)</label>
                    <input
                      type="text"
                      value={hoursEkadashiHi}
                      onChange={(e) => setHoursEkadashiHi(e.target.value)}
                      className="w-full font-hindi bg-cream border-0 rounded-xl px-4 py-2.5 text-secondary text-sm outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3.5 bg-secondary hover:bg-saffron text-white rounded-full font-bold shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5 text-xs disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Contact details'}</span>
            </button>
          </form>
        )}

        {/* ========================================== */}
        {/* ABOUT CONTENT SECTION */}
        {/* ========================================== */}
        {subTab === 'about' && (
          <form onSubmit={handleSaveAbout} className="space-y-6 max-w-3xl">
            <h4 className="font-heading font-bold text-secondary text-base">About Us Content Settings</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Stall Bio / History (English)</label>
                <textarea
                  rows={5}
                  required
                  value={aboutStory}
                  onChange={(e) => setAboutStory(e.target.value)}
                  className="w-full bg-cream border-0 rounded-xl px-4 py-3 text-secondary text-sm outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Stall Bio / History (Hindi)</label>
                <textarea
                  rows={4}
                  value={aboutStoryHi}
                  onChange={(e) => setAboutStoryHi(e.target.value)}
                  className="w-full font-hindi bg-cream border-0 rounded-xl px-4 py-3 text-secondary text-sm outline-none resize-none"
                />
              </div>

              <div className="border-t border-gray-100 pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <h5 className="font-heading font-bold text-secondary text-sm">Owner Details</h5>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Owner Name</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-cream border-0 rounded-xl px-4 py-3 text-secondary text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Owner Name (Hindi)</label>
                  <input
                    type="text"
                    value={ownerNameHi}
                    onChange={(e) => setOwnerNameHi(e.target.value)}
                    className="w-full font-hindi bg-cream border-0 rounded-xl px-4 py-3 text-secondary text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Owner Title</label>
                  <input
                    type="text"
                    required
                    value={ownerTitle}
                    onChange={(e) => setOwnerTitle(e.target.value)}
                    className="w-full bg-cream border-0 rounded-xl px-4 py-3 text-secondary text-sm outline-none"
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Owner Profile Photo</label>
                  {ownerImageUrl && (
                    <div className="w-28 h-28 rounded-2xl overflow-hidden border border-gray-100 mb-2">
                      <img src={ownerImageUrl} alt="Owner preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setOwnerImageFile(file);
                        setOwnerImageUrl(URL.createObjectURL(file));
                      }
                    }}
                    className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-saffron hover:file:bg-orange-100"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3.5 bg-secondary hover:bg-saffron text-white rounded-full font-bold shadow-md hover:scale-[1.02] transition-all flex items-center gap-1.5 text-xs disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save About Content'}</span>
            </button>
          </form>
        )}
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
            <p className="text-gray-450 text-xs mb-6">{errorMessage}</p>

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
