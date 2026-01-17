import React, { useState, useEffect } from 'react';
import { upcomingSkillsApi } from '../lib/api';
import { Save, Plus, Trash2, Edit3, TrendingUp } from 'lucide-react';

interface UpcomingSkill {
  _id: string;
  id: string;
  name: string;
  category: string;
  demand: string;
  growth: string;
  icon: string;
  accent: string;
}

const UpcomingSkills: React.FC = () => {
  const [skills, setSkills] = useState<UpcomingSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UpcomingSkill>>({});

  const categories = [
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'business', label: 'Business' },
    { value: 'data', label: 'Data Science' },
    { value: 'other', label: 'Other' }
  ];

  const accentOptions = [
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'orange', label: 'Orange' },
    { value: 'red', label: 'Red' },
    { value: 'purple', label: 'Purple' }
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await upcomingSkillsApi.getAll();
      if (response.success) {
        setSkills(response.data as UpcomingSkill[]);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch upcoming skills');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingId('new');
    setFormData({
      id: '',
      name: '',
      category: 'programming',
      demand: '',
      growth: '',
      icon: '',
      accent: 'blue'
    });
  };

  const handleEdit = (skill: UpcomingSkill) => {
    setEditingId(skill._id);
    setFormData(skill);
  };

  const handleSave = async () => {
    if (!formData.id || !formData.name || !formData.category || !formData.demand || !formData.growth || !formData.icon || !formData.accent) {
      setError('All fields are required');
      return;
    }

    try {
      setSaving(true);
      let response;
      
      if (editingId === 'new') {
        response = await upcomingSkillsApi.create(formData);
      } else if (editingId) {
        response = await upcomingSkillsApi.update(editingId, formData);
      }

      if (response?.success) {
        await fetchSkills();
        setEditingId(null);
        setFormData({});
        setError('');
      } else {
        setError(response?.message || 'Failed to save skill');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save skill');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const response = await upcomingSkillsApi.delete(id);
      if (response?.success) {
        await fetchSkills();
      } else {
        setError(response?.message || 'Failed to delete skill');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete skill');
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
          <h1 className="text-2xl font-bold text-gray-900">Future-Ready Skills Section</h1>
          <p className="text-gray-600">Manage the skills displayed in the "Future-Ready Skills" section on the homepage</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Skill
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {skills.map((skill) => (
          <div key={skill._id} className="bg-white border border-gray-200 rounded-lg p-6">
            {editingId === skill._id ? (
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
                      placeholder="e.g., skill-001"
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
                      placeholder="e.g., React Native"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Accent Color
                    </label>
                    <select
                      value={formData.accent || ''}
                      onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {accentOptions.map((accent) => (
                        <option key={accent.value} value={accent.value}>
                          {accent.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Demand
                    </label>
                    <input
                      type="text"
                      value={formData.demand || ''}
                      onChange={(e) => setFormData({ ...formData, demand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., High"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Growth
                    </label>
                    <input
                      type="text"
                      value={formData.growth || ''}
                      onChange={(e) => setFormData({ ...formData, growth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 25%"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon || ''}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 📱 or icon class name"
                  />
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
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                    {skill.icon || '📚'}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{skill.name}</div>
                    <div className="text-sm text-gray-600">ID: {skill.id}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>Category: {skill.category}</span>
                      <span>Demand: {skill.demand}</span>
                      <span>Growth: {skill.growth}</span>
                      <span>Accent: {skill.accent}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
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

      {skills.length === 0 && !loading && (
        <div className="text-center py-12">
          <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming skills</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first upcoming skill.</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingSkills;
