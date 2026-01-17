import React, { useState, useEffect } from 'react';
import { statsApi } from '../lib/api';
import { BarChart3, Save, Plus, Trash2, Edit3 } from 'lucide-react';

interface Stat {
  _id: string;
  number: string;
  label: string;
  color: string;
}

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Stat>>({});

  const colorOptions = [
    { value: 'edtech-green', label: 'Green', color: '#10b981' },
    { value: 'edtech-orange', label: 'Orange', color: '#f59e0b' },
    { value: 'edtech-red', label: 'Red', color: '#ef4444' },
    { value: 'edtech-blue', label: 'Blue', color: '#3b82f6' }
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await statsApi.getAll();
      if (response.success) {
        setStats(response.data as Stat[]);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingId('new');
    setFormData({
      number: '',
      label: '',
      color: 'edtech-green'
    });
  };

  const handleEdit = (stat: Stat) => {
    setEditingId(stat._id);
    setFormData(stat);
  };

  const handleSave = async () => {
    if (!formData.number || !formData.label || !formData.color) {
      setError('Number, label, and color are required');
      return;
    }

    try {
      setSaving(true);
      let response;
      
      if (editingId === 'new') {
        response = await statsApi.create(formData);
      } else if (editingId) {
        response = await statsApi.update(editingId, formData);
      }

      if (response?.success) {
        await fetchStats();
        setEditingId(null);
        setFormData({});
        setError('');
      } else {
        setError(response?.message || 'Failed to save stat');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save stat');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;

    try {
      const response = await statsApi.delete(id);
      if (response?.success) {
        await fetchStats();
      } else {
        setError(response?.message || 'Failed to delete stat');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete stat');
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
          <h1 className="text-2xl font-bold text-gray-900">Marketing Statistics Section</h1>
          <p className="text-gray-600">Manage the statistics displayed in the marketing stats section on the About page</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Stat
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {stats.map((stat) => (
          <div key={stat._id} className="bg-white border border-gray-200 rounded-lg p-6">
            {editingId === stat._id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number
                    </label>
                    <input
                      type="text"
                      value={formData.number || ''}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 50,000+"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={formData.label || ''}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Students Graduated"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <select
                      value={formData.color || ''}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {colorOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
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
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                    <div className="text-sm text-gray-500">Color: {stat.color}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(stat)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(stat._id)}
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

      {stats.length === 0 && !loading && (
        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No statistics</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first statistic.</p>
        </div>
      )}
    </div>
  );
};

export default Statistics;
