import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { coursesApi, courseDetailsApi, coursePricingApi, iconsApi, uploadTestimonialAvatar } from '../lib/api';
import type { Course, CourseDetails, CoursePricing } from '../types';
import { Plus, Edit, Trash2, Search, Save, X, BookOpen, DollarSign, Info, GraduationCap, Settings, Star, ChevronDown, Upload, User, Loader2 } from 'lucide-react';

interface UnifiedCourseData {
  // Basic course info (from Courses collection)
  _id?: string;
  id: string;
  category: string;
  badge: string;
  title: string;
  desc: string;
  duration: string;
  extra: string;
  accent: 'edtech-green' | 'edtech-orange' | 'edtech-red' | 'edtech-blue';
  iconName?: string;
  featured?: boolean;
  image?: string; // Course image filename

  // Detailed course info (from CourseDetails collection)
  overview: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  curriculum: Array<{
    module: string;
    duration: string;
    topics: Array<{
      topic: string;
      subtopics: string[];
    }>;
  }>;
  tools: Array<{
    name: string;
    icon: string;
  }>;
  prerequisites: string;
  testimonials: Array<{
    name: string;
    role: string;
    avatar: string;
    rating: number;
    content: string;
    color: string;
  }>;
  successStats: Array<{
    label: string;
    value: string;
    color: string;
  }>;
  // CourseDetails pricing field (embedded in CourseDetails)
  detailsPricing: {
    current: number;
    original: number;
    discount: string;
    deadline: string;
    features: Array<{
      text: string;
      icon: string;
    }>;
  };
  courseInfo: {
    startDate: string;
    format: string;
    support: string;
    studentsEnrolled: string;
  };
  trustIndicators: {
    rating: string;
    reviewCount: string;
    testimonialPreview: {
      text: string;
      author: string;
    };
  };

