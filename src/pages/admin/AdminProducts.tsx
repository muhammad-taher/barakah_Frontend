import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: 1,
    image_url: ''
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const uploadData = new FormData();
    uploadData.append('image', file);
    
    setIsUploading(true);
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/v1/upload/', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, image_url: res.data.url }));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin_products'],
    queryFn: async () => {
      const res = await axios.get('http://127.0.0.1:5000/api/v1/products/');
      return res.data;
    }
  });

  const addProduct = useMutation({
    mutationFn: async (newProduct: any) => {
      return axios.post('http://127.0.0.1:5000/api/v1/products/', newProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_products'] });
      closeModal();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || error.message || 'Failed to add product');
    }
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      return axios.put(`http://127.0.0.1:5000/api/v1/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_products'] });
      closeModal();
    }
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      return axios.delete(`http://127.0.0.1:5000/api/v1/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_products'] });
    }
  });

  const openModal = (product?: any) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        sku: product.sku || '',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        category_id: product.category_id || 1,
        image_url: product.image_url || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', slug: '', sku: '', description: '', price: 0, stock: 0, category_id: 1, image_url: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', slug: '', sku: '', description: '', price: 0, stock: 0, category_id: 1, image_url: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct.mutate({ id: editingId, data: formData });
    } else {
      addProduct.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct.mutate(id);
    }
  };

  if (isLoading) return <div>Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="mt-1 w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Image</label>
                <div className="mt-1 flex flex-col gap-2">
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  {isUploading && <span className="text-sm text-blue-600">Uploading image...</span>}
                  <input type="url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full p-2 border rounded-md text-sm" placeholder="Or paste image URL here..." />
                  {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-2 h-24 object-contain rounded border" />}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Price (৳)</label>
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="mt-1 w-full p-2 border rounded-md" />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="mt-1 w-full p-2 border rounded-md" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editingId ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Slug</th>
              <th className="p-4 font-semibold text-gray-600">Price</th>
              <th className="p-4 font-semibold text-gray-600">Stock</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p: any) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4 text-sm text-gray-500">{p.slug}</td>
                <td className="p-4 font-semibold">৳ {p.price}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4 space-x-2">
                  <button onClick={() => openModal(p)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
