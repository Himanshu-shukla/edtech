import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { companyInfoApi, highlightedCountriesApi, contactDataApi } from '../lib/api';
import { Save, Plus, Trash2 } from 'lucide-react';
import CountrySelector from '../components/CountrySelector';

interface CompanyInfo {
  _id: string;
  whatsappNumber: string;
  supportEmail: string;
  heroRoles: string[];
  carouselRoles: string[];
  marketingStats: Array<{
    number: string;
    label: string;
  }>;
  whatsappQuickMessages: string[];
  pricingFaq: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
  courseBenefitsComparison: Array<{
    feature: string;
    description: string;
    us: boolean | string;
    others: boolean | string;
  }>;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  // Contact Data fields
  offices: Array<{
    name: string;
    address: string;
    email?: string;
    phone: string;
    mapUrl?: string;
  }>;
  responseTime: string;
  mapEmbedUrl: string;
}

const CompanyInfo: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [highlightedCountries, setHighlightedCountries] = useState<{ _id: string; countries: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch all data in parallel
        const [companyResponse, contactResponse, countriesResponse] = await Promise.all([
          companyInfoApi.getAll(),
          contactDataApi.getAll(),
          highlightedCountriesApi.getAll()
        ]);

        // Process company info
        let companyInfoData: CompanyInfo;
        if (companyResponse.success && companyResponse.data && Array.isArray(companyResponse.data) && companyResponse.data.length > 0) {
          companyInfoData = companyResponse.data[0] as CompanyInfo;
        } else {
          // Create empty company info if none exists
          companyInfoData = {
            _id: '',
            whatsappNumber: '',
            supportEmail: '',
            heroRoles: [],
            carouselRoles: [],
            marketingStats: [],
            whatsappQuickMessages: [],
            pricingFaq: [],
            courseBenefitsComparison: [],
            socialMedia: {
              facebook: '',
              instagram: '',
              linkedin: ''
            },
            offices: [],
            responseTime: '',
            mapEmbedUrl: ''
          };
        }

        // Process contact data
        if (contactResponse.success && contactResponse.data && Array.isArray(contactResponse.data) && contactResponse.data.length > 0) {
          const contactData = contactResponse.data[0];

          
          // Merge contact data into company info
          companyInfoData = {
            ...companyInfoData,
            offices: contactData.offices || [],
            responseTime: contactData.responseTime || '',
            mapEmbedUrl: contactData.mapEmbedUrl || ''
          };
        } else {

        }

        // Set the merged company info
        setCompanyInfo(companyInfoData);

        // Process highlighted countries
        if (countriesResponse.success && countriesResponse.data && Array.isArray(countriesResponse.data) && countriesResponse.data.length > 0) {
          setHighlightedCountries(countriesResponse.data[0] as { _id: string; countries: string[] });
        } else {
          // Create empty highlighted countries if none exists
          setHighlightedCountries({
            _id: '',
            countries: []
          });
        }

      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);



  const handleSave = async () => {
    if (!companyInfo) return;

    try {
      setSaving(true);
      let response;
      
      if (companyInfo._id) {
        response = await companyInfoApi.update(companyInfo._id, companyInfo);
      } else {
        response = await companyInfoApi.create(companyInfo);
      }

      if (response.success) {
        if (!companyInfo._id && response.data && typeof response.data === 'object' && '_id' in response.data) {
          setCompanyInfo({ ...companyInfo, _id: (response.data as CompanyInfo)._id });
        }
      } else {
        setError(response.message || 'Failed to save company info');
        return;
      }

      // Save contact data separately
      const contactDataToSave = {
        offices: companyInfo.offices,
        responseTime: companyInfo.responseTime,
        mapEmbedUrl: companyInfo.mapEmbedUrl
      };

      try {
        const contactDataResponse = await contactDataApi.getAll();
        let contactResponse;
        
        if (contactDataResponse.success && contactDataResponse.data && Array.isArray(contactDataResponse.data) && contactDataResponse.data.length > 0) {
          // Update existing contact data
          const existingContactData = contactDataResponse.data[0];
          contactResponse = await contactDataApi.update(existingContactData._id, contactDataToSave);
        } else {
          // Create new contact data
          contactResponse = await contactDataApi.create(contactDataToSave);
        }

        if (!contactResponse.success) {
          setError(contactResponse.message || 'Failed to save contact data');
          return;
        }
      } catch (error) {
        setError('Failed to save contact data');
        return;
      }

      // Save highlighted countries
      if (highlightedCountries) {
        let countriesResponse;
        if (highlightedCountries._id) {
          countriesResponse = await highlightedCountriesApi.update(highlightedCountries._id, highlightedCountries);
        } else {
          countriesResponse = await highlightedCountriesApi.create(highlightedCountries);
        }

        if (countriesResponse.success) {
          if (!highlightedCountries._id && countriesResponse.data && typeof countriesResponse.data === 'object' && '_id' in countriesResponse.data) {
            setHighlightedCountries({ ...highlightedCountries, _id: (countriesResponse.data as any)._id });
          }
        } else {
          setError(countriesResponse.message || 'Failed to save highlighted countries');
          return;
        }
      }

      toast.success('Company info, contact data, and highlighted countries saved successfully!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  const addArrayItem = (field: keyof CompanyInfo, defaultValue: any) => {
    if (!companyInfo) {
      console.error('CompanyInfo is null, cannot add item');
      return;
    }
    

    
    const currentArray = companyInfo[field] as any[] || [];
    const newArray = [...currentArray, defaultValue];
    

    
    setCompanyInfo({
      ...companyInfo,
      [field]: newArray
    });
  };

  const updateArrayItem = (field: keyof CompanyInfo, index: number, value: any) => {
    if (!companyInfo) {
      console.error('CompanyInfo is null, cannot update item');
      return;
    }
    
    const currentArray = companyInfo[field] as any[] || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    

    
    setCompanyInfo({ ...companyInfo, [field]: newArray });
  };

  const removeArrayItem = (field: keyof CompanyInfo, index: number) => {
    if (!companyInfo) {
      console.error('CompanyInfo is null, cannot remove item');
      return;
    }
    
    const currentArray = companyInfo[field] as any[] || [];
    const newArray = [...currentArray];
    newArray.splice(index, 1);
    

    
    setCompanyInfo({ ...companyInfo, [field]: newArray });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!companyInfo) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Information & Settings</h1>
          <p className="text-gray-600 mt-2">Manage company information used across the website including Hero section, Stats, WhatsApp widget, and contact details</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn btn-primary"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {/* Highlighted Countries */}
      <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 relative">
        <div className="card-header bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🌍</div>
            <div>
              <h3 className="text-xl text-gray-900 font-bold">Highlighted Countries</h3>
              <p className="text-gray-600 mt-1">
                Select countries to highlight on the website. These countries will be displayed in the about section.
              </p>
            </div>
          </div>
        </div>
        <div className="card-body p-6 pb-8">
          {highlightedCountries && (
            <CountrySelector
              selectedCountries={highlightedCountries.countries}
              onSelectionChange={(countries) => setHighlightedCountries({ ...highlightedCountries, countries })}
              placeholder="Type to search countries (e.g., 'India', 'United States')..."
              maxHeight="300px"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium">Basic Information</h3>
          </div>
          <div className="card-body space-y-4">
            <div className="form-group">
              <label className="form-label">WhatsApp Number</label>
              <input
                type="text"
                className="form-input"
                value={companyInfo.whatsappNumber}
                onChange={(e) => setCompanyInfo({ ...companyInfo, whatsappNumber: e.target.value })}
                placeholder="+1234567890"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Support Email</label>
              <input
                type="email"
                className="form-input"
                value={companyInfo.supportEmail}
                onChange={(e) => setCompanyInfo({ ...companyInfo, supportEmail: e.target.value })}
                placeholder="support@company.com"
              />
            </div>
          </div>
        </div>

        {/* Marketing Stats */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium">Marketing Statistics</h3>
          </div>
          <div className="card-body space-y-4">
            {(companyInfo.marketingStats || []).map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder="Number"
                  value={stat.number}
                  onChange={(e) => updateArrayItem('marketingStats', index, { ...stat, number: e.target.value })}
                />
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder="Label"
                  value={stat.label}
                  onChange={(e) => updateArrayItem('marketingStats', index, { ...stat, label: e.target.value })}
                />
                <button
                  onClick={() => removeArrayItem('marketingStats', index)}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem('marketingStats', { number: '', label: '' })}
              className="btn btn-secondary btn-sm"
            >
              <Plus className="w-3 h-3" />
              Add Stat
            </button>
          </div>
        </div>

        {/* Social Media */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <div className="text-lg">🔗</div>
              <div>
                <h3 className="text-lg font-medium">Social Media Links</h3>
                <p className="text-sm text-gray-600 mt-1">Add social media URLs to display in the footer</p>
              </div>
            </div>
          </div>
          <div className="card-body space-y-4">
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <span className="text-blue-600">📘</span>
                Facebook URL
              </label>
              <input
                type="url"
                className="form-input"
                value={companyInfo.socialMedia?.facebook || ''}
                onChange={(e) => setCompanyInfo({
                  ...companyInfo,
                  socialMedia: {
                    ...companyInfo.socialMedia,
                    facebook: e.target.value
                  }
                })}
                placeholder="https://facebook.com/yourcompany"
              />
            </div>
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <span className="text-pink-500">📷</span>
                Instagram URL
              </label>
              <input
                type="url"
                className="form-input"
                value={companyInfo.socialMedia?.instagram || ''}
                onChange={(e) => setCompanyInfo({
                  ...companyInfo,
                  socialMedia: {
                    ...companyInfo.socialMedia,
                    instagram: e.target.value
                  }
                })}
                placeholder="https://instagram.com/yourcompany"
              />
            </div>
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <span className="text-blue-700">💼</span>
                LinkedIn URL
              </label>
              <input
                type="url"
                className="form-input"
                value={companyInfo.socialMedia?.linkedin || ''}
                onChange={(e) => setCompanyInfo({
                  ...companyInfo,
                  socialMedia: {
                    ...companyInfo.socialMedia,
                    linkedin: e.target.value
                  }
                })}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Roles */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium">Hero Roles</h3>
        </div>
        <div className="card-body">
          <div className="space-y-2">
            {(companyInfo.heroRoles || []).map((role, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder="Role title"
                  value={role}
                  onChange={(e) => updateArrayItem('heroRoles', index, e.target.value)}
                />
                <button
                  onClick={() => removeArrayItem('heroRoles', index)}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem('heroRoles', '')}
              className="btn btn-secondary btn-sm"
            >
              <Plus className="w-3 h-3" />
              Add Role
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Roles */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium">Carousel Roles</h3>
        </div>
        <div className="card-body">
          <div className="space-y-2">
            {(companyInfo.carouselRoles || []).map((role, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder="Role title"
                  value={role}
                  onChange={(e) => updateArrayItem('carouselRoles', index, e.target.value)}
                />
                <button
                  onClick={() => removeArrayItem('carouselRoles', index)}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem('carouselRoles', '')}
              className="btn btn-secondary btn-sm"
            >
              <Plus className="w-3 h-3" />
              Add Role
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Quick Messages */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium">WhatsApp Quick Messages</h3>
        </div>
        <div className="card-body">
          <div className="space-y-2">
            {(companyInfo.whatsappQuickMessages || []).map((message, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder="Quick message"
                  value={message}
                  onChange={(e) => updateArrayItem('whatsappQuickMessages', index, e.target.value)}
                />
                <button
                  onClick={() => removeArrayItem('whatsappQuickMessages', index)}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem('whatsappQuickMessages', '')}
              className="btn btn-secondary btn-sm"
            >
              <Plus className="w-3 h-3" />
              Add Message
            </button>
          </div>
        </div>
      </div>

      {/* Contact Data */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium">Contact Information</h3>
        </div>
        <div className="card-body space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Response Time</label>
              <input
                type="text"
                className="form-input"
                value={companyInfo.responseTime}
                onChange={(e) => setCompanyInfo({ ...companyInfo, responseTime: e.target.value })}
                placeholder="e.g., Within 24 hours"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Map Embed URL</label>
              <input
                type="url"
                className="form-input"
                value={companyInfo.mapEmbedUrl}
                onChange={(e) => setCompanyInfo({ ...companyInfo, mapEmbedUrl: e.target.value })}
                placeholder="https://maps.google.com/embed/..."
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-3">Office Locations</h4>
            
            <div className="space-y-4">
              {(companyInfo.offices || []).map((office, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-sm font-medium text-gray-700">Office #{index + 1}</h5>
                    <button
                      onClick={() => removeArrayItem('offices', index)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Remove Office"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="form-group">
                      <label className="form-label">Office Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={office.name || ''}
                        onChange={(e) => updateArrayItem('offices', index, { ...office, name: e.target.value })}
                        placeholder="e.g., Main Office"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={office.phone || ''}
                        onChange={(e) => updateArrayItem('offices', index, { ...office, phone: e.target.value })}
                        placeholder="+1234567890"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address *</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={office.address || ''}
                      onChange={(e) => updateArrayItem('offices', index, { ...office, address: e.target.value })}
                      placeholder="Full office address"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="form-group">
                      <label className="form-label">Email (Optional)</label>
                      <input
                        type="email"
                        className="form-input"
                        value={office.email || ''}
                        onChange={(e) => updateArrayItem('offices', index, { ...office, email: e.target.value })}
                        placeholder="office@company.com"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Map URL (Optional)</label>
                      <input
                        type="url"
                        className="form-input"
                        value={office.mapUrl || ''}
                        onChange={(e) => updateArrayItem('offices', index, { ...office, mapUrl: e.target.value })}
                        placeholder="https://maps.google.com/..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center">
                <button
                  onClick={() => {

                    addArrayItem('offices', { 
                      name: '', 
                      address: '', 
                      phone: '', 
                      email: '', 
                      mapUrl: '' 
                    });
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                >
                  <Plus size={16} />
                  Add New Office
                </button>
              </div>
              
              {(companyInfo.offices || []).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No office locations added yet.</p>
                  <p className="text-sm mt-1">Click "Add New Office" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing FAQ */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium">Pricing FAQ</h3>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {(companyInfo.pricingFaq || []).map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="form-group">
                    <label className="form-label">ID</label>
                    <input
                      type="number"
                      className="form-input"
                      value={faq.id}
                      onChange={(e) => updateArrayItem('pricingFaq', index, { ...faq, id: parseInt(e.target.value) || 0 })}
                      placeholder="1"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Question</label>
                  <input
                    type="text"
                    className="form-input"
                    value={faq.question}
                    onChange={(e) => updateArrayItem('pricingFaq', index, { ...faq, question: e.target.value })}
                    placeholder="What is your pricing structure?"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Answer</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => updateArrayItem('pricingFaq', index, { ...faq, answer: e.target.value })}
                    placeholder="Detailed answer to the question..."
                  />
                </div>
                <button
                  onClick={() => removeArrayItem('pricingFaq', index)}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove FAQ
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem('pricingFaq', { id: (companyInfo.pricingFaq || []).length + 1, question: '', answer: '' })}
              className="btn btn-secondary btn-sm"
            >
              <Plus className="w-3 h-3" />
              Add FAQ
            </button>
          </div>
        </div>
      </div>

      {/* Course Benefits Comparison */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium">Course Benefits Comparison</h3>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {(companyInfo.courseBenefitsComparison || []).map((benefit, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="form-label">Feature</label>
                    <input
                      type="text"
                      className="form-input"
                      value={benefit.feature}
                      onChange={(e) => updateArrayItem('courseBenefitsComparison', index, { ...benefit, feature: e.target.value })}
                      placeholder="e.g., Live Support"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-input"
                      value={benefit.description}
                      onChange={(e) => updateArrayItem('courseBenefitsComparison', index, { ...benefit, description: e.target.value })}
                      placeholder="Brief description of the feature"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="form-label">Us (✓ or ✗ or text)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={String(benefit.us)}
                      onChange={(e) => updateArrayItem('courseBenefitsComparison', index, { ...benefit, us: e.target.value })}
                      placeholder="✓ or ✗ or custom text"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Others (✓ or ✗ or text)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={String(benefit.others)}
                      onChange={(e) => updateArrayItem('courseBenefitsComparison', index, { ...benefit, others: e.target.value })}
                      placeholder="✓ or ✗ or custom text"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeArrayItem('courseBenefitsComparison', index)}
                  className="btn btn-danger btn-sm"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove Benefit
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem('courseBenefitsComparison', { feature: '', description: '', us: '✓', others: '✗' })}
              className="btn btn-secondary btn-sm"
            >
              <Plus className="w-3 h-3" />
              Add Benefit
            </button>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default CompanyInfo;
