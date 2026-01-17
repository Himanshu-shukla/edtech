'use client';

import { motion } from 'framer-motion';
import { Play, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { VIDEO_CONFIG } from '@/config/video';

interface VideoSectionProps {
  onApplyNow: () => void;
}

export default function VideoSection({ onApplyNow }: VideoSectionProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  // Don't render anything if video is not enabled
  if (!VIDEO_CONFIG.enabled) {
    return null;
  }

  return (
    <section id="demo" className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_70%)]"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2 mb-6"
          >
            <Play className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">Watch Demo</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Get A <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Sneak Peek</span> Into The Program
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Watch how our 4-month comprehensive program helps professionals land high-paying AI jobs and build successful freelancing businesses. 
            See professional success stories, income transformations, and exclusive program insights.
          </p>

          {/* Video Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 shadow-sm"
            >
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-gray-700 font-medium">{VIDEO_CONFIG.duration}</span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 shadow-sm"
            >
              <Users className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 font-medium">{VIDEO_CONFIG.views}</span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 shadow-sm"
            >
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700 font-medium">{VIDEO_CONFIG.rating}</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-200">
            {/* Video Embed */}
            <div className="relative aspect-video">
              {!isVideoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleVideoLoad}
                    className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg hover:shadow-primary/25 transition-shadow"
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </motion.button>
                </div>
              )}
              
              {isVideoLoaded && VIDEO_CONFIG.url && (
                <iframe
                  src={VIDEO_CONFIG.url}
                  title="AI Bootcamp Demo"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Video Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-800 font-semibold text-lg mb-1">{VIDEO_CONFIG.title}</h3>
                  <p className="text-gray-600 text-sm">{VIDEO_CONFIG.description}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onApplyNow}
                  className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-shadow flex items-center space-x-2"
                >
                  <span>Join Now</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Video Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 mt-12"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-gray-800 font-semibold mb-2">Program USPs & Benefits</h4>
              <p className="text-gray-600 text-sm">Discover what makes our program unique and effective</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-gray-800 font-semibold mb-2">Income Transformation Stories</h4>
              <p className="text-gray-600 text-sm">See how professionals doubled their income in 4 months</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-secondary to-warning rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-gray-800 font-semibold mb-2">Job & Freelance Success</h4>
              <p className="text-gray-600 text-sm">Real testimonials from job placements and freelancers</p>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 text-lg mb-6">
            Ready to start your AI transformation journey?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onApplyNow}
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-primary/25 transition-all flex items-center space-x-2 mx-auto pulse-glow"
          >
            <span>Secure Your Spot Today</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}