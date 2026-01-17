import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// import TechBackground from "../TechBackground";
import AdvantageStats from "../components/AdvantageStats";
import MentorProfiles from "../components/MentorProfiles";
import useRevealOnScroll from "../hooks/useRevealOnScroll";
import { getAboutPageData } from "../utils/dataAdapter";
import type { TeamMember, Value, Stat, Milestone } from "../types";

// Helper function to render icon from SVG path
const renderIcon = (iconPath: string) => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
  </svg>
);

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [values, setValues] = useState<Value[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
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
    const loadAboutData = async () => {
      try {
        const data = await getAboutPageData();
        setTeamMembers(data.teamMembers);
        setValues(data.companyValues);
        setStats(data.aboutStats);
        setMilestones(data.companyMilestones);
      } catch (error) {
        console.error('Error loading about data:', error);
        setTeamMembers([]);
        setValues([]);
        setStats([]);
        setMilestones([]);
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, []);

  useRevealOnScroll();

  // Initialize scroll reveal for dynamic content after data loads
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) e.target.classList.add("visible");
            });
          },
          { threshold: 0.1 }
        );
        
        const aboutRevealElements = document.querySelectorAll('.about-reveal');
        aboutRevealElements.forEach((el) => observer.observe(el));
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-white/70 text-lg">Loading about page...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Background */}
      {/* <div className="fixed inset-0 -z-10">
        <TechBackground className="mix-blend-screen opacity-30" />
      </div>
       */}
      <main className="pt-20">
        {/* SECTION 1: Hero Section - BRAND COLORS */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-edtech-blue via-bg-deep to-edtech-blue/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          {/* <TechBackground className="opacity-15" /> */}
          
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="text-center mb-16 about-reveal reveal">
              <div className="badge-hero mx-auto w-max mb-8">
                <span>🚀</span><span>OUR STORY</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-8 leading-tight">
                Transforming Lives Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-edtech-green to-edtech-orange">Technology Education</span>
              </h1>
              <p className="text-white/80 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
                <span className="text-edtech-green font-semibold">Learn what matters</span>, <span className="text-edtech-orange font-semibold">achieve what you dream</span> — your future in tech starts here. Master in-demand skills
                that prepare you for success in the rapidly evolving digital economy.
              </p>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 about-reveal reveal">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 text-center">
                  <div className={`text-3xl md:text-4xl font-bold mb-2 text-${stat.color}`}>
                    {stat.number}
                  </div>
                  <div className="text-white/80 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: Mission & Vision - LIGHT */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16 about-reveal reveal">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our <span className="text-edtech-blue">Mission</span> & <span className="text-edtech-orange">Vision</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Driving the <span className="text-edtech-blue font-semibold">future of education</span> with purpose and vision that <span className="text-edtech-orange font-semibold">transforms lives</span>
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center about-reveal reveal">
              <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 md:p-12 border border-gray-100 group">
                <div className="w-20 h-20 bg-gradient-to-br from-edtech-green/20 to-green-400/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-edtech-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  🚀 To make <span className="text-edtech-blue font-semibold">next-gen technology education</span> accessible to everyone, regardless of background or location.
                  With expert guidance and cutting-edge resources, we empower anyone to build an <span className="text-edtech-orange font-semibold">exceptional career</span> in tech.
                </p>
              </div>
              
              <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 md:p-12 border border-gray-100 group">
                <div className="w-20 h-20 bg-gradient-to-br from-edtech-orange/20 to-orange-400/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-edtech-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  🌟 To be the world's premier platform for <span className="text-edtech-orange font-semibold">practical technology education</span>, creating a future where <span className="text-edtech-blue font-semibold">top talent</span> 
                  and global opportunities connect seamlessly, transcending geographical and economic barriers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Values - DARK */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-deep via-bg-deep to-edtech-blue/5" />
          
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="text-center mb-16 about-reveal reveal">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Core <span className="text-edtech-green">Values</span></h2>
              <p className="text-white/70 text-xl max-w-3xl mx-auto leading-relaxed">
                🚀 The principles that drive <span className="text-edtech-green font-semibold">excellence in everything</span> we do and shape the <span className="text-edtech-orange font-semibold">transformative learning experience</span> we deliver.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 about-reveal reveal">
              {values.map((value, index) => (
                <div key={index} className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 hover:scale-[1.02] group text-center">
                  <div className="w-16 h-16 bg-edtech-green/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-edtech-green group-hover:scale-110 transition-transform duration-300">
                    {renderIcon(value.iconPath)}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-white/70 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: AdvantageStats Component - LIGHT */}
        <AdvantageStats />

        {/* SECTION 5: Our Journey - DARK */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-deep via-bg-deep to-edtech-blue/5" />
          
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="text-center mb-16 about-reveal reveal">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our <span className="text-edtech-orange">Journey</span></h2>
              <p className="text-white/70 text-xl max-w-3xl mx-auto leading-relaxed">
                🌐 From <span className="text-edtech-green font-semibold">ambitious beginnings</span> to a <span className="text-edtech-orange font-semibold">global education powerhouse</span> — discover the milestones that have defined our path to excellence.
              </p>
            </div>

            <div className="relative about-reveal reveal">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 w-1 bg-gradient-to-b from-edtech-green via-edtech-orange to-edtech-blue transform md:-translate-x-0.5 rounded-full" style={{height: 'calc(100% + 4rem)'}}></div>
              
              <div className="space-y-16">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}>
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 w-6 h-6 bg-gradient-to-r from-edtech-green to-edtech-orange rounded-full border-4 border-bg-deep transform md:-translate-x-1/2 z-10 shadow-lg"></div>
                    
                    {/* Content */}
                    <div className={`bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 ml-16 md:ml-0 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 ${
                      index % 2 === 0 ? 'md:mr-12 md:w-5/12' : 'md:ml-auto md:w-5/12'
                    }`}>
                      <div className="text-edtech-green font-bold text-xl mb-3">{milestone.year}</div>
                      <h3 className="text-2xl font-bold text-white mb-4">{milestone.title}</h3>
                      <p className="text-white/70 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Timeline ending - Future indicator */}
              <div className="relative mt-16">
                {/* Final timeline dot */}
                <div className="absolute left-4 md:left-1/2 w-6 h-6 bg-gradient-to-r from-edtech-green to-edtech-orange rounded-full border-4 border-bg-deep transform md:-translate-x-1/2 z-10 shadow-lg"></div>
                
                
              </div>
            </div>
            {/* Future content - centered below the timeline */}
            <div className="pt-16 flex justify-center">
                  <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 max-w-md text-center">
                    <div className="text-edtech-orange font-bold text-xl mb-3">The Future</div>
                    <h3 className="text-2xl font-bold text-white mb-4">Building Tomorrow</h3>
                    <p className="text-white/70 leading-relaxed">
                      🚀 Our journey continues as we innovate and expand to serve more learners worldwide, 
                      <span className="text-edtech-green font-semibold">shaping the future</span> of technology education.
                    </p>
                  </div>
                </div>
          </div>
        </section>

        {/* SECTION 6: MentorProfiles Component - LIGHT */}
        <MentorProfiles />

        {/* SECTION 7: Team Section - DARK */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-deep via-bg-deep to-edtech-blue/5" />
          
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="text-center mb-16 about-reveal reveal">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Meet Our <span className="text-edtech-red">Team</span></h2>
              <p className="text-white/70 text-xl max-w-3xl mx-auto leading-relaxed">
                🌟 <span className="text-edtech-green font-semibold">Industry-leading experts</span> and <span className="text-edtech-orange font-semibold">passionate educators</span> dedicated to helping you master the tech of tomorrow, today.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 about-reveal reveal">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 hover:scale-[1.02] group text-center">
                  <div className="w-24 h-24 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={getImageUrl(member.image, 'team-images')}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white/10 group-hover:border-edtech-green/30"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'w-24 h-24 bg-gradient-to-br from-edtech-green/20 to-edtech-orange/20 rounded-full flex items-center justify-center';
                        fallback.innerHTML = `<div class="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center"><svg class="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>`;
                        target.parentElement?.appendChild(fallback);
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <div className="text-edtech-green text-sm font-medium mb-4">{member.role}</div>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    {member.bio}
                  </p>
                  <div className="flex justify-center gap-3">
                    <a href={member.linkedin} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-edtech-green/20 transition-all duration-300 hover:scale-110">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href={member.twitter} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-edtech-orange/20 transition-all duration-300 hover:scale-110">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8: CTA Section - ENHANCED */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-edtech-blue via-bg-deep to-edtech-blue relative overflow-hidden">
          {/* <div className="absolute inset-0">
            <TechBackground className="opacity-10" />
          </div> */}
          
          <div className="relative mx-auto max-w-5xl px-6 text-center">
            <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-12 about-reveal reveal">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/10 text-white border border-white/20">
                  🚀 Ready to Transform Your Life?
                </span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-edtech-green to-edtech-orange">Journey</span> Today
              </h2>
              
              <p className="text-white/80 text-xl mb-8 leading-relaxed max-w-3xl mx-auto">
                Ready to level up? Join our <span className="text-edtech-green font-semibold">community of high-achievers</span> and fast-track your career with skills that matter.
                Your <span className="text-edtech-orange font-semibold">gateway to global opportunities</span> begins here — we'll guide you every step of the way.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/programs" 
                  className="bg-gradient-to-r from-edtech-green to-edtech-orange text-black px-8 py-4 rounded-full font-bold text-lg hover:brightness-110 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  🎯 Explore Our Programs
                </Link>
                <Link 
                  to="/contact" 
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  💬 Claim Your FREE Strategy Call
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="flex flex-wrap justify-center items-center gap-8 text-white/60">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-edtech-green" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm">4.8/5 Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-edtech-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">1000+ Success Stories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-edtech-orange" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Industry Certified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
