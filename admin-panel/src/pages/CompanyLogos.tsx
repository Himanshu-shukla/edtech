import React, { useState, useEffect } from 'react';
import { companyLogosApi } from '../lib/api';
import { Save, Plus, Trash2, Edit3, Building2 } from 'lucide-react';

interface CompanyLogo {
  _id: string;
  name: string;
  logo: string;
}

const CompanyLogos: React.FC = () => {
  const [logos, setLogos] = useState<CompanyLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CompanyLogo>>({});

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      setLoading(true);
      const response = await companyLogosApi.getAll();
      if (response.success) {
        setLogos(response.data as CompanyLogo[]);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch company logos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingId('new');
    setFormData({
      name: '',
      logo: ''
    });
  };

  const handleEdit = (logo: CompanyLogo) => {
    setEditingId(logo._id);
    setFormData(logo);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.logo) {
      setError('All fields are required');
      return;
    }

    try {
      setSaving(true);
      let response;
      
      if (editingId === 'new') {
        response = await companyLogosApi.create(formData);
      } else if (editingId) {
        response = await companyLogosApi.update(editingId, formData);
      }

      if (response?.success) {
        await fetchLogos();
        setEditingId(null);
        setFormData({});
        setError('');
      } else {
        setError(response?.message || 'Failed to save company logo');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save company logo');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company logo?')) return;

    try {
      const response = await companyLogosApi.delete(id);
      if (response?.success) {
        await fetchLogos();
      } else {
        setError(response?.message || 'Failed to delete company logo');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete company logo');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
    setError('');
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
          <h1 className="text-2xl font-bold text-gray-900">Global Placements Section</h1>
          <p className="text-gray-600">Manage the company logos displayed in the "Global Placements" section on the homepage</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Logo
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* New Logo Form */}
      {editingId === 'new' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Company Logo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Google"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={formData.logo || ''}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
            
            {formData.logo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Preview
                </label>
                <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <img
                    src={formData.logo}
                    alt="Logo preview"
                    className="max-h-20 max-w-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const nextSibling = target.nextElementSibling as HTMLElement;
                      if (nextSibling) {
                        nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                    <Building2 size={40} />
                    <span className="ml-2">Invalid logo URL</span>
                  </div>
                </div>
              </div>
            )}
            
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
        {logos.map((logo) => (
          <div key={logo._id} className="bg-white border border-gray-200 rounded-lg p-6">
            {editingId === logo._id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Google"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={formData.logo || ''}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
                
                {formData.logo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Preview
                    </label>
                    <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <img
                        src={formData.logo}
                        alt="Logo preview"
                        className="max-h-20 max-w-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const nextSibling = target.nextElementSibling as HTMLElement;
                          if (nextSibling) {
                            nextSibling.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                        <Building2 size={40} />
                        <span className="ml-2">Invalid logo URL</span>
                      </div>
                    </div>
                  </div>
                )}
                
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
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    {logo.logo ? (
                      <img 
                        src={logo.logo} 
                        alt={logo.name}
                        className="w-16 h-16 rounded-lg object-contain"
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
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center" style={{ display: logo.logo ? 'none' : 'flex' }}>
                      <Building2 className="text-gray-400" size={24} />
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{logo.name}</div>
                    <div className="text-sm text-gray-500 mt-1">Logo URL: {logo.logo}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(logo)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(logo._id)}
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

      {logos.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No company logos</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first company logo.</p>
        </div>
      )}
    </div>
  );
};

export default CompanyLogos;
