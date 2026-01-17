import { useState, useEffect } from 'react';
import { getMentorFeaturesData } from '../utils/dataAdapter';
import type { MentorFeature } from '../types';

export default function WhyChooseUs() {
  const [features, setFeatures] = useState<MentorFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const data = await getMentorFeaturesData();
        setFeatures(data);
      } catch (error) {
        console.error('Error loading mentor features:', error);
        setFeatures([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeatures();
  }, []);

  // Initialize scroll reveal animation after features are loaded
  useEffect(() => {
    if (!loading && features.length > 0) {
      const timer = setTimeout(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) e.target.classList.add("visible");
            });
          },
          { threshold: 0.1 }
        );
        
        const featureCards = document.querySelectorAll('.advantage-stat-card.reveal');
        featureCards.forEach((el) => observer.observe(el));
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [loading, features.length]);

  if (loading) {
    return (
      <section className="py-8 md:py-12 relative overflow-hidden" style={{backgroundColor: '#f4f7f1'}}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-gray-600 text-lg">Loading features...</div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-8 md:py-12 relative overflow-hidden" style={{backgroundColor: '#f4f7f1'}}>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Why Choose Us Section */}
          <div className="relative">
            <div className="text-center mb-16">
              <div className="badge-hero mx-auto w-max mb-6">
                <span>🚀 </span>
                <span>FAST-TRACK YOUR CAREER</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl mx-auto">
              Discover how our programs turn <span className="text-edtech-orange font-extrabold">ambition</span> into achievement.
              </h2>
              <p className="text-gray-800 max-w-3xl mx-auto font-semibold">
Learn from <span className="text-edtech-blue font-bold">industry experts</span>, work on <span className="text-edtech-orange font-bold">real projects</span>, and follow a path designed just for you — all in one powerful platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="advantage-stat-card bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 transition-all duration-300 reveal" data-accent={['blue', 'orange', 'green'][index % 3]} style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="mb-6">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold mb-4 ${
                      ['blue', 'orange', 'green'][index % 3] === 'blue' ? 'text-edtech-blue bg-edtech-blue/10' :
                      ['blue', 'orange', 'green'][index % 3] === 'orange' ? 'text-edtech-orange bg-edtech-orange/10' :
                      'text-edtech-green bg-edtech-green/10'
                    }`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
