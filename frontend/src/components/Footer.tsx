// import FloatingDots from "../FloatingDots";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WhiteLogo from "../assets/WHITE-LOGO--300x152.png";
import { getCoursesData, getCompanyInfoData } from "../utils/dataAdapter";
import type { Course, CompanyInfo } from "../types";

export default function Footer() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesData, companyData] = await Promise.all([
          getCoursesData(),
          getCompanyInfoData()
        ]);
        setCourses(coursesData);
        setCompanyInfo(companyData);
      } catch (error) {
        console.error('Error loading data:', error);
        setCourses([]);
        setCompanyInfo(null);
      }
    };

    loadData();
  }, []);

  // Get first 4 courses for footer display
  const footerCourses = courses.slice(0, 4);

  // Helper function to convert text to title case
  const toTitleCase = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <footer id="contact" className="pt-10 pb-2 border-t border-white/10 relative overflow-hidden">
      {/* <FloatingDots numDots={80} className="opacity-75 -z-10" /> */}
      <div className="mx-auto max-w-7xl px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <img src={WhiteLogo} alt="EdTech Informative" className="h-10 w-auto mb-4" />
            <p className="text-white/80 text-lg mb-6 max-w-md leading-relaxed">
              Transform your career with <span className="text-edtech-green font-semibold">cutting-edge tech skills</span>. Your gateway to <span className="text-edtech-orange font-semibold">future‑ready careers</span> in Data, AI, and Cloud technologies.
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <Link to="/programs" className="cta cta-primary">
                  Start Learning Today
                </Link>
                <Link to="/contact" className="cta cta-secondary">
                  Contact Us
                </Link>
              </div>
              
              {/* Social Media Icons */}
              {companyInfo?.socialMedia && (
                <div className="flex items-center gap-6">
                  <span className="text-white/60 text-sm font-medium">Follow us:</span>
                  <div className="flex gap-4">
                    {companyInfo.socialMedia.facebook && (
                      <a 
                        href={companyInfo.socialMedia.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 transition-all duration-300 hover:scale-110"
                        aria-label="Follow us on Facebook"
                      >
                        <svg className="w-5 h-5 text-white group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    )}
                    
                    {companyInfo.socialMedia.instagram && (
                      <a 
                        href={companyInfo.socialMedia.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-yellow-500 transition-all duration-300 hover:scale-110"
                        aria-label="Follow us on Instagram"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2476 2476" className="w-5 h-5 text-white group-hover:text-white" fill="currentColor">
                          <path d="M825.4 1238c0-227.9 184.7-412.7 412.6-412.7 227.9 0 412.7 184.8 412.7 412.7 0 227.9-184.8 412.7-412.7 412.7-227.9 0-412.6-184.8-412.6-412.7m-223.1 0c0 351.1 284.6 635.7 635.7 635.7s635.7-284.6 635.7-635.7-284.6-635.7-635.7-635.7S602.3 886.9 602.3 1238m1148-660.9c0 82 66.5 148.6 148.6 148.6 82 0 148.6-66.6 148.6-148.6s-66.5-148.5-148.6-148.5-148.6 66.5-148.6 148.5M737.8 2245.7c-120.7-5.5-186.3-25.6-229.9-42.6-57.8-22.5-99-49.3-142.4-92.6-43.3-43.3-70.2-84.5-92.6-142.3-17-43.6-37.1-109.2-42.6-229.9-6-130.5-7.2-169.7-7.2-500.3s1.3-369.7 7.2-500.3c5.5-120.7 25.7-186.2 42.6-229.9 22.5-57.8 49.3-99 92.6-142.4 43.3-43.3 84.5-70.2 142.4-92.6 43.6-17 109.2-37.1 229.9-42.6 130.5-6 169.7-7.2 500.2-7.2 330.6 0 369.7 1.3 500.3 7.2 120.7 5.5 186.2 25.7 229.9 42.6 57.8 22.4 99 49.3 142.4 92.6 43.3 43.3 70.1 84.6 92.6 142.4 17 43.6 37.1 109.2 42.6 229.9 6 130.6 7.2 169.7 7.2 500.3 0 330.5-1.2 369.7-7.2 500.3-5.5 120.7-25.7 186.3-42.6 229.9-22.5 57.8-49.3 99-92.6 142.3-43.3 43.3-84.6 70.1-142.4 92.6-43.6 17-109.2 37.1-229.9 42.6-130.5 6-169.7 7.2-500.3 7.2-330.5 0-369.7-1.2-500.2-7.2M727.6 7.5c-131.8 6-221.8 26.9-300.5 57.5-81.4 31.6-150.4 74-219.3 142.8C139 276.6 96.6 345.6 65 427.1 34.4 505.8 13.5 595.8 7.5 727.6 1.4 859.6 0 901.8 0 1238s1.4 378.4 7.5 510.4c6 131.8 26.9 221.8 57.5 300.5 31.6 81.4 73.9 150.5 142.8 219.3 68.8 68.8 137.8 111.1 219.3 142.8 78.8 30.6 168.7 51.5 300.5 57.5 132.1 6 174.2 7.5 510.4 7.5 336.3 0 378.4-1.4 510.4-7.5 131.8-6 221.8-26.9 300.5-57.5 81.4-31.7 150.4-74 219.3-142.8 68.8-68.8 111.1-137.9 142.8-219.3 30.6-78.7 51.6-168.7 57.5-300.5 6-132.1 7.4-174.2 7.4-510.4s-1.4-378.4-7.4-510.4c-6-131.8-26.9-221.8-57.5-300.5-31.7-81.4-74-150.4-142.8-219.3C2199.4 139 2130.3 96.6 2049 65c-78.8-30.6-168.8-51.6-300.5-57.5-132-6-174.2-7.5-510.4-7.5-336.3 0-378.4 1.4-510.5 7.5"/>
                        </svg>
                      </a>
                    )}
                    
                    {companyInfo.socialMedia.linkedin && (
                      <a 
                        href={companyInfo.socialMedia.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-blue-700 transition-all duration-300 hover:scale-110"
                        aria-label="Follow us on LinkedIn"
                      >
                        <svg className="w-5 h-5 text-white group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Programs</h4>
            <ul className="space-y-3 text-white/70">
              {footerCourses.map((course) => (
                <li key={course.id}>
                  <Link to={`/program/${course.id}`} className="hover:text-edtech-orange transition-colors font-medium">
                    {course.title.length > 25 ? toTitleCase(course.category) : toTitleCase(course.title)}
                  </Link>
                </li>
              ))}
              <li><Link to="/programs" className="hover:text-edtech-green transition-colors font-medium">View All Programs</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Company</h4>
            <ul className="space-y-3 text-white/70">
              <li><Link to="/about" className="hover:text-edtech-orange transition-colors font-medium">About Us</Link></li>
              {/* <li><Link to="/blog" className="hover:text-edtech-orange transition-colors font-medium">Blog</Link></li> */}
              <li><Link to="/pricing" className="hover:text-edtech-orange transition-colors font-medium">Pricing</Link></li>
              <li><Link to="/contact" className="hover:text-edtech-orange transition-colors font-medium">Contact</Link></li>
     </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/60 text-sm">
              © 2025 EdTech Informative. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Link to="/privacy-policy" className="hover:text-edtech-orange transition-colors">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link to="/refund-policy" className="hover:text-edtech-orange transition-colors">
                Refund Policy
              </Link>
              <span>|</span>
              <Link to="/terms-of-service" className="hover:text-edtech-orange transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

