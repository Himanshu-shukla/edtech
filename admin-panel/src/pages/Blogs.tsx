import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { blogsApi } from '../lib/api';
import type { BlogPost } from '../types';
import { Plus, Edit, Trash2, Search, Calendar, User, Save, X, Upload, Image, File } from 'lucide-react';

const BlogsList: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogsApi.getAll();
      if (response.success && response.data) {
        setBlogs(response.data as BlogPost[]);
      } else {
        throw new Error(response.message || 'Failed to fetch blog posts');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingId('new');
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: {
        name: '',
        role: '',
        avatar: ''
      },
      category: '',
      tags: [],
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: 5,
      featured: false,
      image: ''
    });
    setImagePreview('');
    setImageFile(null);
    setAvatarPreview('');
    setAvatarFile(null);
    setActiveTab('basic');
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingId(blog._id);
    setFormData({
      ...blog,
      publishedAt: blog.publishedAt.split('T')[0],
      tags: blog.tags || []
    });
    // Set image preview - handle both filename and URL cases
    const imageValue = blog.image || '';
    if (imageValue && !imageValue.startsWith('http')) {
      setImagePreview(`${import.meta.env.VITE_API_BASE_URL}/uploads/blog-images/${imageValue}`);
    } else {
      setImagePreview(imageValue);
    }
    setImageFile(null);
    // Set avatar preview - handle both filename and URL cases
    const avatarValue = blog.author?.avatar || '';
    if (avatarValue && !avatarValue.startsWith('http')) {
      setAvatarPreview(`${import.meta.env.VITE_API_BASE_URL}/uploads/blog-images/${avatarValue}`);
    } else {
      setAvatarPreview(avatarValue);
    }
    setAvatarFile(null);
    setActiveTab('basic');
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setAvatarFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
      // Don't update form data with preview URL - let the backend handle the filename
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content || !formData.author?.name) {
      setError('Title, content, and author name are required');
      return;
    }

    try {
      setSaving(true);
      let response;
      
      // Generate slug from title if not provided
      if (!formData.slug) {
        formData.slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      // Create FormData object for file upload
      const formDataObj = new FormData();
      
      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'author' && value) {
          // Handle nested author object
          Object.entries(value).forEach(([authorKey, authorValue]) => {
            // Skip avatar if we have an avatar file to upload
            if (authorKey === 'avatar' && avatarFile) {
              return;
            }
            formDataObj.append(`author[${authorKey}]`, authorValue as string);
          });
        } else if (key === 'tags' && Array.isArray(value)) {
          // Handle tags array
          value.forEach((tag, index) => {
            formDataObj.append(`tags[${index}]`, tag);
          });
        } else if (value !== undefined && value !== null && key !== 'image') {
          // Skip image field since we're handling it separately
          formDataObj.append(key, value.toString());
        }
      });
      
      // Add image file if selected
      if (imageFile) {
        formDataObj.append('image', imageFile);
      }
      
      // Add avatar file if selected
      if (avatarFile) {
        formDataObj.append('avatarImage', avatarFile);
      }
      
      if (editingId === 'new') {
        response = await blogsApi.create(formDataObj);
      } else if (editingId) {
        response = await blogsApi.update(editingId, formDataObj);
      }

      if (response?.success) {
        await fetchBlogs();
        setEditingId(null);
        setFormData({});
        setImageFile(null);
        setImagePreview('');
        setAvatarFile(null);
        setAvatarPreview('');
        setError('');
      } else {
        setError(response?.message || 'Failed to save blog post');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const response = await blogsApi.delete(id);
      if (response.success) {
        setBlogs(prev => prev.filter(blog => blog._id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete blog post');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete blog post');
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags?.includes(tag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tag.trim()]
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage blog content and articles displayed on the Blog page
          </p>
        </div>
        <button onClick={handleCreate} className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Post
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
              placeholder="Search blog posts..."
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
            onClick={fetchBlogs}
            className="mt-2 btn btn-secondary text-xs"
          >
            Try again
          </button>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {editingId === 'new' ? 'Create New Blog Post' : 'Edit Blog Post'}
                </h3>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Tabs Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('basic')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'basic'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Basic Info
                  </button>
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'content'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Content
                  </button>
                  <button
                    onClick={() => setActiveTab('media')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'media'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Media
                  </button>
                  <button
                    onClick={() => setActiveTab('meta')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'meta'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Meta & Tags
                  </button>
                </nav>
              </div>
            </div>
            
            <div className="card-body space-y-4">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                    <label className="form-label">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Blog post title"
                      required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="url-friendly-slug (auto-generated if empty)"
                />
              </div>
            </div>

            <div className="form-group">
                  <label className="form-label">Excerpt <span className="text-red-500">*</span></label>
              <textarea
                className="form-input"
                rows={2}
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description of the blog post"
                    required
              />
            </div>

            <div className="form-group">
                  <label className="form-label">Category <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Blog category"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured || false}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded"
                    />
                    <span className="form-label mb-0">Featured Post</span>
                  </label>
                </div>
              </>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <>
                <div className="form-group">
                  <label className="form-label">Content <span className="text-red-500">*</span></label>
                  <div className="bg-gray-50 rounded-t-md p-2 text-xs text-gray-500 border border-gray-300 border-b-0">
                    <div className="flex items-center gap-1">
                      <File className="w-3 h-3" />
                      <span>Markdown supported</span>
                    </div>
                  </div>
                  <textarea
                    className="form-input rounded-t-none"
                    rows={20}
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Full blog post content (supports markdown)"
                    required
                  />
                </div>
              </>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Featured Image <span className="text-red-500">*</span></label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="space-y-6">
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Featured image preview"
                              className="max-h-64 max-w-full mx-auto rounded-lg"
                            />
                            <button
                              onClick={() => {
                                setImagePreview('');
                                setImageFile(null);
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
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="btn btn-secondary"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {imagePreview ? 'Change Image' : 'Upload Image'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Author Avatar <span className="text-red-500">*</span></label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="space-y-6">
                        {avatarPreview ? (
                          <div className="relative">
                            <img
                              src={avatarPreview}
                              alt="Author avatar preview"
                              className="h-32 w-32 object-cover mx-auto rounded-full"
                            />
                            <button
                              onClick={() => {
                                setAvatarPreview('');
                                setAvatarFile(null);
                                setFormData({ 
                                  ...formData, 
                                  author: {
                                    ...(formData.author || { name: '', role: '' }),
                                    avatar: ''
                                  }
                                });
                                if (avatarFileInputRef.current) avatarFileInputRef.current.value = '';
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                              title="Remove avatar"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <User className="w-16 h-16 mb-2 text-gray-400" />
                            <p className="mb-2 text-sm">Upload author avatar</p>
                            <p className="text-xs">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        )}
                        
                        <div className="flex justify-center">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleAvatarChange}
                            className="hidden"
                            ref={avatarFileInputRef}
                          />
                          <button
                            onClick={() => avatarFileInputRef.current?.click()}
                            className="btn btn-secondary"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {avatarPreview ? 'Change Avatar' : 'Upload Avatar'}
                          </button>
                        </div>
                        

                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Meta & Tags Tab */}
            {activeTab === 'meta' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Publish Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.publishedAt || ''}
                      onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                      required
                />
              </div>
              <div className="form-group">
                    <label className="form-label">Read Time (minutes) <span className="text-red-500">*</span></label>
                <input
                      type="number"
                  className="form-input"
                      value={formData.readTime || ''}
                      onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                      min="1"
                      required
                />
              </div>
            </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                     <label className="form-label">Author Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.author?.name || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    author: { 
                      name: e.target.value,
                      role: formData.author?.role || '',
                      avatar: formData.author?.avatar || ''
                    } 
                  })}
                  placeholder="Author name"
                       required
                />
              </div>
              <div className="form-group">
                     <label className="form-label">Author Role <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.author?.role || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    author: { 
                      name: formData.author?.name || '',
                      role: e.target.value,
                      avatar: formData.author?.avatar || ''
                    } 
                  })}
                  placeholder="Author role"
                       required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag, index) => (
                    <span key={index} className="badge badge-primary">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-xs hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add a tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              </div>
            </div>
              </>
            )}

            {/* Form Actions - Always Visible */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t mt-8">
              <div className="flex gap-2">
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="btn btn-primary"
              >
                  <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Post'}
              </button>
              <button 
                onClick={() => setEditingId(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              </div>
              
              <div className="flex gap-2">
                {activeTab !== 'basic' && (
                  <button 
                    onClick={() => {
                      const tabs = ['basic', 'content', 'media', 'meta'];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1]);
                      }
                    }}
                    className="btn btn-secondary"
                  >
                    Previous
                  </button>
                )}
                
                {activeTab !== 'meta' && (
                  <button 
                    onClick={() => {
                      const tabs = ['basic', 'content', 'media', 'meta'];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1]);
                      }
                    }}
                    className="btn btn-secondary"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Blog Posts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map((blog) => (
          <div key={blog._id} className="card">
            {/* Featured image */}
            <div className="aspect-w-16 aspect-h-9">
                              <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-t-lg overflow-hidden">
                  {blog.image ? (
              <img
                      src={blog.image.startsWith('http') ? blog.image : `${import.meta.env.VITE_API_BASE_URL}/uploads/blog-images/${blog.image}`}
                alt={blog.title}
                      className="w-full h-full object-cover"
                onError={(e) => {
                        if (!(e.target as HTMLImageElement).dataset.usedFallback) {
                  const target = e.target as HTMLImageElement;
                          target.dataset.usedFallback = 'true';
                          target.style.display = 'none';
                          target.parentElement!.classList.add('bg-gray-200');
                          
                          // Create and append placeholder content
                          const placeholder = document.createElement('div');
                          placeholder.className = 'text-gray-400 text-center p-4';
                          placeholder.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p>Image not available</p>
                          `;
                          target.parentElement!.appendChild(placeholder);
                        }
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>No image</p>
                    </div>
                  )}
                </div>
            </div>
            
            <div className="card-body">
              {/* Category and featured badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="badge badge-primary">{blog.category}</span>
                {blog.featured && (
                  <span className="badge badge-warning">Featured</span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {blog.title}
              </h3>

              {/* Excerpt */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {blog.excerpt}
              </p>

              {/* Author and date */}
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <User className="w-4 h-4 mr-1" />
                <span className="mr-3">{blog.author.name}</span>
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {blog.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="badge badge-gray text-xs">
                    {tag}
                  </span>
                ))}
                {blog.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{blog.tags.length - 3} more
                  </span>
                )}
              </div>

              {/* Read time */}
              <div className="text-xs text-gray-500 mb-4">
                {blog.readTime} min read
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleEdit(blog)}
                    className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-gray-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBlogs.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No blog posts found</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="stat-value">{blogs.length}</div>
          <div className="stat-label">Total Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{blogs.filter(b => b.featured).length}</div>
          <div className="stat-label">Featured Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{new Set(blogs.map(b => b.category)).size}</div>
          <div className="stat-label">Categories</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{new Set(blogs.flatMap(b => b.tags)).size}</div>
          <div className="stat-label">Unique Tags</div>
        </div>
      </div>
    </div>
  );
};

export default BlogsList;
