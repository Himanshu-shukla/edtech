'use client';

import { motion } from 'framer-motion';
import { Clock, Users, ArrowRight, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { VIDEO_CONFIG } from '@/config/video';

interface NavigationProps {
  onApplyNow: () => void;
}

export default function Navigation({ onApplyNow }: NavigationProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 33 });
  const [seatsLeft] = useState(7);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Countdown timer for navbar urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes } = prev;
        
        if (minutes > 0) {
          minutes--;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
        }
        
        return { hours, minutes };
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    ...(VIDEO_CONFIG.enabled ? [{ href: "#demo", label: "Demo", icon: "🎥" }] : []),
    { href: "#curriculum", label: "Curriculum", icon: "📚" },
    { href: "#instructors", label: "Instructors", icon: "👨‍🏫" },
    { href: "#testimonials", label: "Success Stories", icon: "⭐" },
    { href: "#faq", label: "FAQ", icon: "❓" }
  ];

  // Smooth scroll function
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const navbarHeight = 128; // Account for fixed navbar height + top banner
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Urgency Top Bar */}
      <div className="fixed top-0 w-full z-50 bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 text-center h-10">
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center justify-center space-x-2 sm:space-x-4 px-2 sm:px-4 h-full"
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">
              Early Bird: {timeLeft.hours}h {timeLeft.minutes}m
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm whitespace-nowrap">Only {seatsLeft} seats left!</span>
          </div>
          <span className="font-bold text-xs sm:text-sm whitespace-nowrap">20% OFF Special</span>
        </motion.div>
      </div>

      {/* Main Navigation */}
      <nav className="fixed top-10 w-full z-40 glass backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 gap-2 sm:gap-4">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 min-w-0 flex-shrink-0"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center p-1 flex-shrink-0">
                <Image
                  src="/favicon.png"
                  alt="Edtech Informative Logo"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                  priority
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm sm:text-base lg:text-lg font-bold text-foreground truncate">
                  <span>Edtech Informative</span>
                </span>
                <span className="text-xs text-primary font-medium truncate hidden sm:block">
                  6-Month Data Analytics Career Program
                </span>
              </div>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors font-medium cursor-pointer"
                >
                  <span>{link.label}</span>
                </motion.a>
              ))}
            </div>

            {/* Offer & CTA */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
              {/* Discount Display */}
              <div className="hidden md:flex flex-col items-end flex-shrink-0">
                <div className="flex items-center space-x-1">
                  <span className="text-lg lg:text-2xl font-bold text-primary">20% OFF</span>
                </div>
                <span className="text-xs text-green-600 font-semibold whitespace-nowrap">Early Bird Special</span>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-foreground p-1 sm:p-2 flex-shrink-0"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>

              {/* Apply Now Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onApplyNow}
                className="bg-gradient-to-r from-primary to-secondary text-white px-3 sm:px-4 lg:px-8 py-3 sm:py-3 rounded-full font-bold hover:shadow-lg transition-all pulse-glow flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base flex-shrink-0"
              >
                <span className="hidden sm:inline whitespace-nowrap">Secure My Spot</span>
                <span className="sm:hidden">Apply</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    scrollToSection(e, link.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors font-medium py-2 cursor-pointer"
                >
                  <span className="text-sm">{link.label}</span>
                </a>
              ))}
              
              {/* Mobile Offer */}
              <div className="border-t pt-4 mt-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary">20% OFF</span>
                      </div>
                      <span className="text-xs text-green-600 font-semibold">Early Bird Special</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-red-600 font-semibold">
                        ⏰ {timeLeft.hours}h {timeLeft.minutes}m left
                      </div>
                      <div className="text-xs text-gray-600">
                        🔥 {seatsLeft} spots remaining
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
}