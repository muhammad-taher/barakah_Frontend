import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi, { API_URL } from '../../utils/adminApi';
import { Trash2, Plus, Edit2, ArrowUp, ArrowDown, Eye, EyeOff, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SectionForm {
  heading: string;
  bullets: string;
  active: boolean;
  order_index: number;
}

const EMPTY_FORM: SectionForm = { heading: '', bullets: '', active: true, order_index: 0 };

export default function AdminContent() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<SectionForm>(EMPTY_FORM);

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ['admin_content_sections'],
    queryFn: async () => {
      const res = await adminApi.get(`${API_URL}/api/v1/content-sections/all`);
      return res.data;
    }
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin_content_sections'] });

  const saveMutation = useMutation({
    mutationFn: async (data: SectionForm) => {
      // The API accepts bullets as an array; one per line in the textarea.
      const payload = {
        ...data,
        bullets: data.bullets.split('\n').map(b => b.trim()).filter(Boolean)
      };
      if (editingId) {
        return adminApi.put(`${API_URL}/api/v1/content-sections/${editingId}`, payload);
      }
      return adminApi.post(`${API_URL}/api/v1/content-sections/`, payload);
    },
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || error.message || 'Failed to save section');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) =>
      adminApi.put(`${API_URL}/api/v1/content-sections/${id}`, data),
    onSuccess: invalidate
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => adminApi.delete(`${API_URL}/api/v1/content-sections/${id}`),
    onSuccess: invalidate
  });

  const openModal = (section?: any) => {
    if (section) {
      setEditingId(section.id);
      setFormData({
        heading: section.heading || '',
        bullets: (section.bullets || []).join('\n'),
        active: section.active,
        order_index: section.order_index
      });
    } else {
      setEditingId(null);
      const nextIndex = sections.length > 0 ? Math.max(...sections.map((s: any) => s.order_index)) + 1 : 0;
      setFormData({ ...EMPTY_FORM, order_index: nextIndex });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  /** Swap order_index with the neighbouring section. */
  const move = (index: number, direction: -1 | 1) => {
    const current = sections[index];
    const target = sections[index + direction];
    if (!target) return;
    updateMutation.mutate({ id: current.id, data: { order_index: target.order_index } });
    updateMutation.mutate({ id: target.id, data: { order_index: current.order_index } });
  };

  if (isLoading) return <div className="p-8">Loading content sections...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Home Page Content Sections</h2>
        <button
          onClick={() => openModal()}
          className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition-colors whitespace-nowrap"
        >
          <Plus size={18} />
          Add Section
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Each section renders as an orange heading bar with a bullet list underneath, in the order shown here.
      </p>

      <div className="space-y-4">
        {sections.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            No content sections yet. Add one to get started.
          </div>
        )}

        {sections.map((section: any, index: number) => (
          <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-start justify-between gap-4 p-4 border-b border-gray-100">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-800">{section.heading}</h3>
                  {!section.active && (
                    <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded">Hidden</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {section.bullets.length} bullet{section.bullets.length === 1 ? '' : 's'} · position {index + 1}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  title="Move up"
                  className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === sections.length - 1}
                  title="Move down"
                  className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={() => updateMutation.mutate({ id: section.id, data: { active: !section.active } })}
                  title={section.active ? 'Hide from home page' : 'Show on home page'}
                  className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded"
                >
                  {section.active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => openModal(section)}
                  title="Edit"
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete the section "${section.heading}"?`)) {
                      deleteMutation.mutate(section.id);
                    }
                  }}
                  title="Delete"
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Live preview of how it renders on the home page */}
            <div className="bg-[#FBE4E9] p-4">
              <div className="bg-[#E8883C] rounded-full px-5 py-2.5 mb-4">
                <p className="text-white text-base font-bold text-center">{section.heading}</p>
              </div>
              <ul className="space-y-2">
                {section.bullets.map((bullet: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#E8883C] flex items-center justify-center shrink-0 mt-0.5">
                      <ArrowRight className="w-3 h-3 text-white" strokeWidth={3} />
                    </span>
                    <div className="text-zinc-800 font-semibold text-sm break-words [&_p]:m-0 [&_strong]:font-extrabold [&_a]:underline [&_a]:text-orange-700">
                      <ReactMarkdown>{bullet}</ReactMarkdown>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Section' : 'Add New Section'}</h3>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                <input
                  required
                  type="text"
                  value={formData.heading}
                  onChange={e => setFormData({ ...formData, heading: e.target.value })}
                  placeholder="যেমন: প্রোডাক্টের বৈশিষ্ট্য:"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bullet Points <span className="text-gray-400 font-normal">(one per line)</span>
                </label>
                <textarea
                  value={formData.bullets}
                  onChange={e => setFormData({ ...formData, bullets: e.target.value })}
                  rows={8}
                  placeholder={'আয়নার মতো গ্লসি শাইন\nদাগ প্রতিরোধী ও ওয়াটারপ্রুফ\nদ্রুত শুকায়'}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-black outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Each line becomes one bullet with an orange arrow. Empty lines are ignored.
                  Markdown works: <code className="bg-gray-100 px-1 rounded">**bold**</code>,{' '}
                  <code className="bg-gray-100 px-1 rounded">*italic*</code>,{' '}
                  <code className="bg-gray-100 px-1 rounded">[link](https://...)</code>.
                  Font size is set in Settings.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Index (lower appears first)</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={e => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
