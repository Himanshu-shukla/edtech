import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  companyInfoApi, 
  teamMembersApi, 
  valuesApi, 
  statsApi, 
  milestonesApi, 
  contactDataApi, 
  upcomingSkillsApi 
} from '../lib/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Building2, 
  Users, 
  Star, 
  BarChart3, 
  Calendar, 
  MapPin, 
  TrendingUp 
} from 'lucide-react';

interface CompanyData {
  companyInfo: any[];
  teamMembers: any[];
  values: any[];
  stats: any[];
  milestones: any[];
  contactData: any[];
  upcomingSkills: any[];
}

const Company: React.FC = () => {
  const [data, setData] = useState<CompanyData>({
    companyInfo: [],
    teamMembers: [],
    values: [],
    stats: [],
    milestones: [],
    contactData: [],
    upcomingSkills: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'team' | 'values' | 'stats' | 'milestones' | 'contact' | 'skills'>('info');
  const [editingItem, setEditingItem] = useState<{ type: string; item: any } | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchAllCompanyData();
  }, []);

  const fetchAllCompanyData = async () => {
    try {
      setLoading(true);
      
      const [
        companyInfoResponse,
        teamMembersResponse,
        valuesResponse,
        statsResponse,
        milestonesResponse,
        contactDataResponse,
        upcomingSkillsResponse
      ] = await Promise.all([
        companyInfoApi.getAll(),
        teamMembersApi.getAll(),
        valuesApi.getAll(),
        statsApi.getAll(),
        milestonesApi.getAll(),
        contactDataApi.getAll(),
        upcomingSkillsApi.getAll()
      ]);

      setData({
        companyInfo: companyInfoResponse.success ? (companyInfoResponse.data as any[]) : [],
        teamMembers: teamMembersResponse.success ? (teamMembersResponse.data as any[]) : [],
        values: valuesResponse.success ? (valuesResponse.data as any[]) : [],
        stats: statsResponse.success ? (statsResponse.data as any[]) : [],
        milestones: milestonesResponse.success ? (milestonesResponse.data as any[]) : [],
        contactData: contactDataResponse.success ? (contactDataResponse.data as any[]) : [],
        upcomingSkills: upcomingSkillsResponse.success ? (upcomingSkillsResponse.data as any[]) : []
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch company data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (type: string) => {
    setEditingItem({ type, item: { _id: 'new' } });
    setFormData(getDefaultFormData(type));
  };

  const handleEdit = (type: string, item: any) => {
    setEditingItem({ type, item });
    setFormData(item);
  };

  const handleSave = async () => {
    if (!editingItem) return;

    try {
      const api = getApiForType(editingItem.type);
      
      if (editingItem.item._id === 'new') {
        await api.create(formData);
      } else {
        await api.update(editingItem.item._id, formData);
      }

      await fetchAllCompanyData();
      setEditingItem(null);
      setFormData({});
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save');
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const api = getApiForType(type);
      await api.delete(id);
      await fetchAllCompanyData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete');
    }
  };

  const getApiForType = (type: string) => {
    switch (type) {
      case 'info': return companyInfoApi;
      case 'team': return teamMembersApi;
      case 'values': return valuesApi;
      case 'stats': return statsApi;
      case 'milestones': return milestonesApi;
      case 'contact': return contactDataApi;
      case 'skills': return upcomingSkillsApi;
      default: throw new Error('Unknown type');
    }
  };

  const getDefaultFormData = (type: string) => {
    switch (type) {
      case 'team':
        return { name: '', role: '', bio: '', image: '', linkedin: '', twitter: '' };
      case 'values':
        return { iconPath: '', title: '', description: '' };
      case 'stats':
        return { number: '', label: '', color: '' };
      case 'milestones':
        return { year: '', title: '', description: '' };
      case 'skills':
        return { id: '', name: '', category: '', demand: '', growth: '', icon: '', accent: '' };
      default:
        return {};
    }
  };

  const tabs = [
    { id: 'info', label: 'Company Info', icon: Building2 },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'values', label: 'Values', icon: Star },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'milestones', label: 'Milestones', icon: Calendar },
    { id: 'contact', label: 'Contact Data', icon: MapPin },
    { id: 'skills', label: 'Upcoming Skills', icon: TrendingUp }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Management Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all company-related information across different sections of the website
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id as any)}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            {activeTab !== 'info' && activeTab !== 'contact' && (
              <button
                onClick={() => handleCreate(activeTab)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add {tabs.find(t => t.id === activeTab)?.label}
              </button>
            )}
          </div>
        </div>

        <div className="card-body">
          {/* Team Members */}
          {activeTab === 'team' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.teamMembers.map((member) => (
                <div key={member._id} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={member.image || '/placeholder-avatar.png'}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{member.bio}</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit('team', member)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('team', member._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Values */}
          {activeTab === 'values' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.values.map((value) => (
                <div key={value._id} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{value.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{value.description}</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit('values', value)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('values', value._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {activeTab === 'stats' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {data.stats.map((stat) => (
                <div key={stat._id} className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                  <div className="flex justify-center space-x-2 mt-3">
                    <button
                      onClick={() => handleEdit('stats', stat)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete('stats', stat._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Milestones */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              {data.milestones.map((milestone) => (
                <div key={milestone._id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                          {milestone.year}
                        </span>
                        <h4 className="font-medium">{milestone.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit('milestones', milestone)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('milestones', milestone._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming Skills */}
          {activeTab === 'skills' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.upcomingSkills.map((skill) => (
                <div key={skill._id} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{skill.name}</h4>
                  <p className="text-sm text-gray-600 mb-1">Category: {skill.category}</p>
                  <p className="text-sm text-gray-600 mb-1">Demand: {skill.demand}</p>
                  <p className="text-sm text-gray-600 mb-3">Growth: {skill.growth}</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit('skills', skill)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('skills', skill._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Company Info and Contact Data would be displayed differently as they're single entities */}
          {activeTab === 'info' && (
            <div className="text-center py-8">
              <p className="text-gray-600">Company Info management will be implemented here</p>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="text-center py-8">
              <p className="text-gray-600">Contact Data management will be implemented here</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {editingItem.item._id === 'new' ? 'Create' : 'Edit'} {tabs.find(t => t.id === editingItem.type)?.label}
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="card-body space-y-4">
              {/* Form fields would go here based on editingItem.type */}
              <div className="text-center py-4">
                <p className="text-gray-600">Form fields for {editingItem.type} will be implemented</p>
              </div>
            </div>

            <div className="card-footer flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingItem(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Company;
