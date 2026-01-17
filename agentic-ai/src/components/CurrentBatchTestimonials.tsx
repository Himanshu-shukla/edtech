'use client';

import { motion } from 'framer-motion';
import { Star, Calendar, Users } from 'lucide-react';
import Image from 'next/image';

export default function CurrentBatchTestimonials() {
  const currentBatchTestimonials = [
    {
      name: "James Mitchell",
      role: "Product Manager @ TechCorp",
      image: "https://randomuser.me/api/portraits/men/83.jpg",
      testimonial: "Just completed week 8! The agentic AI frameworks are already transforming my product roadmaps. Built my first AI agent for feature prioritization.",
      batchWeek: "Week 8",
      progress: 75
    },
    {
      name: "Sophie Chen",
      role: "Senior PM @ FinanceStart",
      image: "/female_1.jpg",
      testimonial: "Halfway through the program and loving it! The hands-on approach helps me implement AI solutions immediately in my day-to-day work.",
      batchWeek: "Week 12",
      progress: 90
    },
    {
      name: "David Kumar",
      role: "AI Product Lead @ SaaS Company",
      image: "https://randomuser.me/api/portraits/men/76.jpg",
      testimonial: "Week 6 update: Already deployed 2 AI agents in production. The instructor feedback is incredibly valuable for real-world applications.",
      batchWeek: "Week 6",
      progress: 60
    },
    {
      name: "Emma Thompson",
      role: "Product Strategy @ E-commerce",
      image: "/female_2.jpg",
      testimonial: "Amazing progress in just 10 weeks! The community support and practical exercises make complex AI concepts easy to understand and apply.",
      batchWeek: "Week 10",
      progress: 85
    },
    {
      name: "Alex Rodriguez",
      role: "Technical PM @ AI Startup",
      image: "/male_1.jpg",
      testimonial: "Week 4 reflection: The course structure is perfect for working professionals. I'm building AI solutions that my team actually uses daily.",
      batchWeek: "Week 4",
      progress: 40
    },
    {
      name: "Priya Sharma",
      role: "Product Owner @ Healthcare Tech",
      image: "/female_3.jpg",
      testimonial: "Current batch is incredible! Week 14 and I've successfully integrated 3 AI agents into our product workflow. Results speak for themselves.",
      batchWeek: "Week 14",
      progress: 95
    }
  ];

  const batchStats = [
    { label: "Active Learners", value: "47", icon: Users },
    { label: "Current Week", value: "Week 8", icon: Calendar },
    { label: "Avg Progress", value: "75%", icon: Star }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-green-100 rounded-full px-4 py-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Live Updates from Current Batch</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Real-Time Progress from <span className="text-primary">January 2025 Batch</span>
          </h2>
          <p className="text-lg text-gray-600">
            See what our current students are achieving week by week
          </p>
        </motion.div>

        {/* Batch Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto"
        >
          {batchStats.map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-xl p-4 shadow-md">
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentBatchTestimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Progress Badge */}
              <div className="absolute top-4 right-4">
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                  {testimonial.batchWeek}
                </div>
              </div>

              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <div className="text-base font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-warning mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                "{testimonial.testimonial}"
              </p>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Course Progress</span>
                  <span>{testimonial.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${testimonial.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want to Join the Next Batch?
            </h3>
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-orange-600">7 seats left</span> out of 50
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 mt-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300"
              >
                Secure Your Seat Now
              </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
