'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Award, Building, Star } from 'lucide-react';

interface SocialProofNumbersProps {
  onApplyNow: () => void;
}

export default function SocialProofNumbers({ onApplyNow }: SocialProofNumbersProps) {
  // Static values to ensure consistency
  const graduatesDisplay = 847;
  const salaryDisplay = 4.8;
  const jobPlacementDisplay = 98;
  const companiesDisplay = 150;

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: graduatesDisplay,
      suffix: "+",
      label: "Professionals Placed in Jobs",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      value: salaryDisplay,
      prefix: "",
      suffix: "/5⭐",
      label: "Professional Satisfaction",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: jobPlacementDisplay,
      suffix: "%",
      label: "Income Doubled in 4 Months",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: <Building className="w-8 h-8" />,
      value: companiesDisplay,
      suffix: "+",
      label: "Hiring Partners",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const achievements = [
    "🏆 #1 Rated AI Career Program in UK",
    "⚡ 4.9/5 Average Professional Rating",
    "💼 Job Placement Guarantee",
    "🚀 85% Income Doubling Success Rate"
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-4"
          >
            <Award className="w-16 h-16 text-primary" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Real Results from <span className="text-primary">Real Professionals</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it - these numbers speak for themselves
          </p>
        </motion.div>

        {/* Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className={`${stat.bgColor} rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className={`${stat.color} mb-4 flex justify-center`}>
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                <motion.span>{stat.prefix}</motion.span>
                <motion.span>{stat.value}</motion.span>
                <motion.span>{stat.suffix}</motion.span>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-center"
              >
                <span className="text-gray-700 font-medium text-sm md:text-base">
                  {achievement}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-12 border border-green-200"
        >
          <div className="flex items-center justify-center space-x-4 text-center">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-green-500 rounded-full"
              />
              <span className="text-green-700 font-semibold text-sm md:text-base">
                🔥 23 people are viewing this page right now
              </span>
            </div>
            <div className="hidden md:block text-gray-400">•</div>
            <span className="text-gray-600 text-sm md:text-base">
              ⚡ 8 professionals enrolled in the last 24 hours
            </span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onApplyNow}
            className="bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 px-12 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 pulse-glow"
          >
            Join 950+ Successful AI Engineers
          </motion.button>
          <p className="text-gray-500 text-sm mt-4">
            💼 Job placement guarantee • 🎯 Career support • ⚡ Start immediately
          </p>
        </motion.div>
      </div>
    </section>
  );
}