'use client';

import { motion } from 'framer-motion';
import { Code, Users, Award, Target, Clock, Calendar } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Real Data Projects",
      description: "Work on 15+ real-world data analysis projects including sales analysis, customer segmentation, and financial reporting using Excel, Python, and SQL."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Industry Expert Mentors",
      description: "Learn from data professionals working at top companies like Amazon, Netflix, Google, and leading financial institutions."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Data Analyst Job Guarantee",
      description: "95% placement rate in data analyst roles with guaranteed job support and direct referrals to data-driven companies."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Learning",
      description: "Adaptive curriculum that adjusts to your pace with 1:1 mentoring sessions and personalized project feedback."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexible Schedule",
      description: "Full-time intensive or part-time options to fit your lifestyle and work commitments."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Lifetime Access",
      description: "Get lifetime access to course materials, dataset updates, and our data professional alumni network."
    }
  ];

  return (
    <section id="features" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-primary">Edtech Informative?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our comprehensive Data Analyst Career Program is designed to take you from beginner to data professional
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}