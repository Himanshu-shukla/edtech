'use client';

import { motion } from 'framer-motion';
import { BarChart3, Award, TrendingUp, Database, Shield, Clock, Star, Play } from 'lucide-react';
import { VIDEO_CONFIG } from '@/config/video';

interface HeroSectionProps {
  onApplyNow: () => void;
  onWatchDemo?: () => void;
}

export default function HeroSection({ onApplyNow, onWatchDemo }: HeroSectionProps) {
  return (
    <section className=" pt-28 relative bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900 min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white/80"></div>
        <div className="absolute inset-0 overflow-hidden opacity-30 hidden md:block">
          {/* Animated Bar Chart */}
          <motion.div 
            className="absolute top-20 left-16"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="flex items-end space-x-1">
              <motion.div 
                className="w-2 h-8 bg-blue-400 rounded-sm"
                animate={{ height: [32, 40, 32] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              />
              <motion.div 
                className="w-2 h-12 bg-blue-500 rounded-sm"
                animate={{ height: [48, 56, 48] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div 
                className="w-2 h-6 bg-blue-400 rounded-sm"
                animate={{ height: [24, 32, 24] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              />
              <motion.div 
                className="w-2 h-16 bg-blue-600 rounded-sm"
                animate={{ height: [64, 72, 64] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              />
              <motion.div 
                className="w-2 h-10 bg-blue-500 rounded-sm"
                animate={{ height: [40, 48, 40] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
              />
            </div>
          </motion.div>

          {/* Animated Line Chart */}
          <motion.div 
            className="absolute top-32 right-20"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <svg width="80" height="40" className="stroke-purple-500">
              <motion.polyline 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                points="0,35 15,25 30,30 45,15 60,20 75,10"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <circle cx="0" cy="35" r="2" fill="currentColor" />
              <circle cx="15" cy="25" r="2" fill="currentColor" />
              <circle cx="30" cy="30" r="2" fill="currentColor" />
              <circle cx="45" cy="15" r="2" fill="currentColor" />
              <circle cx="60" cy="20" r="2" fill="currentColor" />
              <circle cx="75" cy="10" r="2" fill="currentColor" />
            </svg>
          </motion.div>

          {/* Spinning Chart */}
          <motion.div 
            className="absolute bottom-32 left-24"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <svg width="60" height="60">
              <circle cx="30" cy="30" r="25" fill="none" stroke="#3B82F6" strokeWidth="6" strokeDasharray="40 120" />
              <circle cx="30" cy="30" r="25" fill="none" stroke="#8B5CF6" strokeWidth="6" strokeDasharray="30 120" strokeDashoffset="-40" />
              <circle cx="30" cy="30" r="25" fill="none" stroke="#06B6D4" strokeWidth="6" strokeDasharray="50 120" strokeDashoffset="-70" />
            </svg>
          </motion.div>

          {/* Data Bars */}
          <motion.div 
            className="absolute top-1/2 left-12"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="space-y-1">
              <div className="flex space-x-1">
                <div className="w-8 h-1 bg-blue-400 rounded-full" />
                <div className="w-6 h-1 bg-blue-300 rounded-full" />
                <div className="w-10 h-1 bg-blue-500 rounded-full" />
              </div>
              <div className="flex space-x-1">
                <div className="w-6 h-1 bg-purple-400 rounded-full" />
                <div className="w-8 h-1 bg-purple-300 rounded-full" />
                <div className="w-7 h-1 bg-purple-500 rounded-full" />
              </div>
              <div className="flex space-x-1">
                <div className="w-10 h-1 bg-cyan-400 rounded-full" />
                <div className="w-5 h-1 bg-cyan-300 rounded-full" />
                <div className="w-9 h-1 bg-cyan-500 rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Dashboard Cards */}
          <motion.div 
            className="absolute bottom-20 right-16"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="space-y-2">
              <div className="w-16 h-8 border border-blue-400/50 rounded bg-white/50 backdrop-blur">
                <div className="p-1">
                  <div className="w-8 h-1 bg-blue-400 mb-1 rounded" />
                  <div className="w-12 h-1 bg-blue-300 rounded" />
                </div>
              </div>
              <div className="w-16 h-8 border border-purple-400/50 rounded bg-white/50 backdrop-blur">
                <div className="p-1">
                  <div className="w-10 h-1 bg-purple-400 mb-1 rounded" />
                  <div className="w-8 h-1 bg-purple-300 rounded" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Analytics Icon */}
          <motion.div 
            className="absolute top-3/4 right-1/3"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <BarChart3 className="w-10 h-10 text-blue-500" />
          </motion.div>

          {/* Trending Icon */}
          <motion.div 
            className="absolute top-1/4 right-1/4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TrendingUp className="w-8 h-8 text-green-500" />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 lg:px-12 pt-16 sm:pt-8 lg:pt-2 pb-8">
        <div className="text-center">
          {/* Attention Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="block bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold mb-4 shadow-lg border border-orange-400/50 max-w-fit mx-auto"
          >
            <span className="text-yellow-100">⚠️ ATTENTION:</span> Non-IT Professionals, Freshers, Graduates, Job Professionals
          </motion.div>

          {/* Certification Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-500/20 to-blue-600/30 backdrop-blur-lg text-gray-800 px-3 sm:px-6 md:px-8 py-3 sm:py-4 rounded-2xl text-sm sm:text-base font-bold mb-6 border-2 border-blue-400/50 shadow-lg shadow-blue-500/25 max-w-sm sm:max-w-none mx-auto"
          >
            <div className="flex items-center bg-white rounded-lg px-2 sm:px-3 py-1 shadow-sm">
              <div className="flex items-center">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-1 sm:mr-2" />
                <span className="text-gray-700 font-semibold text-xs sm:text-sm whitespace-nowrap">Industry Standard</span>
              </div>
            </div>
            <span className="text-blue-800 text-center whitespace-nowrap">CERTIFIED PROGRAM</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight max-w-3xl mx-auto"
          >
            <span className="text-gray-900">Build Your </span>
            <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent font-extrabold">6-Figure Career</span>
            <span className="text-gray-900"> in Data Analytics in Just 6 Months</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 max-w-3xl mx-auto"
          >
            <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light leading-relaxed">
              <span className="text-orange-600 font-semibold">Go from beginner to expert</span> in 6 months with industry-certified training. 
              <span className="text-blue-600 font-semibold"> Join 1200+ professionals who landed Data Analyst roles!</span>
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 max-w-3xl mx-auto"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/20 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative text-center">
                <div className="mb-2 sm:mb-3">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto" />
                </div>
                <div className="text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wider">Industry Certified</div>
                <div className="text-gray-800 font-bold text-xs sm:text-sm">Upon Completion</div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="group relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-600/20 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative text-center">
                <div className="mb-2 sm:mb-3">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto" />
                </div>
                <div className="text-xs font-semibold text-purple-700 mb-1 uppercase tracking-wider">6 Months</div>
                <div className="text-gray-800 font-bold text-xs sm:text-sm">Intensive Training</div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="group relative overflow-hidden bg-gradient-to-br from-green-500/10 to-green-600/20 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-green-400/30 hover:border-green-400/60 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative text-center">
                <div className="mb-2 sm:mb-3">
                  <Database className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto" />
                </div>
                <div className="text-xs font-semibold text-green-700 mb-1 uppercase tracking-wider">25+ Projects</div>
                <div className="text-gray-800 font-bold text-xs sm:text-sm">Real-World Experience</div>
              </div>
            </motion.div>
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4 mt-6"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onApplyNow}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 px-10 py-4 rounded-full font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl text-base text-center whitespace-nowrap inline-block" 
              style={{minWidth: 'max-content'}}
            >
              Book FREE Strategy Call
            </motion.button>
          </motion.div>

          {/* Rating */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 whitespace-nowrap text-sm sm:text-base">
              This course is rated as <span className="text-orange-500 font-bold">excellent</span> by 92% of the learners
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}