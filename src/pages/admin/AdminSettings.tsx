import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Save, ImagePlus } from 'lucide-react';

export default function AdminSettings() {
  const token = localStorage.getItem('admin_token');
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    hero_image_url: '',
    promo_title: '',
    promo_subtitle: '',
    promo_link: '',
    promo_image_url: '',
    // Custom offer settings
    offer_enabled: 'true',
    offer_title: '',
    offer_subtitle: '',
    offer_badge: '',
    offer_image_url: '',
    offer_link: '',
    offer_button_text: '',
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/settings/`);
      return res.data;
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        hero_image_url: settings.hero_image_url || '',
        promo_title: settings.promo_title || '',
        promo_subtitle: settings.promo_subtitle || '',
        promo_link: settings.promo_link || '',
        promo_image_url: settings.promo_image_url || '',
        offer_enabled: settings.offer_enabled ?? 'true',
        offer_title: settings.offer_title || '',
        offer_subtitle: settings.offer_subtitle || '',
        offer_badge: settings.offer_badge || '',
        offer_image_url: settings.offer_image_url || '',
        offer_link: settings.offer_link || '',
        offer_button_text: settings.offer_button_text || '',
      });
    }
  }, [settings]);

  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const uploadData = new FormData();
    uploadData.append('image', file);
    
    setIsUploading(prev => ({ ...prev, [field]: true }));
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/upload/`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, [field]: res.data.url }));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Upload failed');
    } finally {
      setIsUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const updateSettings = useMutation({
    mutationFn: async (newSettings: typeof formData) => {
      return axios.put(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/settings/`, newSettings, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      alert('Settings saved successfully!');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(formData);
  };

  if (isLoading) return <div className="p-8">Loading settings...</div>;

  // Shared styles
  const labelCls = "block text-sm font-medium text-gray-700";
  const inputCls = "mt-1 w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors";
  const fileInputCls = "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Store Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {/* Hero Section Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">Home Page - Hero Section</h3>
          
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Hero Background Image</label>
              <div className="mt-1 flex flex-col gap-2">
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero_image_url')} disabled={isUploading['hero_image_url']} className={fileInputCls} />
                {isUploading['hero_image_url'] && <span className="text-sm text-blue-600">Uploading image...</span>}
                <input type="url" value={formData.hero_image_url} onChange={e => setFormData({...formData, hero_image_url: e.target.value})} className={`${inputCls} !mt-0 text-sm`} placeholder="Or paste image URL here..." />
                {formData.hero_image_url && <img src={formData.hero_image_url} alt="Hero Preview" className="mt-2 h-40 object-cover rounded border" />}
              </div>
            </div>
          </div>
        </div>

        {/* Promo Banner Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">Home Page - Promotional Banner</h3>
          
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Promo Title</label>
              <input type="text" value={formData.promo_title} onChange={e => setFormData({...formData, promo_title: e.target.value})} className={inputCls} placeholder="e.g. Weekend Special. Up to 30% Off." />
            </div>
            
            <div>
              <label className={labelCls}>Promo Subtitle</label>
              <textarea value={formData.promo_subtitle} onChange={e => setFormData({...formData, promo_subtitle: e.target.value})} className={inputCls} rows={2} placeholder="e.g. Upgrade your wardrobe with our latest arrivals." />
            </div>

            <div>
              <label className={labelCls}>Promo Button Link</label>
              <input type="text" value={formData.promo_link} onChange={e => setFormData({...formData, promo_link: e.target.value})} className={inputCls} placeholder="e.g. /shop?sale=true" />
            </div>

            <div>
              <label className={labelCls}>Promo Image</label>
              <div className="mt-1 flex flex-col gap-2">
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'promo_image_url')} disabled={isUploading['promo_image_url']} className={fileInputCls} />
                {isUploading['promo_image_url'] && <span className="text-sm text-blue-600">Uploading image...</span>}
                <input type="url" value={formData.promo_image_url} onChange={e => setFormData({...formData, promo_image_url: e.target.value})} className={`${inputCls} !mt-0 text-sm`} placeholder="Or paste image URL here..." />
                {formData.promo_image_url && <img src={formData.promo_image_url} alt="Promo Preview" className="mt-2 h-40 object-cover rounded border" />}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Offer Banner Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ImagePlus className="w-5 h-5 text-blue-600" />
              Custom Offer Banner
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm font-medium text-gray-600">
                {formData.offer_enabled === 'true' ? 'Visible' : 'Hidden'}
              </span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, offer_enabled: prev.offer_enabled === 'true' ? 'false' : 'true' }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.offer_enabled === 'true' ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${formData.offer_enabled === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </label>
          </div>
          <p className="text-sm text-gray-500 mb-5">This banner appears on the home page below the "Trending Now" section. Upload a custom image and set your offer text.</p>
          
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Offer Badge Text <span className="text-gray-400 font-normal">(small label above title)</span></label>
              <input type="text" value={formData.offer_badge} onChange={e => setFormData({...formData, offer_badge: e.target.value})} className={inputCls} placeholder="e.g. Limited Time Offer, Eid Special, Flash Sale" />
            </div>

            <div>
              <label className={labelCls}>Offer Title</label>
              <input type="text" value={formData.offer_title} onChange={e => setFormData({...formData, offer_title: e.target.value})} className={inputCls} placeholder="e.g. Buy 2 Get 1 Free on All Skincare" />
            </div>
            
            <div>
              <label className={labelCls}>Offer Description</label>
              <textarea value={formData.offer_subtitle} onChange={e => setFormData({...formData, offer_subtitle: e.target.value})} className={inputCls} rows={2} placeholder="e.g. Grab your favourite products at the best price. Offer valid till stock lasts." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Button Text</label>
                <input type="text" value={formData.offer_button_text} onChange={e => setFormData({...formData, offer_button_text: e.target.value})} className={inputCls} placeholder="e.g. Shop Now, Grab The Deal" />
              </div>
              <div>
                <label className={labelCls}>Button Link</label>
                <input type="text" value={formData.offer_link} onChange={e => setFormData({...formData, offer_link: e.target.value})} className={inputCls} placeholder="e.g. /shop or /shop?category=skincare" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Offer Banner Image</label>
              <div className="mt-1 flex flex-col gap-2">
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'offer_image_url')} disabled={isUploading['offer_image_url']} className={fileInputCls} />
                {isUploading['offer_image_url'] && <span className="text-sm text-blue-600">Uploading image...</span>}
                <input type="url" value={formData.offer_image_url} onChange={e => setFormData({...formData, offer_image_url: e.target.value})} className={`${inputCls} !mt-0 text-sm`} placeholder="Or paste image URL here..." />
                {formData.offer_image_url && (
                  <div className="mt-2 relative rounded-lg overflow-hidden border border-gray-200">
                    <img src={formData.offer_image_url} alt="Offer Preview" className="w-full h-48 object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, offer_image_url: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={updateSettings.isPending} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            <Save className="w-5 h-5" />
            {updateSettings.isPending ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
