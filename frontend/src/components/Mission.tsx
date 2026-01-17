import React from 'react';
import './Mission.css';
import microsoftPartnerDesktop from '../assets/misson_microsoft_partner_desktop.webp';
import microsoftPartnerMobile from '../assets/misson_microsoft_partner_mobile.webp';
const Mission: React.FC = () => {
  // Desktop images data
  const desktopImages = [
    {
      id: 1,
      src: 'https://thinkwht.in/wp-content/uploads/2025/10/Students-feedback.webp',
      alt: 'Students Feedback',
      srcSet: `
        https://thinkwht.in/wp-content/uploads/2025/10/Students-feedback.webp 1102w,
        https://thinkwht.in/wp-content/uploads/2025/10/Students-feedback-300x85.webp 300w,
        https://thinkwht.in/wp-content/uploads/2025/10/Students-feedback-1024x290.webp 1024w,
        https://thinkwht.in/wp-content/uploads/2025/10/Students-feedback-768x217.webp 768w
      `,
      className: 'mission-1'
    },
    {
      id: 2,
      src: 'https://thinkwht.in/wp-content/uploads/2025/10/Mentor-Video.webp',
      alt: 'Mentor Video',
      srcSet: `
        https://thinkwht.in/wp-content/uploads/2025/10/Mentor-Video.webp 1102w,
        https://thinkwht.in/wp-content/uploads/2025/10/Mentor-Video-300x85.webp 300w,
        https://thinkwht.in/wp-content/uploads/2025/10/Mentor-Video-1024x290.webp 1024w,
        https://thinkwht.in/wp-content/uploads/2025/10/Mentor-Video-768x217.webp 768w
      `,
      className: 'mission-2'
    },
    {
      id: 3,
      src: 'https://thinkwht.in/wp-content/uploads/2025/10/Certification.webp',
      alt: 'Certification',
      srcSet: `
        https://thinkwht.in/wp-content/uploads/2025/10/Certification.webp 1102w,
        https://thinkwht.in/wp-content/uploads/2025/10/Certification-300x85.webp 300w,
        https://thinkwht.in/wp-content/uploads/2025/10/Certification-1024x290.webp 1024w,
        https://thinkwht.in/wp-content/uploads/2025/10/Certification-768x217.webp 768w
      `,
      className: 'mission-3'
    },
    {
      id: 4,
      src: microsoftPartnerDesktop,
      alt: 'Microsoft Partner Desktop',
      srcSet: `${microsoftPartnerDesktop} 1102w`,
      className: 'mission-4'
    }
  ];

  // Mobile images data
  const mobileImages = [
    {
      id: 1,
      src: 'https://thinkwht.in/wp-content/uploads/2025/10/Feedback.webp',
      alt: 'Student Feedback',
      srcSet: `
        https://thinkwht.in/wp-content/uploads/2025/10/Feedback.webp 393w,
        https://thinkwht.in/wp-content/uploads/2025/10/Feedback-205x300.webp 205w
      `,
      className: 'mission-1'
    },
    {
      id: 2,
      src: 'https://thinkwht.in/wp-content/uploads/2025/10/Mentor-Video-1.webp',
      alt: 'Mentor Video Session',
      srcSet: `
        https://thinkwht.in/wp-content/uploads/2025/10/Mentor-Video-1.webp 393w,
        https://thinkwht.in/wp-content/uploads/2025/10/Mentor-Video-1-205x300.webp 205w
      `,
      className: 'mission-2'
    },
    {
      id: 3,
      src: 'https://thinkwht.in/wp-content/uploads/2025/10/Mentor-Video-2.webp',
      alt: 'Advanced Mentoring',
      srcSet: `
        https://thinkwht.in/wp-content/uploads/2025/10/Mentor-Video-2.webp 393w,
        https://thinkwht.in/wp-content/uploads/2025/10/Mentor-Video-2-205x300.webp 205w
      `,
      className: 'mission-3'
    },
    {
      id: 4,
      src: microsoftPartnerMobile,
      alt: 'Professional Development',
      srcSet: `${microsoftPartnerMobile} 393w`,
      className: 'mission-4'
    }
  ];


  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
       <div className="text-center mb-12">
          <div className="badge-hero mx-auto w-max mb-6">
            <span>🎯</span>
            <span>YOUR SUCCESS JOURNEY</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Your Journey, Our <span className="text-edtech-orange font-extrabold">Mission</span>
          </h2>
          <p className="text-gray-800 max-w-3xl mx-auto font-semibold">
            From <span className="text-edtech-blue font-bold">personalized feedback</span> to <span className="text-edtech-orange font-bold">expert mentorship</span> and industry-recognized certifications — we're committed to your success.
          </p>
        </div>

        {/* Mission Container */}
        <div className="relative">
          {/* Desktop Images */}
          <div className="hidden md:block">
            {desktopImages.map((image) => (
              <div
                key={image.id}
                className={`${image.className} mb-8`}
                style={{
                  position: 'sticky',
                  top: '120px'
                }}
              >
                <img
                  loading="lazy"
                  decoding="async"
                  width="1102"
                  height="312"
                  src={image.src}
                  className="w-full h-auto rounded-lg shadow-lg"
                  alt={image.alt}
                  srcSet={image.srcSet.trim()}
                  sizes="(max-width: 1102px) 100vw, 1102px"
                />
              </div>
            ))}
          </div>

          {/* Mobile Images */}
          <div className="block md:hidden">
            {mobileImages.map((image) => (
              <div
                key={image.id}
                className={`${image.className} mb-8`}
                style={{
                  position: 'sticky',
                  top: '120px'
                }}
              >
                <img
                  loading="lazy"
                  decoding="async"
                  width="393"
                  height="574"
                  src={image.src}
                  className="w-full h-auto rounded-lg shadow-lg"
                  alt={image.alt}
                  srcSet={image.srcSet.trim()}
                  sizes="(max-width: 393px) 100vw, 393px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>


    </section>
  );
};

export default Mission;