'use client';

import { motion } from 'framer-motion';
import { Award, Building, Users, Star, Linkedin } from 'lucide-react';
import Image from 'next/image';

interface InstructorCredibilityProps {
  onApplyNow: () => void;
}

export default function InstructorCredibility({ onApplyNow }: InstructorCredibilityProps) {
  const instructors = [
    {
      name: "Dr. Sarah Chen",
      title: "Former Senior Data Scientist at Netflix",
      image: "/instructor_female.jpg",
      experience: "8+ years",
      companies: ["Netflix", "Amazon", "Google"],
      expertise: "Data Science & Business Intelligence",
      linkedin: "#",
      achievements: [
        "Built recommendation systems for 200M+ users",
        "Led Netflix's personalization analytics",
        "Increased user engagement by 35%"
      ]
    },
    {
      name: "Marcus Rodriguez",
      title: "Lead Business Intelligence Engineer at Microsoft",
      image: "/instructor_male.jpg",
      experience: "6+ years",
      companies: ["Microsoft", "Tableau", "Spotify"],
      expertise: "SQL, Python & Data Visualization",
      linkedin: "#",
      achievements: [
        "Built analytics for Office 365 (300M+ users)",
        "Created executive dashboards for C-suite",
        "Speaker at 15+ data conferences"
      ]
    },
    {
      name: "Dr. Priya Patel",
      title: "Data Analytics Consultant & Ex-McKinsey",
      image: "/female_5.jpg",
      experience: "10+ years",
      companies: ["McKinsey", "Deloitte", "Own Consultancy"],
      expertise: "Statistical Analysis & Strategy",
      linkedin: "#",
      achievements: [
        "Advised Fortune 500 on data strategy",
        "Delivered $50M+ cost savings through analytics",
        "Trained 200+ analysts across industries"
      ]
    }
  ];

  const stats = [
    { number: "50+", label: "Combined Years Experience" },
    { number: "500M+", label: "Users Impacted by Their Analytics" },
    { number: "15+", label: "Major Companies Served" },
    { number: "200+", label: "Analysts Trained" }
  ];

  return (
    <section id="instructors" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Award className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Learn from <span className="text-primary">Data Industry Leaders</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our instructors aren't just teachers - they're the data professionals who built the analytics systems 
            driving decisions at Netflix, Amazon, Microsoft, and Fortune 500 companies.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Instructors */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {instructors.map((instructor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Profile */}
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={instructor.image}
                    alt={instructor.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover shadow-lg"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {instructor.name}
                </h3>
                <p className="text-primary font-semibold mb-2">
                  {instructor.title}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  {instructor.expertise} • {instructor.experience}
                </p>
              </div>

              {/* Companies */}
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Previously at:</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {instructor.companies.map((company, idx) => (
                    <span
                      key={idx}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-2">
                {instructor.achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <Star className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{achievement}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Get Direct Access to Industry Experts
          </h3>
          <p className="text-lg mb-6 opacity-90">
            These aren't online course creators - they're the data professionals who actually build 
            analytics systems used by millions. Learn their exact frameworks and methodologies.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onApplyNow}
            className="bg-white text-primary font-bold py-5 px-10 rounded-full text-xl hover:bg-gray-100 transition-colors hover:shadow-xl"
          >
            Learn from the Best - Apply Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}