  // Pricing info (from CoursePricing collection)
  pricingName: string; // Plan name for pricing
  originalPrice: number;
  currentPrice: number;
  installmentPrice: number;
  installmentMonths: number;
  discount: string;
  pricingDuration: string; // Duration for pricing (may differ from course duration)
  pricingExtra: string; // Extra info for pricing (may differ from course extra)
  pricingDescription: string; // Plan description
  pricingFeatures: string[]; // Separate from course features
  highlighted: boolean;
  pricingAccent: 'edtech-green' | 'edtech-orange' | 'edtech-red' | 'edtech-blue';
  pricingBadge: string;
  popular: boolean;
  cta: string;
}

  // Icon Selector Component
  interface IconSelectorProps {
    value: string;
    onChange: (iconName: string) => void;
    placeholder?: string;
    type?: 'svg' | 'emoji';
  }

    const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange, placeholder = "Select an icon", type = 'svg' }) => {
    const [icons, setIcons] = useState<Record<string, string>>({});
    const [isOpen, setIsOpen] = useState(false);

    // Emoji icons for tools and features
    const emojiIcons = {
      '🐍': 'Python',
      '📊': 'Data Analysis',
      '🧠': 'AI/ML',
      '🔥': 'PyTorch',
      '⚡': 'Fast',
      '🚀': 'Rocket',
      '💻': 'Computer',
      '📈': 'Chart',
      '📋': 'Excel',
      '🗃️': 'Database',
      '📓': 'Jupyter',
      '🔀': 'Git',
      '☁️': 'Cloud',
      '🐳': 'Docker',
      '⚓': 'Kubernetes',
      '🔄': 'MLflow',
      '🤖': 'OpenAI',
      '🤗': 'Hugging Face',
      '🔗': 'LangChain',
      '🎥': 'Video',
      '📹': 'Recording',
      '👨‍🏫': 'Mentor',
      '🏆': 'Certificate',
      '🌐': 'Community',
      '📚': 'Lessons',
      '👨‍🔬': 'Research',
      '🔬': 'Research Project',
      '👔': 'Executive',
      '📰': 'Publication',
      '✅': 'Check',
      '👩‍🏫': 'Instructor',
      '🛠️': 'Tools',
      '🌍': 'Global',
      '🎯': 'Target',
      '💬': 'Chat',
      '📱': 'Mobile',
      '🛡️': 'Security',
      '🔒': 'Lock',
      '🎓': 'Education',
      '📖': 'Book',
      '⚙️': 'Settings',
      '🎨': 'Design',
      '💡': 'Idea',
      '🎉': 'Celebration',
      '⭐': 'Star',
      '💎': 'Premium',
      '🎪': 'Show',
      '🏅': 'Achievement',
      '🎖️': 'Medal',
      '💪': 'Strength',
      '💯': 'Perfect',
      '🌟': 'Star',
      '✨': 'Sparkle',
      '💫': 'Dizzy',
      '🌙': 'Moon',
      '☀️': 'Sun',
      '🌈': 'Rainbow',
      '🎭': 'Theater',
      '🎲': 'Dice',
      '🎮': 'Game',
      '🎸': 'Guitar',
      '🎹': 'Piano',
      '🎺': 'Trumpet',
      '🎻': 'Violin',
      '🎼': 'Music',
      '🎵': 'Note',
      '🎶': 'Notes',
      '🎷': 'Saxophone'
    };
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIcon, setNewIcon] = useState({ name: '', path: '' });

  useEffect(() => {
    fetchIcons();
  }, []);

  const fetchIcons = async () => {
    try {
      setLoading(true);
      const response = await iconsApi.getCourseIcons();
      setIcons(response);
    } catch (error) {
      console.error('Error fetching icons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIcon = async () => {
    if (!newIcon.name.trim() || !newIcon.path.trim()) {
      toast.error('Please provide both icon name and SVG path');
      return;
    }

    try {
      const iconData = {
        iconName: newIcon.name.trim().toLowerCase().replace(/\s+/g, '-'),
        iconPath: newIcon.path.trim()
      };

      await iconsApi.create(iconData);
      await fetchIcons(); // Refresh the list
      onChange(iconData.iconName); // Select the newly created icon
      setNewIcon({ name: '', path: '' });
      setShowAddForm(false);
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to create icon. Please try again.');
    }
  };

  const selectedIcon = value && icons[value];

  return (
    <div className="relative">
      <button
        type="button"
        className="form-input flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {value ? (
            <>
              {type === 'emoji' ? (
                <span className="text-xl">{value}</span>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={selectedIcon} />
                </svg>
              )}
              <span>{type === 'emoji' ? (emojiIcons as Record<string, string>)[value] || value : value}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading icons...</div>
          ) : (
            <>
              {type === 'emoji' ? (
                <div className="grid grid-cols-6 gap-2 p-3">
                  {Object.entries(emojiIcons).map(([emoji, name]) => (
                    <button
                      key={emoji}
                      type="button"
                      className="flex flex-col items-center p-2 rounded hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        onChange(emoji);
                        setIsOpen(false);
                      }}
                    >
                      <span className="text-2xl mb-1">{emoji}</span>
                      <span className="text-xs text-gray-600 text-center">{name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                Object.entries(icons).map(([iconName, iconPath]) => (
                  <button
                    key={iconName}
                    type="button"
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left border-b border-gray-100"
                    onClick={() => {
                      onChange(iconName);
                      setIsOpen(false);
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={iconPath} />
                    </svg>
                    <span>{iconName}</span>
                  </button>
                ))
              )}
              
              <div className="border-t border-gray-200">
                {!showAddForm ? (
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 p-3 text-blue-600 hover:bg-blue-50"
                    onClick={() => setShowAddForm(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Add New Icon
                  </button>
                ) : (
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Add New Icon</h4>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Icon name (e.g., graduation-cap)"
                      className="form-input w-full text-sm"
                      value={newIcon.name}
                      onChange={(e) => setNewIcon(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <textarea
                      placeholder="SVG path (e.g., M12 14l9-5-9-5-9 5 9 5z...)"
                      className="form-input w-full text-sm"
                      rows={3}
                      value={newIcon.path}
                      onChange={(e) => setNewIcon(prev => ({ ...prev, path: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddIcon}
                        className="btn btn-primary btn-sm flex-1"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Add Icon
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const UnifiedCourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<UnifiedCourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UnifiedCourseData>>({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'features' | 'curriculum' | 'testimonials' | 'pricing'>('basic');
  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Testimonial avatar upload state - only previews and upload status (files are uploaded immediately)
  const [testimonialAvatarPreviews, setTestimonialAvatarPreviews] = useState<{ [index: number]: string }>({});
  const [uploadingAvatars, setUploadingAvatars] = useState<{ [index: number]: boolean }>({});
  const testimonialFileInputRefs = React.useRef<{ [index: number]: HTMLInputElement | null }>({});
  
  // Checkbox states for "Same as..." functionality
  const [sameAsStates, setSameAsStates] = useState({
    pricingName: false,
    pricingCategory: false,
    pricingDuration: false,
    pricingExtra: false,
    pricingDescription: false,
    pricingBadge: false,
    detailsPricingCurrent: false,
    detailsPricingOriginal: false,
    detailsPricingDiscount: false
  });

  useEffect(() => {
    fetchAllCourseData();
  }, []);

  const fetchAllCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch from all three collections
      const [coursesResponse, detailsResponse, pricingResponse] = await Promise.all([
        coursesApi.getAll(),
        courseDetailsApi.getAll(),
        coursePricingApi.getAll()
      ]);

      // Merge data based on course ID
      const coursesData = coursesResponse.success ? (coursesResponse.data as Course[]) : [];
      const detailsData = detailsResponse.success ? (detailsResponse.data as CourseDetails[]) : [];
      const pricingData = pricingResponse.success ? (pricingResponse.data as CoursePricing[]) : [];

      const mergedData: UnifiedCourseData[] = coursesData.map(course => {
        const details = detailsData.find(d => d.courseId === course.id);
        const pricing = pricingData.find(p => p.id === course.id);

        return {
          // Basic course data
          ...course,

          // Details data - keeping empty if not provided (required fields should be enforced)
          overview: details?.overview || '',
          features: details?.features || [],
          curriculum: details?.curriculum || [],
          tools: details?.tools || [],
          prerequisites: details?.prerequisites || '',
          testimonials: details?.testimonials || [],
          successStats: details?.successStats || [],
          detailsPricing: details?.pricing || {
            current: 0,
            original: 0,
            discount: '',
            deadline: '',
            features: []
          },
          courseInfo: details?.courseInfo || {
            startDate: '',
            format: '',
            support: '',
            studentsEnrolled: ''
          },
          trustIndicators: details?.trustIndicators || {
            rating: '',
            reviewCount: '',
            testimonialPreview: { text: '', author: '' }
          },


          // Pricing data - keeping empty if not provided (required fields should be enforced)
          pricingName: pricing?.name || '',
          originalPrice: pricing?.originalPrice || 0,
          currentPrice: pricing?.currentPrice || 0,
          installmentPrice: pricing?.installmentPrice || 0,
          installmentMonths: pricing?.installmentMonths || 0,
          discount: pricing?.discount || '',
          pricingDuration: pricing?.duration || '',
          pricingExtra: pricing?.extra || '',
          pricingDescription: pricing?.description || '',
          pricingFeatures: pricing?.features || [],
          highlighted: pricing?.highlighted || false,
          pricingAccent: pricing?.accent || 'edtech-green',
          pricingBadge: pricing?.badge || '',
          popular: pricing?.popular || false,
          cta: pricing?.cta || ''
        };
      });

      setCourses(mergedData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch course data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingId('new');
    setFormData({
      // Basic required fields - no defaults
      id: '',
      category: '',
      badge: '',
      title: '',
      desc: '',
      duration: '',
      extra: '',
      accent: 'edtech-green', // Default to first enum option
      featured: false,
      
      // Course Details - required fields empty
      overview: '',
      features: [],
                curriculum: [],
          tools: [],
          prerequisites: '',
          testimonials: [],
          successStats: [],
      detailsPricing: {
        current: 0,
        original: 0,
        discount: '',
        deadline: '',
        features: []
      },
      courseInfo: {
        startDate: '',
        format: '',
        support: '',
        studentsEnrolled: ''
      },
      trustIndicators: {
        rating: '',
        reviewCount: '',
        testimonialPreview: { text: '', author: '' }
      },
      
      
      // Pricing - required fields empty
      pricingName: '',
      originalPrice: 0,
      currentPrice: 0,
      installmentPrice: 0,
      installmentMonths: 0,
      discount: '',
      pricingDuration: '',
      pricingExtra: '',
      pricingDescription: '',
      pricingFeatures: [],
      highlighted: false,
      pricingAccent: 'edtech-green', // Default to first enum option
      pricingBadge: '',
      popular: false,
      cta: ''
    });
    setImageFile(null);
    setImagePreview('');
    setTestimonialAvatarPreviews({});
    setUploadingAvatars({});
    setActiveTab('basic');
    // Reset same as states
    setSameAsStates({
      pricingName: false,
      pricingCategory: false,
      pricingDuration: false,
      pricingExtra: false,
      pricingDescription: false,
      pricingBadge: false,
      detailsPricingCurrent: false,
      detailsPricingOriginal: false,
      detailsPricingDiscount: false
    });
  };

  const handleEdit = (course: UnifiedCourseData) => {
    setEditingId(course._id || '');
    setFormData(course);
    // Set image preview if image exists
    if (course.image) {
      if (course.image.startsWith('http')) {
        setImagePreview(course.image);
      } else {
        setImagePreview(`${import.meta.env.VITE_API_BASE_URL}/uploads/course-images/${course.image}`);
      }
    } else {
      setImagePreview('');
    }
    setImageFile(null);
    
    // Set testimonial avatar previews
    const avatarPreviews: { [index: number]: string } = {};
    if (course.testimonials && course.testimonials.length > 0) {
      course.testimonials.forEach((testimonial, index) => {
        if (testimonial.avatar) {
          if (testimonial.avatar.startsWith('http')) {
            avatarPreviews[index] = testimonial.avatar;
          } else {
            avatarPreviews[index] = `${import.meta.env.VITE_API_BASE_URL}/uploads/testimonial-images/${testimonial.avatar}`;
          }
        }
      });
    }
    setTestimonialAvatarPreviews(avatarPreviews);
    
    setActiveTab('basic');
    // Reset same as states
    setSameAsStates({
      pricingName: false,
      pricingCategory: false,
      pricingDuration: false,
      pricingExtra: false,
      pricingDescription: false,
      pricingBadge: false,
      detailsPricingCurrent: false,
      detailsPricingOriginal: false,
      detailsPricingDiscount: false
    });
  };

  // Handle image file selection
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

  // Handle testimonial avatar file selection and IMMEDIATE upload
  const handleTestimonialAvatarChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setTestimonialAvatarPreviews(prev => ({ ...prev, [index]: reader.result as string }));
      };
      reader.readAsDataURL(file);
      
      // Upload immediately
      setUploadingAvatars(prev => ({ ...prev, [index]: true }));
      const uploadResult = await uploadTestimonialAvatar(file);
      
      if (uploadResult.success && uploadResult.filename) {
        // Update the testimonial's avatar field with the uploaded filename
        const updatedTestimonials = [...(formData.testimonials || [])];
        updatedTestimonials[index] = {
          ...updatedTestimonials[index],
          avatar: uploadResult.filename
        };
        setFormData({ ...formData, testimonials: updatedTestimonials });
        toast.success(`Avatar uploaded successfully!`);
      } else {
        toast.error(`Failed to upload avatar: ${uploadResult.message}`);
        // Clear the preview on error
        setTestimonialAvatarPreviews(prev => {
          const newPreviews = { ...prev };
          delete newPreviews[index];
          return newPreviews;
        });
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatars(prev => ({ ...prev, [index]: false }));
    }
  };

  // Remove testimonial avatar
  const handleRemoveTestimonialAvatar = (index: number) => {
    // Clear preview
    setTestimonialAvatarPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });
    
    // Clear the avatar field in formData
    const updatedTestimonials = [...(formData.testimonials || [])];
    updatedTestimonials[index] = {
      ...updatedTestimonials[index],
      avatar: ''
    };
    setFormData({ ...formData, testimonials: updatedTestimonials });
    
    // Reset file input
    if (testimonialFileInputRefs.current[index]) {
      testimonialFileInputRefs.current[index]!.value = '';
    }
  };

  const handleSave = async () => {

    // Validate required fields from Course schema
    if (!formData.id || !formData.category || !formData.badge || !formData.title || 
        !formData.desc || !formData.duration || !formData.extra || !formData.accent) {
      toast.error('Required fields: Course ID, Category, Badge, Title, Description, Duration, Extra Info, and Accent Color');
      return;
    }

    // Validate required fields from CourseDetails schema
    if (!formData.overview || !formData.prerequisites) {
      toast.error('Required course details: Overview and Prerequisites');
      return;
    }

    // Validate curriculum modules and topics
    if (!Array.isArray(formData.curriculum) || formData.curriculum.length === 0) {
      toast.error('At least one curriculum module is required.');
      return;
    }
    for (let i = 0; i < formData.curriculum.length; i++) {
      const module = formData.curriculum[i];
      if (!module.module || !module.duration) {
        toast.error(`Curriculum module #${i + 1} is missing required fields (module name and duration).`);
        return;
      }
      if (!Array.isArray(module.topics) || module.topics.length === 0) {
        toast.error(`Curriculum module #${i + 1} must have at least one topic.`);
        return;
      }
      for (let j = 0; j < module.topics.length; j++) {
        const topic = module.topics[j];
        if (!topic.topic) {
          toast.error(`Topic #${j + 1} in module #${i + 1} is missing a topic name.`);
          return;
        }
        if (!Array.isArray(topic.subtopics) || topic.subtopics.length === 0 || topic.subtopics.some(st => !st || st.trim() === '')) {
          toast.error(`Topic #${j + 1} in module #${i + 1} must have at least one non-empty subtopic.`);
          return;
        }
      }
    }

    // Validate required fields from CoursePricing schema
    if (!formData.pricingName || !formData.pricingDescription || !formData.pricingBadge || !formData.cta ||
        !formData.pricingDuration || !formData.pricingExtra || !formData.discount) {
      toast.error('Required pricing fields: Plan Name, Description, Badge, CTA, Duration, Extra Info, and Discount');
      return;
    }

    // Trim whitespace from required string fields
    const trimmedId = formData.id.trim();
    const trimmedTitle = formData.title.trim();
    const trimmedDesc = formData.desc.trim();
    const trimmedCategory = formData.category.trim();

    if (!trimmedTitle || !trimmedDesc || !trimmedCategory || !trimmedId) {
      toast.error('Course ID, title, description, and category cannot be empty');
      return;
    }

    try {
      setSaving(true);
      
      // Prepare data for each collection
      // --- COURSE IMAGE UPLOAD LOGIC ---
      let courseData: Partial<Course> | FormData = {
        id: trimmedId,
        category: trimmedCategory,
        badge: formData.badge!,
        title: trimmedTitle,
        desc: trimmedDesc,
        duration: formData.duration!,
        extra: formData.extra!,
        accent: formData.accent as 'edtech-green' | 'edtech-orange' | 'edtech-red',
        iconName: formData.iconName,
        featured: formData.featured || false
      };
      // If imageFile is present, upload it. If image is explicitly set to '', send that as well.
      if (imageFile) {
        // Use FormData for file upload
        const formDataObj = new FormData();
        Object.entries(courseData).forEach(([key, value]) => {
          if (value !== undefined && value !== null && key !== 'image') {
            formDataObj.append(key, value as string);
          }
        });
        formDataObj.append('image', imageFile);
        courseData = formDataObj;
      } else if (formData.image === '') {
        // If image was removed, send image: '' to backend
        (courseData as Partial<Course>).image = '';
      }

      const courseDetailsData: Partial<CourseDetails> = {
        courseId: trimmedId,
        overview: formData.overview!,
        features: formData.features || [],
        curriculum: formData.curriculum || [],
        tools: formData.tools || [],
        prerequisites: formData.prerequisites!,
        testimonials: formData.testimonials || [],
        successStats: formData.successStats || [],
        pricing: {
          current: formData.detailsPricing?.current || 0,
          original: formData.detailsPricing?.original || 0,
          discount: formData.detailsPricing?.discount || '0%',
          deadline: formData.detailsPricing?.deadline || 'TBD',
          features: formData.detailsPricing?.features || []
        },
        courseInfo: {
          startDate: formData.courseInfo?.startDate || 'TBD',
          format: formData.courseInfo?.format || 'Online',
          support: formData.courseInfo?.support || '24/7',
          studentsEnrolled: formData.courseInfo?.studentsEnrolled || '0'
        },
        trustIndicators: {
          rating: formData.trustIndicators?.rating || '4.8',
          reviewCount: formData.trustIndicators?.reviewCount || '0',
          testimonialPreview: {
            text: formData.trustIndicators?.testimonialPreview?.text || 'Great course!',
            author: formData.trustIndicators?.testimonialPreview?.author || 'Anonymous'
          }
        },
      };

      const coursePricingData: Partial<CoursePricing> = {
        id: trimmedId,
        name: formData.pricingName!,
        category: trimmedCategory,
        originalPrice: formData.originalPrice || 0,
        currentPrice: formData.currentPrice || 0,
        installmentPrice: formData.installmentPrice || 0,
        installmentMonths: formData.installmentMonths || 0,
        discount: formData.discount!,
        duration: formData.pricingDuration!,
        extra: formData.pricingExtra!,
        description: formData.pricingDescription!,
        features: formData.pricingFeatures || [],
        highlighted: formData.highlighted || false,
        accent: formData.pricingAccent as 'edtech-green' | 'edtech-orange' | 'edtech-red' | 'edtech-blue',
        badge: formData.pricingBadge!,
        cta: formData.cta!,
        popular: formData.popular || false
      };

      if (editingId === 'new') {
        // Create in all three collections
        const [courseResponse, detailsResponse, pricingResponse] = await Promise.all([
          coursesApi.create(courseData),
          courseDetailsApi.create(courseDetailsData),
          coursePricingApi.create(coursePricingData)
        ]);

        if (!courseResponse.success || !detailsResponse.success || !pricingResponse.success) {
          throw new Error('Failed to create course in one or more collections');
        }
      } else {
        // Update in all three collections
        const existingCourse = courses.find(c => c._id === editingId);
        if (!existingCourse) {
          throw new Error('Course not found');
        }

        // Update the main course record
        await coursesApi.update(editingId!, courseData);

        // For course details and pricing, we need to find existing records by courseId/id
        // and update them, or create new ones if they don't exist
        
        // Try to update course details by finding existing record
        try {
          // Get all course details to find the one with matching courseId
          const allDetailsResponse = await courseDetailsApi.getAll();
          if (allDetailsResponse.success) {
            const allDetails = allDetailsResponse.data as any[];
            const existingDetails = allDetails.find((d: any) => d.courseId === trimmedId);
            
            if (existingDetails) {
              // Update existing course details
              await courseDetailsApi.update(existingDetails._id, courseDetailsData);
            } else {
              // Create new course details if none exist
              await courseDetailsApi.create(courseDetailsData);
            }
          }
        } catch (detailsError) {
          console.error('Error updating course details:', detailsError);
          // Try to create new course details if update fails
          try {
            await courseDetailsApi.create(courseDetailsData);
          } catch (createError) {
            console.error('Error creating course details:', createError);
          }
        }

        // Try to update course pricing by finding existing record
        try {
          // Get all course pricing to find the one with matching id
          const allPricingResponse = await coursePricingApi.getAll();
          if (allPricingResponse.success) {
            const allPricing = allPricingResponse.data as any[];
            const existingPricing = allPricing.find((p: any) => p.id === trimmedId);
            
            if (existingPricing) {
              // Update existing course pricing
              await coursePricingApi.update(existingPricing._id, coursePricingData);
            } else {
              // Create new course pricing if none exist
              await coursePricingApi.create(coursePricingData);
            }
          }
        } catch (pricingError) {
          console.error('Error updating course pricing:', pricingError);
          // Try to create new course pricing if update fails
          try {
            await coursePricingApi.create(coursePricingData);
          } catch (createError) {
            console.error('Error creating course pricing:', createError);
          }
        }
      }

      await fetchAllCourseData();
      setEditingId(null);
      setFormData({});
      setError('');
      
      // Show success message
      toast.success('Course saved successfully across all collections!');
    } catch (error) {
      console.error('Error saving course:', error);
      if (error instanceof Error) {
        setError(`Failed to save course: ${error.message}`);
      } else {
        setError('Failed to save course. Please check the console for details.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course from all collections?')) {
      return;
    }

    try {
      const course = courses.find(c => c._id === id);
      if (!course) return;

      // Delete from main courses collection
      await coursesApi.delete(id);

      // Delete from course details by finding record with matching courseId
      try {
        const allDetailsResponse = await courseDetailsApi.getAll();
        if (allDetailsResponse.success) {
          const allDetails = allDetailsResponse.data as any[];
          const detailsToDelete = allDetails.find((d: any) => d.courseId === course.id);
          if (detailsToDelete) {
            await courseDetailsApi.delete(detailsToDelete._id);
          }
        }
      } catch (error) {
        console.error('Error deleting course details:', error);
      }

      // Delete from course pricing by finding record with matching id
      try {
        const allPricingResponse = await coursePricingApi.getAll();
        if (allPricingResponse.success) {
          const allPricing = allPricingResponse.data as any[];
          const pricingToDelete = allPricing.find((p: any) => p.id === course.id);
          if (pricingToDelete) {
            await coursePricingApi.delete(pricingToDelete._id);
          }
        }
      } catch (error) {
        console.error('Error deleting course pricing:', error);
      }

      // Update local state
      setCourses(prev => prev.filter(course => course._id !== id));
      
      // Show success message
      toast.success('Course deleted successfully from all collections!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete course');
    }
  };

  // Helper functions for "Same as..." functionality
  const handleSameAsToggle = (field: keyof typeof sameAsStates, sourceField: string, targetField: string) => {
    const newState = !sameAsStates[field];
    setSameAsStates(prev => ({ ...prev, [field]: newState }));
    
    if (newState) {
      // Copy value from source to target
      const sourceValue = getFieldValue(sourceField);
      setFieldValue(targetField, sourceValue);
    }
  };

  const getFieldValue = (fieldPath: string): any => {
    const keys = fieldPath.split('.');
    let value: any = formData;
    for (const key of keys) {
      value = value?.[key];
    }
    return value;
  };

  const setFieldValue = (fieldPath: string, value: any) => {
    const keys = fieldPath.split('.');
    const lastKey = keys.pop()!;
    
    if (keys.length === 0) {
      // Direct field
      setFormData(prev => ({ ...prev, [lastKey]: value }));
    } else {
      // Nested field
      setFormData(prev => {
        const newData = { ...prev };
        let current: any = newData;
        
        for (const key of keys) {
          if (!current[key]) current[key] = {};
          current = current[key];
        }
        current[lastKey] = value;
        
        return newData;
      });
    }
  };

  // Auto-sync when source field changes
  useEffect(() => {
    if (sameAsStates.pricingName && formData.title) {
      setFormData(prev => ({ ...prev, pricingName: formData.title }));
    }
    if (sameAsStates.pricingCategory && formData.category) {
      // This is already the same field, no need to sync
    }
    if (sameAsStates.pricingDuration && formData.duration) {
      setFormData(prev => ({ ...prev, pricingDuration: formData.duration }));
    }
    if (sameAsStates.pricingExtra && formData.extra) {
      setFormData(prev => ({ ...prev, pricingExtra: formData.extra }));
    }
    if (sameAsStates.pricingDescription && formData.desc) {
      setFormData(prev => ({ ...prev, pricingDescription: formData.desc }));
    }
    if (sameAsStates.pricingBadge && formData.badge) {
      setFormData(prev => ({ ...prev, pricingBadge: formData.badge }));
    }
    if (sameAsStates.detailsPricingCurrent && formData.currentPrice) {
      setFormData(prev => ({ 
        ...prev, 
        detailsPricing: { 
          ...prev.detailsPricing!, 
          current: formData.currentPrice || 0 
        } 
      }));
    }
    if (sameAsStates.detailsPricingOriginal && formData.originalPrice) {
      setFormData(prev => ({ 
        ...prev, 
        detailsPricing: { 
          ...prev.detailsPricing!, 
          original: formData.originalPrice || 0 
        } 
      }));
    }
    if (sameAsStates.detailsPricingDiscount && formData.discount) {
      setFormData(prev => ({ 
        ...prev, 
        detailsPricing: { 
          ...prev.detailsPricing!, 
          discount: formData.discount || '' 
        } 
      }));
    }
  }, [formData.title, formData.category, formData.duration, formData.extra, formData.desc, formData.badge, 
      formData.currentPrice, formData.originalPrice, formData.discount, sameAsStates]);

  // Helper functions for form management
  


  // Features
  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...(formData.features || []), { icon: '', title: '', description: '' }]
    });
  };

  const updateFeature = (index: number, field: 'icon' | 'title' | 'description', value: string) => {
    const features = [...(formData.features || [])];
    features[index] = { ...features[index], [field]: value };
    setFormData({ ...formData, features });
  };

  const removeFeature = (index: number) => {
    const features = [...(formData.features || [])];
    features.splice(index, 1);
    setFormData({ ...formData, features });
  };

  // Tools
  const addTool = () => {
    setFormData({
      ...formData,
      tools: [...(formData.tools || []), { name: '', icon: '' }]
    });
  };

  const updateTool = (index: number, field: 'name' | 'icon', value: string) => {
    const tools = [...(formData.tools || [])];
    tools[index] = { ...tools[index], [field]: value };
    setFormData({ ...formData, tools });
  };

  const removeTool = (index: number) => {
    const tools = [...(formData.tools || [])];
    tools.splice(index, 1);
    setFormData({ ...formData, tools });
  };

  // Curriculum
  const addCurriculumModule = () => {
    setFormData({
      ...formData,
      curriculum: [...(formData.curriculum || []), { module: '', duration: '', topics: [{ topic: '', subtopics: [''] }] }]
    });
  };

  const updateCurriculumModule = (index: number, field: 'module' | 'duration', value: string) => {
    const curriculum = [...(formData.curriculum || [])];
    curriculum[index] = { ...curriculum[index], [field]: value };
    setFormData({ ...formData, curriculum });
  };

  const addCurriculumTopic = (moduleIndex: number) => {
    const curriculum = [...(formData.curriculum || [])];
    curriculum[moduleIndex].topics.push({ topic: '', subtopics: [''] });
    setFormData({ ...formData, curriculum });
  };

  const updateCurriculumTopic = (moduleIndex: number, topicIndex: number, value: string) => {
    const curriculum = [...(formData.curriculum || [])];
    curriculum[moduleIndex].topics[topicIndex].topic = value;
    setFormData({ ...formData, curriculum });
  };

  const removeCurriculumTopic = (moduleIndex: number, topicIndex: number) => {
    const curriculum = [...(formData.curriculum || [])];
    curriculum[moduleIndex].topics.splice(topicIndex, 1);
    setFormData({ ...formData, curriculum });
  };

  const addCurriculumSubtopic = (moduleIndex: number, topicIndex: number) => {
    const curriculum = [...(formData.curriculum || [])];
    curriculum[moduleIndex].topics[topicIndex].subtopics.push('');
    setFormData({ ...formData, curriculum });
  };

  const updateCurriculumSubtopic = (moduleIndex: number, topicIndex: number, subtopicIndex: number, value: string) => {
    const curriculum = [...(formData.curriculum || [])];
    curriculum[moduleIndex].topics[topicIndex].subtopics[subtopicIndex] = value;
    setFormData({ ...formData, curriculum });
  };

  const removeCurriculumSubtopic = (moduleIndex: number, topicIndex: number, subtopicIndex: number) => {
    const curriculum = [...(formData.curriculum || [])];
    curriculum[moduleIndex].topics[topicIndex].subtopics.splice(subtopicIndex, 1);
    setFormData({ ...formData, curriculum });
  };

  const removeCurriculumModule = (index: number) => {
    const curriculum = [...(formData.curriculum || [])];
    curriculum.splice(index, 1);
    setFormData({ ...formData, curriculum });
  };

  // Testimonials
  const addTestimonial = () => {
    setFormData({
      ...formData,
      testimonials: [...(formData.testimonials || []), { 
        name: '', 
        role: '', 
        avatar: '', 
        rating: 5, 
        content: '', 
        color: 'edtech-green' 
      }]
    });
  };

  const updateTestimonial = (index: number, field: keyof UnifiedCourseData['testimonials'][0], value: string | number) => {
    const testimonials = [...(formData.testimonials || [])];
    testimonials[index] = { ...testimonials[index], [field]: value };
    setFormData({ ...formData, testimonials });
  };

  const removeTestimonial = (index: number) => {
    const testimonials = [...(formData.testimonials || [])];
    testimonials.splice(index, 1);
    setFormData({ ...formData, testimonials });
  };

  // Success Stats
  const addSuccessStat = () => {
    setFormData({
      ...formData,
      successStats: [...(formData.successStats || []), { label: '', value: '', color: 'edtech-green' }]
    });
  };

  const updateSuccessStat = (index: number, field: 'label' | 'value' | 'color', value: string) => {
    const successStats = [...(formData.successStats || [])];
    successStats[index] = { ...successStats[index], [field]: value };
    setFormData({ ...formData, successStats });
  };

  const removeSuccessStat = (index: number) => {
    const successStats = [...(formData.successStats || [])];
    successStats.splice(index, 1);
    setFormData({ ...formData, successStats });
  };



  // Pricing Features
  const addPricingFeature = () => {
    setFormData({
      ...formData,
      pricingFeatures: [...(formData.pricingFeatures || []), '']
    });
  };

  const updatePricingFeature = (index: number, value: string) => {
    const features = [...(formData.pricingFeatures || [])];
    features[index] = value;
    setFormData({ ...formData, pricingFeatures: features });
  };

  const removePricingFeature = (index: number) => {
    const features = [...(formData.pricingFeatures || [])];
    features.splice(index, 1);
    setFormData({ ...formData, pricingFeatures: features });
  };

  // Details Pricing Features (CourseDetails.pricing.features)
  const addDetailsPricingFeature = () => {
    const currentFeatures = formData.detailsPricing?.features || [];
    setFormData({
      ...formData,
      detailsPricing: {
        ...formData.detailsPricing!,
        features: [...currentFeatures, { text: '', icon: '' }]
      }
    });
  };

  const updateDetailsPricingFeature = (index: number, field: 'text' | 'icon', value: string) => {
    const features = [...(formData.detailsPricing?.features || [])];
    features[index] = { ...features[index], [field]: value };
    setFormData({ 
      ...formData, 
      detailsPricing: { 
        ...formData.detailsPricing!, 
        features 
      } 
    });
  };

  const removeDetailsPricingFeature = (index: number) => {
    const features = [...(formData.detailsPricing?.features || [])];
    features.splice(index, 1);
    setFormData({ 
      ...formData, 
      detailsPricing: { 
        ...formData.detailsPricing!, 
        features 
      } 
    });
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage courses, details, and pricing displayed on the Courses page
          </p>
        </div>
        <button onClick={handleCreate} className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Course
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
              placeholder="Search courses..."
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
            onClick={fetchAllCourseData}
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
                  {editingId === 'new' ? 'Create New Course' : 'Edit Course'}
                </h3>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex border-b mt-4 overflow-x-auto">
                <button
                  className={`px-4 py-2 font-medium text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'basic' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('basic')}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Basic Info
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'details' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('details')}
                >
                  <Info className="w-4 h-4 inline mr-2" />
                  Details
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'features' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('features')}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  Features & Tools
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'curriculum' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('curriculum')}
                >
                  <GraduationCap className="w-4 h-4 inline mr-2" />
                  Curriculum
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'testimonials' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('testimonials')}
                >
                  <Star className="w-4 h-4 inline mr-2" />
                  Testimonials
                </button>

                <button
                  className={`px-4 py-2 font-medium text-sm border-b-2 whitespace-nowrap ${
                    activeTab === 'pricing' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('pricing')}
                >
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Pricing
                </button>
              </div>
            </div>

            <div className="card-body space-y-4">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  {/* Course Image Upload */}
                  <div className="form-group">
                    <label className="form-label">Course Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="space-y-6">
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Course image preview"
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
                            <Upload className="w-16 h-16 mb-2 text-gray-400" />
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
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 text-sm">
                      <span className="font-medium">Required fields:</span> All fields marked with * are required for Course schema
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Course ID *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.id || ''}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        placeholder="web-development-pro"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Course Title *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Full Stack Web Development"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Web Development"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Badge *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.badge || ''}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        placeholder="Most Popular"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={formData.desc || ''}
                      onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                      placeholder="Course description..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-group">
                      <label className="form-label">Duration *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.duration || ''}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="12 weeks"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Extra Info *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.extra || ''}
                        onChange={(e) => setFormData({ ...formData, extra: e.target.value })}
                        placeholder="Live sessions"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Accent Color * (Course Schema)</label>
                      <select
                        className="form-input"
                        value={formData.accent || 'edtech-green'}
                        onChange={(e) => setFormData({ ...formData, accent: e.target.value as any })}
                        required
                      >
                        <option value="edtech-green">Green</option>
                        <option value="edtech-orange">Orange</option>
                        <option value="edtech-red">Red</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Note: Course schema only allows green, orange, red</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Course Icon (Optional)</label>
                      <IconSelector
                        value={formData.iconName || ''}
                        onChange={(iconName) => setFormData({ ...formData, iconName })}
                        placeholder="Select a course icon"
                      />
                      <p className="text-xs text-gray-500 mt-1">Choose from existing icons or add a new one</p>
                    </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.featured || false}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                      <span className="text-sm">Featured Course</span>
                    </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Course Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 text-sm">
                      <span className="font-medium">Course Details Schema:</span> Required fields for CourseDetails collection
                    </p>
                  </div>

                  {/* Basic Details */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Basic Course Details</h3>
                    
                  <div className="form-group">
                      <label className="form-label">Course Overview *</label>
                    <textarea
                      className="form-input"
                      rows={4}
                      value={formData.overview || ''}
                      onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                      placeholder="Detailed course overview..."
                        required
                    />
                  </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                        <label className="form-label">Prerequisites *</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={formData.prerequisites || ''}
                      onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                      placeholder="Course prerequisites..."
                          required
                    />
                  </div>

                    </div>
                  </div>





                  {/* Course Information */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Course Information *</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label">Start Date *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.courseInfo?.startDate || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            courseInfo: { 
                              startDate: e.target.value,
                              format: formData.courseInfo?.format || '',
                              support: formData.courseInfo?.support || '',
                              studentsEnrolled: formData.courseInfo?.studentsEnrolled || ''
                            } 
                          })}
                          placeholder="e.g., Next Monday"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Format *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.courseInfo?.format || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            courseInfo: { 
                              startDate: formData.courseInfo?.startDate || '',
                              format: e.target.value,
                              support: formData.courseInfo?.support || '',
                              studentsEnrolled: formData.courseInfo?.studentsEnrolled || ''
                            } 
                          })}
                          placeholder="e.g., Online Live Sessions"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Support *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.courseInfo?.support || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            courseInfo: { 
                              startDate: formData.courseInfo?.startDate || '',
                              format: formData.courseInfo?.format || '',
                              support: e.target.value,
                              studentsEnrolled: formData.courseInfo?.studentsEnrolled || ''
                            } 
                          })}
                          placeholder="e.g., 24/7 Support"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Students Enrolled *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.courseInfo?.studentsEnrolled || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            courseInfo: { 
                              startDate: formData.courseInfo?.startDate || '',
                              format: formData.courseInfo?.format || '',
                              support: formData.courseInfo?.support || '',
                              studentsEnrolled: e.target.value
                            } 
                          })}
                          placeholder="e.g., 1,000+"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Trust Indicators *</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label">Rating *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.trustIndicators?.rating || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            trustIndicators: { 
                              rating: e.target.value,
                              reviewCount: formData.trustIndicators?.reviewCount || '',
                              testimonialPreview: {
                                text: formData.trustIndicators?.testimonialPreview?.text || '',
                                author: formData.trustIndicators?.testimonialPreview?.author || ''
                              }
                            } 
                          })}
                          placeholder="e.g., 4.9/5"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Review Count *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.trustIndicators?.reviewCount || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            trustIndicators: { 
                              rating: formData.trustIndicators?.rating || '',
                              reviewCount: e.target.value,
                              testimonialPreview: {
                                text: formData.trustIndicators?.testimonialPreview?.text || '',
                                author: formData.trustIndicators?.testimonialPreview?.author || ''
                              }
                            } 
                          })}
                          placeholder="e.g., 500+ reviews"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Testimonial Preview Text *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.trustIndicators?.testimonialPreview?.text || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            trustIndicators: { 
                              rating: formData.trustIndicators?.rating || '',
                              reviewCount: formData.trustIndicators?.reviewCount || '',
                              testimonialPreview: {
                                text: e.target.value,
                                author: formData.trustIndicators?.testimonialPreview?.author || ''
                              }
                            } 
                          })}
                          placeholder="e.g., This course changed my career!"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Testimonial Author *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.trustIndicators?.testimonialPreview?.author || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            trustIndicators: { 
                              rating: formData.trustIndicators?.rating || '',
                              reviewCount: formData.trustIndicators?.reviewCount || '',
                              testimonialPreview: {
                                text: formData.trustIndicators?.testimonialPreview?.text || '',
                                author: e.target.value
                              }
                            } 
                          })}
                          placeholder="e.g., John Smith, Software Engineer"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* CourseDetails Pricing (Embedded) */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Embedded Pricing Info (CourseDetails.pricing) *</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4">
                      <p className="text-amber-800 text-sm">
                        💡 <strong>Tip:</strong> You can sync these prices with the main pricing tab to avoid duplication
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <div className="flex items-center justify-between mb-2">
                          <label className="form-label">Current Price *</label>
                          <label className="flex items-center gap-2 text-xs text-gray-600">
                            <input
                              type="checkbox"
                              checked={sameAsStates.detailsPricingCurrent}
                              onChange={() => handleSameAsToggle('detailsPricingCurrent', 'currentPrice', 'detailsPricing.current')}
                            />
                            Same as Pricing Tab
                          </label>
                        </div>
                        <input
                          type="number"
                          className={`form-input ${sameAsStates.detailsPricingCurrent ? 'bg-gray-100' : ''}`}
                          value={formData.detailsPricing?.current || ''}
                          onChange={(e) => !sameAsStates.detailsPricingCurrent && setFormData({ 
                            ...formData, 
                            detailsPricing: { 
                              ...formData.detailsPricing!, 
                              current: Number(e.target.value) 
                            } 
                          })}
                          placeholder="Enter price"
                          disabled={sameAsStates.detailsPricingCurrent}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <div className="flex items-center justify-between mb-2">
                          <label className="form-label">Original Price *</label>
                          <label className="flex items-center gap-2 text-xs text-gray-600">
                            <input
                              type="checkbox"
                              checked={sameAsStates.detailsPricingOriginal}
                              onChange={() => handleSameAsToggle('detailsPricingOriginal', 'originalPrice', 'detailsPricing.original')}
                            />
                            Same as Pricing Tab
                          </label>
                        </div>
                        <input
                          type="number"
                          className={`form-input ${sameAsStates.detailsPricingOriginal ? 'bg-gray-100' : ''}`}
                          value={formData.detailsPricing?.original || ''}
                          onChange={(e) => !sameAsStates.detailsPricingOriginal && setFormData({ 
                            ...formData, 
                            detailsPricing: { 
                              ...formData.detailsPricing!, 
                              original: Number(e.target.value) 
                            } 
                          })}
                          placeholder="3999"
                          disabled={sameAsStates.detailsPricingOriginal}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <div className="flex items-center justify-between mb-2">
                          <label className="form-label">Discount *</label>
                          <label className="flex items-center gap-2 text-xs text-gray-600">
                            <input
                              type="checkbox"
                              checked={sameAsStates.detailsPricingDiscount}
                              onChange={() => handleSameAsToggle('detailsPricingDiscount', 'discount', 'detailsPricing.discount')}
                            />
                            Same as Pricing Tab
                          </label>
                        </div>
                        <input
                          type="text"
                          className={`form-input ${sameAsStates.detailsPricingDiscount ? 'bg-gray-100' : ''}`}
                          value={formData.detailsPricing?.discount || ''}
                          onChange={(e) => !sameAsStates.detailsPricingDiscount && setFormData({ 
                            ...formData, 
                            detailsPricing: { 
                              ...formData.detailsPricing!, 
                              discount: e.target.value 
                            } 
                          })}
                          placeholder="50%"
                          disabled={sameAsStates.detailsPricingDiscount}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Deadline *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.detailsPricing?.deadline || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            detailsPricing: { 
                              ...formData.detailsPricing!, 
                              deadline: e.target.value 
                            } 
                          })}
                          placeholder="2024-12-31"
                          required
                        />
                      </div>
                    </div>

                    {/* Details Pricing Features */}
                    <div className="form-group mt-4">
                      <label className="form-label">Pricing Features</label>
                      <div className="space-y-2">
                        {(formData.detailsPricing?.features || []).map((feature, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                              type="text"
                              className="form-input"
                              value={feature.text}
                              onChange={(e) => updateDetailsPricingFeature(index, 'text', e.target.value)}
                              placeholder="Feature text"
                            />
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <IconSelector
                                  value={feature.icon}
                                  onChange={(iconName) => updateDetailsPricingFeature(index, 'icon', iconName)}
                                  placeholder="Select pricing feature icon"
                                  type="emoji"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeDetailsPricingFeature(index)}
                                className="btn btn-danger btn-sm"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addDetailsPricingFeature}
                          className="btn btn-secondary btn-sm"
                        >
                          <Plus className="w-3 h-3" />
                          Add Pricing Feature
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Features & Tools Tab */}
              {activeTab === 'features' && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800 text-sm">
                      <span className="font-medium">Features & Tools:</span> Course features and tools arrays from CourseDetails schema
                    </p>
                  </div>

                  {/* Course Features */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Course Features</h3>
                <div className="space-y-4">
                      {(formData.features || []).map((feature, index) => (
                        <div key={index} className="border border-gray-100 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                              <label className="form-label">Icon *</label>
                              <IconSelector
                                value={feature.icon}
                                onChange={(iconName) => updateFeature(index, 'icon', iconName)}
                                placeholder="Select feature icon"
                                type="emoji"
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className="form-input"
                                value={feature.title}
                                onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                placeholder="Feature title"
                                required
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Description *</label>
                            <textarea
                              className="form-input"
                              rows={2}
                              value={feature.description}
                              onChange={(e) => updateFeature(index, 'description', e.target.value)}
                              placeholder="Feature description"
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="btn btn-danger btn-sm"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Remove Feature
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFeature}
                        className="btn btn-secondary"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Feature
                      </button>
                    </div>
                  </div>

                  {/* Tools */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Tools & Technologies</h3>
                    <div className="space-y-2">
                      {(formData.tools || []).map((tool, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input
                            type="text"
                            className="form-input"
                            value={tool.name}
                            onChange={(e) => updateTool(index, 'name', e.target.value)}
                            placeholder="Tool name (e.g., React, Node.js)"
                          />
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <IconSelector
                                value={tool.icon}
                                onChange={(iconName) => updateTool(index, 'icon', iconName)}
                                placeholder="Select tool icon"
                                type="emoji"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeTool(index)}
                              className="btn btn-danger btn-sm"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addTool}
                        className="btn btn-secondary btn-sm"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Tool
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Curriculum Tab */}
              {activeTab === 'curriculum' && (
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                    <p className="text-purple-800 text-sm">
                      <span className="font-medium">Curriculum:</span> Course modules and topics structure
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Course Curriculum</h3>
                    <div className="space-y-6">
                      {(formData.curriculum || []).map((module, moduleIndex) => (
                        <div key={moduleIndex} className="border border-gray-100 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="form-group">
                              <label className="form-label">Module Name *</label>
                              <input
                                type="text"
                                className="form-input"
                                value={module.module}
                                onChange={(e) => updateCurriculumModule(moduleIndex, 'module', e.target.value)}
                                placeholder="Module 1: Introduction to Web Development"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Duration *</label>
                              <input
                                type="text"
                                className="form-input"
                                value={module.duration}
                                onChange={(e) => updateCurriculumModule(moduleIndex, 'duration', e.target.value)}
                                placeholder="2 weeks"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="form-group">
                            <label className="form-label">Topics & Subtopics *</label>
                            <div className="space-y-4">
                              {module.topics.map((topicObj, topicIndex) => (
                                <div key={topicIndex} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                                  <div className="flex items-center gap-2 mb-3">
                                    <input
                                      type="text"
                                      className="form-input flex-1 font-medium"
                                      value={topicObj.topic}
                                      onChange={(e) => updateCurriculumTopic(moduleIndex, topicIndex, e.target.value)}
                                      placeholder="Topic name (e.g., Week 1: Prompt Engineering Foundations)"
                                      required
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeCurriculumTopic(moduleIndex, topicIndex)}
                                      className="btn btn-danger btn-sm"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                  
                                  <div className="ml-4">
                                    <label className="form-label text-sm">Subtopics</label>
                                    <div className="space-y-2">
                                      {topicObj.subtopics.map((subtopic, subtopicIndex) => (
                                        <div key={subtopicIndex} className="flex items-center gap-2">
                                          <input
                                            type="text"
                                            className="form-input flex-1 text-sm"
                                            value={subtopic}
                                            onChange={(e) => updateCurriculumSubtopic(moduleIndex, topicIndex, subtopicIndex, e.target.value)}
                                            placeholder="Subtopic (e.g., Basic prompt structures and techniques)"
                                            required
                                          />
                                          <button
                                            type="button"
                                            onClick={() => removeCurriculumSubtopic(moduleIndex, topicIndex, subtopicIndex)}
                                            className="btn btn-danger btn-sm"
                                          >
                                            <X className="w-2 h-2" />
                                          </button>
                                        </div>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={() => addCurriculumSubtopic(moduleIndex, topicIndex)}
                                        className="btn btn-secondary btn-sm text-xs"
                                      >
                                        <Plus className="w-2 h-2 mr-1" />
                                        Add Subtopic
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => addCurriculumTopic(moduleIndex)}
                                className="btn btn-secondary btn-sm"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Topic
                              </button>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => removeCurriculumModule(moduleIndex)}
                            className="btn btn-danger btn-sm mt-2"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Remove Module
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addCurriculumModule}
                        className="btn btn-secondary"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Module
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Testimonials Tab */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <p className="text-amber-800 text-sm">
                      <span className="font-medium">Testimonials & Success Stats:</span> Student testimonials and success metrics
                    </p>
                  </div>

                  {/* Testimonials */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Student Testimonials</h3>
                    <div className="space-y-6">
                      {(formData.testimonials || []).map((testimonial, index) => (
                        <div key={index} className="border border-gray-100 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                              <label className="form-label">Name *</label>
                              <input
                                type="text"
                                className="form-input"
                                value={testimonial.name}
                                onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                                placeholder="John Smith"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Role *</label>
                              <input
                                type="text"
                                className="form-input"
                                value={testimonial.role}
                                onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                                placeholder="Software Engineer at Google"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Avatar Image *</label>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                {testimonialAvatarPreviews[index] ? (
                                  <div className="space-y-3">
                                    <img
                                      src={testimonialAvatarPreviews[index]}
                                      alt="Avatar preview"
                                      className="w-24 h-24 object-cover rounded-full mx-auto border-2 border-gray-200"
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => testimonialFileInputRefs.current[index]?.click()}
                                        className="btn btn-secondary btn-sm flex-1"
                                        disabled={uploadingAvatars[index]}
                                      >
                                        {uploadingAvatars[index] ? (
                                          <>
                                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                            Uploading...
                                          </>
                                        ) : (
                                          <>
                                            <Upload className="w-3 h-3 mr-1" />
                                            Change Avatar
                                          </>
                                        )}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveTestimonialAvatar(index)}
                                        className="btn btn-secondary btn-sm"
                                        disabled={uploadingAvatars[index]}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <button
                                      type="button"
                                      onClick={() => testimonialFileInputRefs.current[index]?.click()}
                                      className="btn btn-primary btn-sm"
                                      disabled={uploadingAvatars[index]}
                                    >
                                      {uploadingAvatars[index] ? (
                                        <>
                                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                          Uploading...
                                        </>
                                      ) : (
                                        <>
                                          <Upload className="w-3 h-3 mr-1" />
                                          Upload Avatar
                                        </>
                                      )}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, WebP up to 5MB</p>
                                  </div>
                                )}
                                <input
                                  ref={(el) => { testimonialFileInputRefs.current[index] = el; }}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleTestimonialAvatarChange(index, e)}
                                  className="hidden"
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Rating *</label>
                              <select
                                className="form-input"
                                value={testimonial.rating}
                                onChange={(e) => updateTestimonial(index, 'rating', Number(e.target.value))}
                                required
                              >
                                <option value={5}>5 Stars</option>
                                <option value={4}>4 Stars</option>
                                <option value={3}>3 Stars</option>
                                <option value={2}>2 Stars</option>
                                <option value={1}>1 Star</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="form-label">Color *</label>
                              <select
                                className="form-input"
                                value={testimonial.color}
                                onChange={(e) => updateTestimonial(index, 'color', e.target.value)}
                                required
                              >
                                <option value="edtech-green">Green</option>
                                <option value="edtech-orange">Orange</option>
                                <option value="edtech-red">Red</option>
                                <option value="edtech-blue">Blue</option>
                              </select>
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Testimonial Content *</label>
                            <textarea
                              className="form-input"
                              rows={3}
                              value={testimonial.content}
                              onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                              placeholder="This course changed my career..."
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTestimonial(index)}
                            className="btn btn-danger btn-sm"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Remove Testimonial
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addTestimonial}
                        className="btn btn-secondary"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Testimonial
                      </button>
                    </div>
                  </div>

                  {/* Success Stats */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Success Statistics</h3>
                    <div className="space-y-2">
                      {(formData.successStats || []).map((stat, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input
                            type="text"
                            className="form-input"
                            value={stat.label}
                            onChange={(e) => updateSuccessStat(index, 'label', e.target.value)}
                            placeholder="Job Placement Rate"
                          />
                          <input
                            type="text"
                            className="form-input"
                            value={stat.value}
                            onChange={(e) => updateSuccessStat(index, 'value', e.target.value)}
                            placeholder="95%"
                          />
                          <div className="flex items-center gap-2">
                            <select
                              className="form-input flex-1"
                              value={stat.color}
                              onChange={(e) => updateSuccessStat(index, 'color', e.target.value)}
                            >
                              <option value="edtech-green">Green</option>
                              <option value="edtech-orange">Orange</option>
                              <option value="edtech-red">Red</option>
                              <option value="edtech-blue">Blue</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => removeSuccessStat(index)}
                              className="btn btn-danger btn-sm"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addSuccessStat}
                        className="btn btn-secondary btn-sm"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Success Stat
                      </button>
                    </div>
                  </div>
                </div>
              )}



              {/* Pricing Tab */}
              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
                    <p className="text-pink-800 text-sm">
                      <span className="font-medium">CoursePricing Schema:</span> Required fields for CoursePricing collection
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 text-sm">
                      💡 <strong>Smart Sync:</strong> Use "Same as..." checkboxes to automatically copy values from Course fields and avoid duplicate data entry. Fields will stay synced when you update the source.
                    </p>
                  </div>

                  {/* Basic Pricing Info */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Basic Pricing Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <div className="flex items-center justify-between mb-2">
                          <label className="form-label">Plan Name *</label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                              type="checkbox"
                              checked={sameAsStates.pricingName}
                              onChange={() => handleSameAsToggle('pricingName', 'title', 'pricingName')}
                            />
                            Same as Course Title
                          </label>
                        </div>
                        <input
                          type="text"
                          className={`form-input ${sameAsStates.pricingName ? 'bg-gray-100' : ''}`}
                          value={formData.pricingName || ''}
                          onChange={(e) => !sameAsStates.pricingName && setFormData({ ...formData, pricingName: e.target.value })}
                      placeholder="Professional Plan"
                          disabled={sameAsStates.pricingName}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <div className="flex items-center justify-between mb-2">
                          <label className="form-label">Plan Badge *</label>
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                              type="checkbox"
                              checked={sameAsStates.pricingBadge}
                              onChange={() => handleSameAsToggle('pricingBadge', 'badge', 'pricingBadge')}
                            />
                            Same as Course Badge
                          </label>
                        </div>
                        <input
                          type="text"
                          className={`form-input ${sameAsStates.pricingBadge ? 'bg-gray-100' : ''}`}
                          value={formData.pricingBadge || ''}
                          onChange={(e) => !sameAsStates.pricingBadge && setFormData({ ...formData, pricingBadge: e.target.value })}
                          placeholder="Most Popular"
                          disabled={sameAsStates.pricingBadge}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="flex items-center justify-between mb-2">
                        <label className="form-label">Plan Description *</label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <input
                            type="checkbox"
                            checked={sameAsStates.pricingDescription}
                            onChange={() => handleSameAsToggle('pricingDescription', 'desc', 'pricingDescription')}
                          />
                          Same as Course Description
                        </label>
                      </div>
                      <textarea
                        className={`form-input ${sameAsStates.pricingDescription ? 'bg-gray-100' : ''}`}
                        rows={3}
                        value={formData.pricingDescription || ''}
                        onChange={(e) => !sameAsStates.pricingDescription && setFormData({ ...formData, pricingDescription: e.target.value })}
                        placeholder="Plan description..."
                        disabled={sameAsStates.pricingDescription}
                        required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-group">
                        <div className="flex items-center justify-between mb-2">
                          <label className="form-label">Duration *</label>
                          <label className="flex items-center gap-2 text-xs text-gray-600">
                            <input
                              type="checkbox"
                              checked={sameAsStates.pricingDuration}
                              onChange={() => handleSameAsToggle('pricingDuration', 'duration', 'pricingDuration')}
                            />
                            Same as Course
                          </label>
                        </div>
                        <input
                          type="text"
                          className={`form-input ${sameAsStates.pricingDuration ? 'bg-gray-100' : ''}`}
                          value={formData.pricingDuration || ''}
                          onChange={(e) => !sameAsStates.pricingDuration && setFormData({ ...formData, pricingDuration: e.target.value })}
                          placeholder="12 weeks"
                          disabled={sameAsStates.pricingDuration}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <div className="flex items-center justify-between mb-2">
                          <label className="form-label">Extra Info *</label>
                          <label className="flex items-center gap-2 text-xs text-gray-600">
                            <input
                              type="checkbox"
                              checked={sameAsStates.pricingExtra}
                              onChange={() => handleSameAsToggle('pricingExtra', 'extra', 'pricingExtra')}
                            />
                            Same as Course
                          </label>
                        </div>
                        <input
                          type="text"
                          className={`form-input ${sameAsStates.pricingExtra ? 'bg-gray-100' : ''}`}
                          value={formData.pricingExtra || ''}
                          onChange={(e) => !sameAsStates.pricingExtra && setFormData({ ...formData, pricingExtra: e.target.value })}
                          placeholder="Live sessions included"
                          disabled={sameAsStates.pricingExtra}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Call to Action *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.cta || ''}
                          onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                          placeholder="Enroll Now"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing Details */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Pricing Details *</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="form-group">
                        <label className="form-label">Current Price (£) *</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.currentPrice || ''}
                        onChange={(e) => setFormData({ ...formData, currentPrice: Number(e.target.value) })}
                          placeholder="Enter price"
                          required
                      />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Original Price (£) *</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.originalPrice || ''}
                        onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                          placeholder="3999"
                          required
                      />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Discount *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.discount || ''}
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                          placeholder="50%"
                          required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label className="form-label">Installment Price (£) *</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.installmentPrice || ''}
                        onChange={(e) => setFormData({ ...formData, installmentPrice: Number(e.target.value) })}
                          placeholder="199"
                          required
                      />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Installment Months *</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.installmentMonths || ''}
                        onChange={(e) => setFormData({ ...formData, installmentMonths: Number(e.target.value) })}
                          placeholder="12"
                          required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                      <label className="form-label">Accent Color * (Pricing Schema)</label>
                      <select
                      className="form-input"
                        value={formData.pricingAccent || 'edtech-green'}
                        onChange={(e) => setFormData({ ...formData, pricingAccent: e.target.value as any })}
                        required
                      >
                        <option value="edtech-green">Green</option>
                        <option value="edtech-orange">Orange</option>
                        <option value="edtech-red">Red</option>
                        <option value="edtech-blue">Blue</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Note: Pricing schema allows blue, unlike Course schema</p>
                    </div>
                  </div>

                  {/* Plan Features */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Plan Features *</h3>
                    <div className="space-y-2">
                      {(formData.pricingFeatures || []).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            className="form-input flex-1"
                            value={feature}
                            onChange={(e) => updatePricingFeature(index, e.target.value)}
                            placeholder="Lifetime access to course materials"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removePricingFeature(index)}
                            className="btn btn-danger btn-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addPricingFeature}
                        className="btn btn-secondary btn-sm"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Feature
                      </button>
                    </div>
                  </div>

                  {/* Plan Settings */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Plan Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                        <label className="form-label">Highlighted *</label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2">
                    <input
                              type="radio"
                              name="highlighted"
                              checked={formData.highlighted === true}
                              onChange={() => setFormData({ ...formData, highlighted: true })}
                            />
                            <span className="text-sm">Yes</span>
                          </label>
                    <label className="flex items-center gap-2">
                      <input
                              type="radio"
                              name="highlighted"
                              checked={formData.highlighted === false}
                              onChange={() => setFormData({ ...formData, highlighted: false })}
                            />
                            <span className="text-sm">No</span>
                    </label>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Popular (Optional)</label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.popular || false}
                        onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      />
                          <span className="text-sm">Mark as Popular Plan</span>
                    </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="card-footer flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingId(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : editingId === 'new' ? 'Create Course' : 'Update Course'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <div key={course._id} className="card">
            <div className="card-body">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600">{course.category}</p>
                </div>
                {course.featured && (
                  <span className="badge badge-primary">Featured</span>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {course.desc}
              </p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{course.duration}</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    £{course.currentPrice}
                  </div>
                  {course.originalPrice > course.currentPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      £{course.originalPrice}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {course.curriculum?.length || 0} modules
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {course.tools?.length || 0} tools
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleEdit(course)}
                    className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-gray-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(course._id || '')}
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

      {filteredCourses.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first course</p>
          <button onClick={handleCreate} className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="stat-value">{courses.length}</div>
          <div className="stat-label">Total Courses</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{courses.filter(c => c.featured).length}</div>
          <div className="stat-label">Featured</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{courses.filter(c => c.popular).length}</div>
          <div className="stat-label">Popular</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {new Set(courses.map(c => c.category)).size}
          </div>
          <div className="stat-label">Categories</div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedCourseManagement;
