import { useState, useEffect } from 'react';
import { getUpcomingSkillsData } from '../utils/dataAdapter';
import type { UpcomingSkill } from '../types';

export default function UpcomingSkills() {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [upcomingSkills, setUpcomingSkills] = useState<UpcomingSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUpcomingSkills = async () => {
      try {
        const data = await getUpcomingSkillsData();
        setUpcomingSkills(data);
      } catch (error) {
        console.error('Error loading upcoming skills:', error);
        setUpcomingSkills([]);
      } finally {
        setLoading(false);
      }
    };

    loadUpcomingSkills();
  }, []);

  // Duplicate skills for seamless infinite scroll
  const duplicatedSkills = [...upcomingSkills, ...upcomingSkills , ...upcomingSkills, ...upcomingSkills ,...upcomingSkills, ...upcomingSkills ,...upcomingSkills, ...upcomingSkills ,...upcomingSkills, ...upcomingSkills ,...upcomingSkills, ...upcomingSkills ,...upcomingSkills, ...upcomingSkills ,...upcomingSkills, ...upcomingSkills ,...upcomingSkills, ...upcomingSkills ,...upcomingSkills, ...upcomingSkills ,];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const container = e.currentTarget as HTMLElement;
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = e.currentTarget as HTMLElement;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (loading) {
    return (
      <section className="py-8 md:py-12 relative overflow-hidden" style={{backgroundColor: '#f4f7f1'}}>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="text-gray-600 text-lg">Loading upcoming skills...</div>
        </div>
      </section>
    );
  }

  if (upcomingSkills.length === 0) {
    return (
      <section className="py-8 md:py-12 relative overflow-hidden" style={{backgroundColor: '#f4f7f1'}}>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="text-gray-600 text-lg">No upcoming skills available at the moment.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 relative overflow-hidden" style={{backgroundColor: '#f4f7f1'}}>
      {/* Simple light background without gradients */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <div className="badge-hero mx-auto w-max">
            <span>🌟</span>
            <span>BE THE 1%</span>
          </div>
          <h2 className="mt-6 text-3xl md:text-4xl font-bold text-gray-900">
            Next-Gen Skills for 
            <span className="text-edtech-orange font-extrabold"> Next-Level Success</span>
          </h2>
          <p className="mt-4 text-gray-800 max-w-2xl mx-auto font-semibold">
           <span className="text-edtech-blue font-bold">Master the tech</span> of <span className="text-edtech-orange font-bold">tomorrow, today</span> — stay 10 steps ahead while others are catching up.

          </p>
        </div>

        {/* Marquee Container */}
        <div className="marquee relative">
          <div 
            className={`marquee-viewport ${isDragging ? 'dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div className="marquee-track py-4 animate-marquee">
              {duplicatedSkills.map((skill, index) => (
                <div
                  key={`${skill.id}-${index}`}
                  className="skill-card group"
                  data-accent={skill.accent}
                >
                  {/* Skill Icon */}
                  <div className="skill-icon">
                    <span className="text-4xl">{skill.icon}</span>
                  </div>

                  {/* Skill Info */}
                  <div className="skill-content">
                    <div className="skill-category">
                      {skill.category}
                    </div>
                    <h3 className="skill-title">
                      {skill.name}
                    </h3>
                    
                    {/* Metrics */}
                    <div className="skill-metrics">
                      <div className="metric">
                        <span className="metric-label">Demand</span>
                        <span className="metric-value demand-badge">
                          {skill.demand}
                        </span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Growth</span>
                        <span className="metric-value growth-badge">
                          {skill.growth}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Corner indicator */}
                  <div className="corner-indicator">
                    <div className="pulse-dot"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
