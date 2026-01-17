import { useState, useEffect } from 'react';
import { getMentorsData, getPartnerCompaniesData } from '../utils/dataAdapter';
import type { Mentor, CompanyLogo } from '../types';

export default function MentorProfiles() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [partnerCompanies, setPartnerCompanies] = useState<CompanyLogo[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to construct image URLs
  const getImageUrl = (filename: string | undefined, folder: string = 'team-images'): string => {
    if (!filename) return '';
    // If it's already a full URL, return as is
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }
    // Otherwise, construct the URL from the API base URL
    return `${import.meta.env.VITE_API_BASE_URL}/uploads/${folder}/${filename}`;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mentorsData, partnersData] = await Promise.all([
          getMentorsData(),
          getPartnerCompaniesData()
        ]);
        setMentors(mentorsData);
        setPartnerCompanies(partnersData);
      } catch (error) {
        console.error('Error loading mentor data:', error);
        setMentors([]);
        setPartnerCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Initialize scroll reveal for dynamic content after data loads
  useEffect(() => {
    if (!loading && mentors.length > 0) {
      const timer = setTimeout(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) e.target.classList.add("visible");
            });
          },
          { threshold: 0.1 }
        );
        
        const mentorRevealElements = document.querySelectorAll('.mentor-reveal');
        mentorRevealElements.forEach((el) => observer.observe(el));
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [loading, mentors.length]);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" style={{backgroundColor: '#f4f7f1'}}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-24">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="badge-hero mx-auto w-max mb-6">
              <span>👨‍💼</span>
              <span>EXPERT MENTORS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Learn from <span className="text-edtech-blue font-extrabold">experienced professionals</span>
            </h2>
            <p className="text-gray-800 max-w-3xl mx-auto font-semibold">
              Get <span className="text-edtech-blue font-bold">personalized guidance</span> from <span className="text-edtech-orange font-bold">seasoned professionals</span> working at leading companies who are passionate about helping you succeed in your career journey.
            </p>
          </div>

          {/* Company logos showcase - multiple rows like CompanyShowcase */}
          <div className="mb-16">
            <div className="space-y-6 sm:space-y-8">
              {/* Company Row - Right to Left (changed direction) */}
              <div className="overflow-hidden whitespace-nowrap">
                <div className="inline-flex py-1 animate-scroll-right gap-8">
                  {[...partnerCompanies, ...partnerCompanies].map((company, index) => (
                    <div key={`${company.name}-${index}`} className="flex-shrink-0">
                      <div className="company-card" style={{background: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(0, 0, 0, 0.1)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'}}>
                        <img 
                          src={company.logo} 
                          alt={company.name}
                          className="company-logo"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="mentor-reveal reveal">
                <div className="advantage-stat-card bg-white rounded-2xl p-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-105" data-accent={mentor.accent}>
                  <div className="text-center">
                    <div className="mb-4">
                      <img 
                        src={getImageUrl(mentor.image, 'team-images')} 
                        alt={mentor.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-100"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{mentor.name}</h4>
                      <p className="text-gray-600 text-sm font-medium mb-2">{mentor.role}</p>
                      
                      <div className={`inline-flex items-center px-3 py-1 rounded-full ${
                        mentor.accent === 'blue' ? 'bg-edtech-blue/10 border border-edtech-blue/20' :
                        mentor.accent === 'orange' ? 'bg-edtech-orange/10 border border-edtech-orange/20' :
                        'bg-edtech-green/10 border border-edtech-green/20'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          mentor.accent === 'blue' ? 'bg-edtech-blue' :
                          mentor.accent === 'orange' ? 'bg-edtech-orange' :
                          'bg-edtech-green'
                        }`}></div>
                        <span className={`text-xs font-semibold ${
                          mentor.accent === 'blue' ? 'text-edtech-blue' :
                          mentor.accent === 'orange' ? 'text-edtech-orange' :
                          'text-edtech-green'
                        }`}>{mentor.company}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
