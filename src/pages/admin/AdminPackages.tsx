import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { LayoutList, Edit2, Trash2 } from 'lucide-react';

export default function AdminPackages() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    headline: '',
    description: '',
    image_url: '',
    product_id: '',
    active: true,
    order_index: 0
  });

  const [isUploading, setIsUploading] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ['admin_products'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/products/`);
      return res.data;
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const uploadData = new FormData();
    uploadData.append('image', file);
    
    setIsUploading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/upload/`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, image_url: res.data.url }));
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['admin_packages'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/packages/`);
      return res.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (editingId) {
        return axios.put(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/packages/${editingId}`, data);
      }
      return axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/packages/`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_packages'] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return axios.delete(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/packages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_packages'] });
    }
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      headline: '',
      description: '',
      image_url: '',
      product_id: '',
      active: true,
      order_index: 0
    });
  };

  const handleEdit = (pkg: any) => {
    setEditingId(pkg.id);
    setFormData({
      headline: pkg.headline,
      description: pkg.description,
      image_url: pkg.image_url,
      product_id: pkg.product_id || '',
      active: pkg.active,
      order_index: pkg.order_index
    });
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="p-8">Loading packages...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Packages</h2>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Add New Package
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Headline</th>
              <th className="p-4">Order Index</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {packages.map((pkg: any) => (
              <tr key={pkg.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  {pkg.image_url ? (
                    <img src={pkg.image_url} alt={pkg.headline} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                      <LayoutList size={20} />
                    </div>
                  )}
                </td>
                <td className="p-4 font-medium">{pkg.headline}</td>
                <td className="p-4">{pkg.order_index}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${pkg.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {pkg.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(pkg)} className="text-blue-600 hover:text-blue-800 mr-3">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this package?')) {
                        deleteMutation.mutate(pkg.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {packages.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No packages found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Package' : 'Add New Package'}</h3>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                <input
                  required
                  type="text"
                  value={formData.headline}
                  onChange={e => setFormData({...formData, headline: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-black outline-none h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
                <select
                  required
                  value={formData.product_id}
                  onChange={e => setFormData({...formData, product_id: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-black outline-none"
                >
                  <option value="">-- Select a product --</option>
                  {products.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {isUploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
                {formData.image_url && (
                  <div className="mt-2">
                    <img src={formData.image_url} alt="Preview" className="h-32 object-contain border rounded" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Index (Lower appears first)</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={e => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={e => setFormData({...formData, active: e.target.checked})}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending || isUploading}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
