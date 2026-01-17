'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Phone, Mail, ArrowRight, Clock, Target, Users, Award, Star, Cpu, Settings, Brain, GitBranch, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';

// Facebook Pixel type declaration
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export default function ThankYouPage() {
  const [timeUntilContact, setTimeUntilContact] = useState('2 hours');
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 33 });
  const [seatsLeft] = useState(7);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Set page title
    document.title = 'Application Submitted - AI Career Program | Edtech Informative';
    
    // Track Lead conversion for Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead');
    }
    
    // Calculate time until next business hour contact
    const now = new Date();
    const nextContactTime = new Date();
    
    // If it's after 6 PM or before 9 AM, set to next 9 AM
    if (now.getHours() >= 18 || now.getHours() < 9) {
      if (now.getHours() >= 18) {
        nextContactTime.setDate(now.getDate() + 1);
      }
      nextContactTime.setHours(9, 0, 0, 0);
    } else {
      // During business hours, add 2 hours
      nextContactTime.setTime(now.getTime() + (2 * 60 * 60 * 1000));
    }
    
    const timeDiff = nextContactTime.getTime() - now.getTime();
    const hoursUntil = Math.ceil(timeDiff / (1000 * 60 * 60));
    
    if (hoursUntil <= 2) {
      setTimeUntilContact('2 hours');
    } else if (hoursUntil <= 12) {
      setTimeUntilContact(`${hoursUntil} hours`);
    } else {
      setTimeUntilContact('next business day');
    }

    // Countdown timer for navbar urgency
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

  const handleApplyNow = () => {
    // Redirect to main page since they already applied
    window.location.href = '/';
  };

  const navLinks = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/#curriculum", label: "Curriculum", icon: "📚" },
    { href: "/#instructors", label: "Instructors", icon: "👨‍🏫" },
    { href: "/#testimonials", label: "Success Stories", icon: "⭐" },
    { href: "/#faq", label: "FAQ", icon: "❓" }
  ];

  return (
    <main className="min-h-screen bg-background overflow-x-hidden max-w-full">
      <div className="w-full max-w-full overflow-x-hidden">{/* Main container wrapper */}
      {/* Custom Navbar */}
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
                    src="/favicon.ico"
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
                    Application Submitted ✓
                  </span>
                </div>
              </motion.div>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors font-medium cursor-pointer"
                  >
                    <span>{link.label}</span>
                  </motion.a>
                ))}
              </div>

              {/* Success Badge & CTA */}
              <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
                {/* Success Badge */}
                <div className="hidden md:flex flex-col items-end flex-shrink-0">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm lg:text-base font-bold text-green-600">Submitted</span>
                  </div>
                  <span className="text-xs text-green-600 font-semibold whitespace-nowrap">Application Received</span>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden text-foreground p-1 sm:p-2 flex-shrink-0"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>

                {/* Return Home Button */}
                <motion.a
                  href="/"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-primary to-secondary text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full font-bold hover:shadow-lg transition-all flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base flex-shrink-0"
                >
                  <span className="hidden sm:inline whitespace-nowrap">Return Home</span>
                  <span className="sm:hidden">Home</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.a>
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
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors font-medium py-2 cursor-pointer"
                  >
                    <span className="text-sm">{link.label}</span>
                  </a>
                ))}
                
                {/* Mobile Success Status */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-lg font-bold text-green-600">Application Submitted</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      We'll contact you within {timeUntilContact}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </nav>
      </>
      
      {/* Hero Section with Matching Background */}
      <section className="pt-28 relative bg-gradient-to-br from-blue-50 via-purple-50 to-gray-50 text-gray-900 min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements - Matching HeroSection */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-gray-50"></div>
          <div className="absolute inset-0 overflow-hidden opacity-20 hidden md:block">
            {/* Top Left Process Flow */}
            <div className="absolute top-20 left-16">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="text-xs text-green-600 font-mono font-semibold">SUBMITTED</div>
                </div>
                <div className="flex items-center space-x-3 ml-2">
                  <div className="w-3 h-3 bg-blue-500 rounded animate-pulse delay-100"></div>
                  <div className="text-xs text-blue-600 font-mono font-semibold">PROCESSING</div>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                  <div className="w-3 h-3 bg-purple-500 rounded animate-pulse delay-200"></div>
                  <div className="text-xs text-purple-600 font-mono font-semibold">REVIEW</div>
                </div>
                <div className="flex items-center space-x-3 ml-6">
                  <div className="w-3 h-3 bg-yellow-500 rounded animate-pulse delay-300"></div>
                  <div className="text-xs text-yellow-600 font-mono font-semibold">CONTACT</div>
                </div>
              </div>
            </div>

            {/* Top Right Icons */}
            <div className="absolute top-32 right-20 space-y-4">
              <div className="animate-float">
                <Cpu className="w-8 h-8 text-blue-500 opacity-60" />
              </div>
              <div className="animate-float" style={{animationDelay: '1s'}}>
                <Brain className="w-8 h-8 text-purple-500 opacity-60" />
              </div>
              <div className="animate-float" style={{animationDelay: '2s'}}>
                <Settings className="w-8 h-8 text-green-500 opacity-60" />
              </div>
            </div>

            {/* Bottom Left */}
            <div className="absolute bottom-32 left-32 space-x-4 flex">
              <div className="animate-bounce" style={{animationDelay: '0.5s'}}>
                <GitBranch className="w-6 h-6 text-indigo-500 opacity-40" />
              </div>
              <div className="animate-bounce" style={{animationDelay: '1.5s'}}>
                <Star className="w-6 h-6 text-yellow-500 opacity-40" />
              </div>
            </div>

            {/* Bottom Right */}
            <div className="absolute bottom-20 right-32">
              <div className="animate-pulse">
                <div className="w-24 h-24 border-4 border-primary rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Application Submitted Successfully! 🎉
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-600 mb-8"
            >
              Thank you for applying to our 4-Month AI Career Program. We're excited to help you transform your career!
            </motion.p>
          </motion.div>

          {/* Next Steps Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            {/* Contact Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-2 rounded-lg mr-3">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">We'll Contact You Soon</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Our career counselor will call you within <strong>{timeUntilContact}</strong> to discuss:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  Your career goals and current situation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  Program curriculum and learning path
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  Job placement guarantee details
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  Financing options and payment plans
                </li>
              </ul>
            </div>

            {/* What to Expect */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-success">
              <div className="flex items-center mb-4">
                <div className="bg-success/10 p-2 rounded-lg mr-3">
                  <Target className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Free Consultation</h3>
              </div>
              <p className="text-gray-600 mb-4">
                This <strong>30-minute consultation</strong> is completely free and includes:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                  Personalized career roadmap
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                  Skills assessment and gap analysis
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                  Industry salary expectations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                  Program demo and Q&A session
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Program Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-r from-primary to-secondary rounded-xl text-white p-8 mb-12"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">What Makes Our Program Different</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white/20 p-4 rounded-lg mb-4 inline-block">
                  <Award className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Job Placement Guarantee</h4>
                <p className="text-sm opacity-90">98% job placement rate with starting salaries of £35K-£60K</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 p-4 rounded-lg mb-4 inline-block">
                  <Users className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Industry Mentors</h4>
                <p className="text-sm opacity-90">Learn from working professionals at top tech companies</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 p-4 rounded-lg mb-4 inline-block">
                  <Target className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Real Projects</h4>
                <p className="text-sm opacity-90">Build a portfolio with 5+ industry-standard AI projects</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Need Immediate Assistance?</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <a 
                href="mailto:support@edtechinformative.uk"
                className="flex items-center text-primary hover:text-primary-dark transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                support@edtechinformative.uk
              </a>
              <a 
                href="tel:+447520637821"
                className="flex items-center text-primary hover:text-primary-dark transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" />
                +44 7520 637 821
              </a>
            </div>
            
            <div className="mt-8">
              <Link 
                href="/"
                className="inline-flex items-center bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Return to Homepage
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>

          {/* Application Reference */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-center mt-8 text-sm text-gray-500"
          >
            <p>Application submitted on {new Date().toLocaleDateString('en-GB', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p className="mt-1">Reference: AI-{Date.now().toString().slice(-6)}</p>
          </motion.div>
        </div>
      </section>

      <Footer onApplyNow={handleApplyNow} />
      </div>{/* Close main container wrapper */}
    </main>
  );
}