import React, { useState, useEffect, useRef } from 'react';
import { mentorsApi, uploadMentorImage } from '../lib/api';
import { Save, Plus, Trash2, Edit3, Users, Upload, Image, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Mentor {
  _id: string;
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  accent: 'blue' | 'orange' | 'green';
}

const Mentors: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Mentor>>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accentOptions = [
    { value: 'blue', label: 'Blue', color: '#3b82f6' },
    { value: 'orange', label: 'Orange', color: '#f59e0b' },
    { value: 'green', label: 'Green', color: '#10b981' }
  ];

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await mentorsApi.getAll();
      if (response.success) {
        setMentors(response.data as Mentor[]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch mentors');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {

    setEditingId('new');
    setFormData({
      id: '',
      name: '',
      role: '',
      company: '',
      image: '',
      accent: 'blue'
    });
    setImagePreview('');
  };

  const handleEdit = (mentor: Mentor) => {
    setEditingId(mentor._id);
    setFormData(mentor);
    // Set image preview - handle both filename and URL cases
    const imageValue = mentor.image || '';
    if (imageValue && !imageValue.startsWith('http')) {
      setImagePreview(`${import.meta.env.VITE_API_BASE_URL}/uploads/team-images/${imageValue}`);
    } else {
      setImagePreview(imageValue);
    }
  };

  const handleSave = async () => {

    if (!formData.id || !formData.name || !formData.role || !formData.company || !formData.image || !formData.accent) {
      setError('All fields are required');
      return;
    }

    try {
      setSaving(true);
      let response;
      
      if (editingId === 'new') {

        response = await mentorsApi.create(formData);
      } else if (editingId) {

        response = await mentorsApi.update(editingId, formData);
      }


      if (response?.success) {
        await fetchMentors();
        setEditingId(null);
        setFormData({});
        setError('');
      } else {
        setError(response?.message || 'Failed to save mentor');
      }
    } catch (error) {
      console.error('Save error:', error);
      setError(error instanceof Error ? error.message : 'Failed to save mentor');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mentor?')) return;

    try {
      const response = await mentorsApi.delete(id);
      if (response?.success) {
        await fetchMentors();
      } else {
        setError(response?.message || 'Failed to delete mentor');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete mentor');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setImagePreview('');

      // Upload immediately
      const result = await uploadMentorImage(file);

      if (result.success && result.filename) {
        // Set preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Update form data with filename
        setFormData({ ...formData, image: result.filename });
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(result.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
    setError('');
    setImagePreview('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expert Mentors Section</h1>
          <p className="text-gray-600">Manage the mentors displayed in the "Expert Mentors" section on the About page</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Mentor
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* New Mentor Form */}
      {editingId === 'new' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Mentor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID
                </label>
                <input
                  type="text"
                  value={formData.id || ''}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., mentor-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Senior Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Google"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="space-y-6">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Profile image preview"
                          className="h-32 w-32 object-cover mx-auto rounded-full"
                        />
                        <button
                          onClick={() => {
                            setImagePreview('');
                            setFormData({ ...formData, image: '' });
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Image className="w-16 h-16 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm">Drag and drop or click to upload</p>
                        <p className="text-xs">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    )}
                    
                    <div className="flex justify-center">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                        ref={fileInputRef}
                        disabled={uploading}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2 disabled:opacity-50"
                        disabled={uploading}
                      >
                        <Upload className="w-4 h-4" />
                        {uploading ? 'Uploading...' : imagePreview ? 'Change Image' : 'Upload Image'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accent Color
                </label>
                <select
                  value={formData.accent || ''}
                  onChange={(e) => setFormData({ ...formData, accent: e.target.value as 'blue' | 'orange' | 'green' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {accentOptions.map((accent) => (
                    <option key={accent.value} value={accent.value}>
                      {accent.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {mentors.map((mentor) => (
          <div key={mentor._id} className="bg-white border border-gray-200 rounded-lg p-6">
            {editingId === mentor._id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID
                    </label>
                    <input
                      type="text"
                      value={formData.id || ''}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., mentor-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={formData.role || ''}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Senior Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company || ''}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Google"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="space-y-6">
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Profile image preview"
                              className="h-32 w-32 object-cover mx-auto rounded-full"
                            />
                            <button
                              onClick={() => {
                                setImagePreview('');
                                setFormData({ ...formData, image: '' });
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                              title="Remove image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <Image className="w-16 h-16 mb-2 text-gray-400" />
                            <p className="mb-2 text-sm">Drag and drop or click to upload</p>
                            <p className="text-xs">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        )}
                        
                        <div className="flex justify-center">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                            ref={fileInputRef}
                            disabled={uploading}
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2 disabled:opacity-50"
                            disabled={uploading}
                          >
                            <Upload className="w-4 h-4" />
                            {uploading ? 'Uploading...' : imagePreview ? 'Change Image' : 'Upload Image'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Accent Color
                    </label>
                    <select
                      value={formData.accent || ''}
                      onChange={(e) => setFormData({ ...formData, accent: e.target.value as 'blue' | 'orange' | 'green' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {accentOptions.map((accent) => (
                        <option key={accent.value} value={accent.value}>
                          {accent.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {mentor.image ? (
                      <img 
                        src={mentor.image.startsWith('http') ? mentor.image : `${import.meta.env.VITE_API_BASE_URL}/uploads/team-images/${mentor.image}`}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const nextSibling = target.nextElementSibling as HTMLElement;
                          if (nextSibling) {
                            nextSibling.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center" style={{ display: mentor.image ? 'none' : 'flex' }}>
                      <Users className="text-gray-400" size={24} />
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{mentor.name}</div>
                    <div className="text-sm text-gray-600">{mentor.role} at {mentor.company}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span>ID: {mentor.id}</span>
                      <span>Accent: {mentor.accent}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(mentor)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(mentor._id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {mentors.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No mentors</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first mentor.</p>
        </div>
      )}
    </div>
  );
};

export default Mentors;
