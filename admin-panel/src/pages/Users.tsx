import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authApi, adminApi } from '../lib/api';
import type { User } from '../types';
import { Plus, Edit, Trash2, Search, Shield, User as UserIcon, Mail, Save, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface CreateUserData extends Partial<User> {
  password?: string;
}

const UsersList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateUserData>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await authApi.getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data as User[]);
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingId('new');
    setFormData({
      name: '',
      email: '',
      role: 'user',
      password: ''
    });
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData(user);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    if (editingId === 'new' && !formData.password) {
      setError('Password is required for new users');
      return;
    }

    // Check if trying to change the last admin to user
    if (editingId !== 'new') {
      const currentUser = users.find(u => u.id === editingId);
      const adminCount = users.filter(u => u.role === 'admin').length;
      const isChangingToUser = formData.role === 'user';
      const isCurrentlyAdmin = currentUser?.role === 'admin';
      
      if (isCurrentlyAdmin && isChangingToUser && adminCount <= 1) {
        setError('Cannot change the last admin to user. At least one admin must remain.');
        return;
      }
    }

    try {
      setSaving(true);
      let response;
      
      if (editingId === 'new') {
        response = await authApi.createUser(formData);
      } else if (editingId) {
        // For updates, use adminApi and don't send password
        const updateData = { ...formData };
        delete updateData.password;
        response = await adminApi.update('users', editingId, updateData);
      }

      if (response?.success) {
        await fetchUsers();
        setEditingId(null);
        setFormData({});
        setError('');
      } else {
        setError(response?.message || 'Failed to save user');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await authApi.deleteUser(id);
      if (response.success) {
        setUsers(prev => prev.filter(user => user.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage user accounts and permissions
          </p>
        </div>
        <button onClick={handleCreate} className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-body">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-2 btn btn-secondary text-xs"
          >
            Try again
          </button>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {editingId === 'new' ? 'Add New User' : 'Edit User'}
              </h3>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="card-body space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Role</label>
                {(() => {
                  const currentUser = editingId !== 'new' ? users.find(u => u.id === editingId) : null;
                  const adminCount = users.filter(u => u.role === 'admin').length;
                  const isLastAdmin = currentUser?.role === 'admin' && adminCount <= 1;
                  
                  return (
                    <select
                      className={`form-input ${isLastAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      value={formData.role || 'user'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                      disabled={isLastAdmin}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  );
                })()}
                {(() => {
                  const currentUser = editingId !== 'new' ? users.find(u => u.id === editingId) : null;
                  const adminCount = users.filter(u => u.role === 'admin').length;
                  const isLastAdmin = currentUser?.role === 'admin' && adminCount <= 1;
                  
                  return isLastAdmin ? (
                    <p className="text-xs text-red-600 mt-1">
                      Cannot change role: This is the last admin account
                    </p>
                  ) : null;
                })()}
              </div>
              {editingId === 'new' && (
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="btn btn-primary"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save User'}
              </button>
              <button 
                onClick={() => setEditingId(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {user.name}
                          {currentUser?.id === user.id && (
                            <span className="ml-2 text-xs text-blue-600">(You)</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      {user.email}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      {user.role === 'admin' ? (
                        <>
                          <Shield className="w-4 h-4 text-red-500 mr-2" />
                          <span className="badge badge-error">Admin</span>
                        </>
                      ) : (
                        <>
                          <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="badge badge-gray">User</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="badge badge-success">Active</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="p-1 text-gray-400 hover:text-green-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {currentUser?.id !== user.id && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{users.filter(u => u.role === 'admin').length}</div>
          <div className="stat-label">Admins</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{users.filter(u => u.role === 'user').length}</div>
          <div className="stat-label">Regular Users</div>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <Shield className="h-5 w-5 text-blue-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Security Note</h3>
            <p className="text-sm text-blue-600 mt-1">
              Only admin users can access this panel. At least one admin account must remain active at all times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
