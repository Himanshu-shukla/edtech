import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail, ExternalLink } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import WhiteLogo from "../assets/WHITE-LOGO--300x152.png";
import { getCoursesData, getCompanyInfoData } from "../utils/dataAdapter";
import type { Course, CompanyInfo } from "../types";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const SocialLink = ({ href, icon, label, colorClass }: { href: string, icon: React.ReactNode, label: string, colorClass: string }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    whileHover={{ y: -3, scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className={cn(
      "w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 transition-all duration-300 shadow-lg",
      colorClass
    )}
  >
    {icon}
  </motion.a>
);

const FooterLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <motion.li whileHover={{ x: 5 }}>
    <Link 
      to={to} 
      className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-emerald-500 transition-colors" />
      {children}
    </Link>
  </motion.li>
);

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
      }
    };
    loadData();
  }, []);

  const footerCourses = courses.slice(0, 4);
  const toTitleCase = (str: string) => str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <footer className="relative bg-zinc-950 pt-20 pb-10 overflow-hidden border-t border-white/5">
      
      {/* --- Background Decor --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- Main Content Grid --- */}
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          
          {/* Column 1: Brand & CTA (Span 5) */}
          <div className="md:col-span-5 space-y-8">
            <Link to="/" className="block">
              <img src={WhiteLogo} alt="EdTech Informative" className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity" />
            </Link>
            
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              Transform your career with <span className="text-emerald-400 font-medium">cutting-edge tech skills</span>. 
              Your gateway to <span className="text-orange-400 font-medium">future‑ready careers</span> in Data, AI, and Cloud.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                to="/programs" 
                className="group relative overflow-hidden px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Learning <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
              </Link>
              
              <Link 
                to="/contact" 
                className="px-6 py-3 rounded-xl border border-zinc-700 text-white font-medium text-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> Contact Us
              </Link>
            </div>

            {/* Socials */}
            {companyInfo?.socialMedia && (
              <div className="pt-4">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Follow Our Journey</p>
                <div className="flex gap-3">
                  {companyInfo.socialMedia.facebook && (
                    <SocialLink 
                      href={companyInfo.socialMedia.facebook} 
                      label="Facebook"
                      colorClass="hover:border-blue-500/50 hover:text-blue-500 hover:shadow-blue-500/20"
                      icon={<svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                    />
                  )}
                  {companyInfo.socialMedia.instagram && (
                    <SocialLink 
                      href={companyInfo.socialMedia.instagram} 
                      label="Instagram"
                      colorClass="hover:border-pink-500/50 hover:text-pink-500 hover:shadow-pink-500/20"
                      icon={<svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>}
                    />
                  )}
                  {companyInfo.socialMedia.linkedin && (
                    <SocialLink 
                      href={companyInfo.socialMedia.linkedin} 
                      label="LinkedIn"
                      colorClass="hover:border-blue-600/50 hover:text-blue-600 hover:shadow-blue-600/20"
                      icon={<svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Programs (Span 3) */}
          <div className="md:col-span-3 md:pl-8">
            <h4 className="text-white font-bold text-lg mb-6">Programs</h4>
            <ul className="space-y-4">
              {footerCourses.map((course) => (
                <FooterLink key={course.id} to={`/program/${course.id}`}>
                  {course.title.length > 25 ? toTitleCase(course.category) : toTitleCase(course.title)}
                </FooterLink>
              ))}
              <li className="pt-2">
                <Link to="/programs" className="text-emerald-400 text-sm font-semibold hover:text-emerald-300 flex items-center gap-1">
                  View All Programs <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company (Span 4) */}
          <div className="md:col-span-4">
            <h4 className="text-white font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/pricing">Pricing & Plans</FooterLink>
              <FooterLink to="/contact">Contact Support</FooterLink>
              <li className="pt-4 border-t border-zinc-800 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-zinc-500 text-sm">System Status: <span className="text-emerald-500 font-medium">Operational</span></span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* --- Bottom Bar --- */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} EdTech Informative. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-500 font-medium">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}