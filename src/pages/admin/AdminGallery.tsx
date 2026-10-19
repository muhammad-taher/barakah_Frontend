import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi, { API_URL } from '../../utils/adminApi';
import { Trash2, Plus, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';

export default function AdminGallery() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [editingCaptionId, setEditingCaptionId] = useState<number | null>(null);
  const [captionDraft, setCaptionDraft] = useState('');

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['admin_gallery'],
    queryFn: async () => {
      const res = await adminApi.get(`${API_URL}/api/v1/gallery/all`);
      return res.data;
    }
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin_gallery'] });

  const createMutation = useMutation({
    mutationFn: async (data: any) => adminApi.post(`${API_URL}/api/v1/gallery/`, data),
    onSuccess: invalidate
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) =>
      adminApi.put(`${API_URL}/api/v1/gallery/${id}`, data),
    onSuccess: invalidate
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => adminApi.delete(`${API_URL}/api/v1/gallery/${id}`),
    onSuccess: invalidate
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
      const nextIndex = images.length > 0 ? Math.max(...images.map((i: any) => i.order_index)) + 1 : 0;
      createMutation.mutate({ image_url: res.data.url, active: true, order_index: nextIndex });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  /** Swap order_index with the neighbouring image. */
  const move = (index: number, direction: -1 | 1) => {
    const target = images[index + direction];
    const current = images[index];
    if (!target) return;
    updateMutation.mutate({ id: current.id, data: { order_index: target.order_index } });
    updateMutation.mutate({ id: target.id, data: { order_index: current.order_index } });
  };

  const saveCaption = (id: number) => {
    updateMutation.mutate({ id, data: { caption: captionDraft } });
    setEditingCaptionId(null);
  };

  if (isLoading) return <div className="p-8">Loading gallery...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Before / After Gallery</h2>
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
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        These images appear in the sliding gallery on the home page ("বার্নিশ করার আগে ও পরের অবস্থা").
        Customers move between them with the left/right arrows. The first image in this list is shown first.
      </p>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {images.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No gallery images yet. Upload one to get started.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {images.map((img: any, index: number) => (
              <div key={img.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img src={img.image_url} alt={img.caption || 'Gallery'} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                  {!img.active && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
                      Hidden
                    </span>
                  )}
                </div>

                <div className="p-3 flex-1 flex flex-col gap-3">
                  {editingCaptionId === img.id ? (
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        type="text"
                        value={captionDraft}
                        onChange={e => setCaptionDraft(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && saveCaption(img.id)}
                        placeholder="যেমন: বার্নিশ করার আগে"
                        className="flex-1 min-w-0 text-sm p-1.5 border border-gray-300 rounded"
                      />
                      <button
                        onClick={() => saveCaption(img.id)}
                        className="text-sm bg-black text-white px-2.5 rounded hover:bg-gray-800"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingCaptionId(img.id); setCaptionDraft(img.caption || ''); }}
                      className="text-sm text-left text-gray-600 hover:text-black truncate"
                      title="Click to edit caption"
                    >
                      {img.caption || <span className="text-gray-400 italic">+ Add caption (optional)</span>}
                    </button>
                  )}

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex gap-1">
                      <button
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        title="Move earlier"
                        className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => move(index, 1)}
                        disabled={index === images.length - 1}
                        title="Move later"
                        className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => updateMutation.mutate({ id: img.id, data: { active: !img.active } })}
                        title={img.active ? 'Hide from home page' : 'Show on home page'}
                        className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded"
                      >
                        {img.active ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this image?')) deleteMutation.mutate(img.id);
                        }}
                        title="Delete"
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
