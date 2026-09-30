import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi, { API_URL } from '../../utils/adminApi';
import { Trash2, Plus } from 'lucide-react';

export default function AdminReviews() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['admin_reviews'],
    queryFn: async () => {
      const res = await adminApi.get(`${API_URL}/api/v1/reviews/all`);
      return res.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await adminApi.post(`${API_URL}/api/v1/reviews/`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_reviews'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await adminApi.delete(`${API_URL}/api/v1/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_reviews'] });
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    
    setIsUploading(true);
    try {
      const res = await adminApi.post(`${API_URL}/api/v1/upload/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      saveMutation.mutate({ image_url: res.data.url, active: true, order_index: 0 });
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading reviews...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Customer Reviews Screenshots</h2>
        <div className="relative">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <button 
            disabled={isUploading}
            className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <Plus size={18} />
            {isUploading ? 'Uploading...' : 'Upload Review'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {reviews?.map((r: any) => (
            <div key={r.id} className="relative group border rounded overflow-hidden aspect-[3/4]">
              <img src={r.image_url} alt="Review" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => {
                    if (window.confirm('Delete this review?')) {
                      deleteMutation.mutate(r.id);
                    }
                  }}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {reviews?.length === 0 && (
            <div className="col-span-full p-8 text-center text-gray-500">
              No review screenshots added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
