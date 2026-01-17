'use client';

import { motion } from 'framer-motion';
import { BookOpen, BarChart3, Database, TrendingUp, FileSpreadsheet, PieChart, Shield, ArrowRight } from 'lucide-react';

interface CourseStructureProps {
  onApplyNow: () => void;
}

export default function CourseStructure({ onApplyNow }: CourseStructureProps) {
  const topics = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "📊 Python for Data Analysis",
      description: "Master Python libraries like Pandas, NumPy, and Matplotlib. Learn data manipulation, cleaning, and analysis techniques used by professional data analysts.",
      highlight: "For Data Analysts:"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "🗄️ SQL & Database Management",
      description: "Write advanced SQL queries, join tables, aggregate data, and extract insights from relational databases. Essential skills for every data analyst role.",
      highlight: "For Data Analysts:"
    },
    {
      icon: <FileSpreadsheet className="w-8 h-8" />,
      title: "📈 Advanced Excel & Spreadsheets",
      description: "Master pivot tables, VLOOKUP, macros, and advanced formulas. Create professional dashboards and automate repetitive data tasks.",
      highlight: "For Data Analysts:",
      extra: "Build executive-level reports and dashboards that drive business decisions."
    },
    {
      icon: <PieChart className="w-8 h-8" />,
      title: "📊 Data Visualization & BI Tools",
      description: "Create stunning visualizations with Tableau, Power BI, and Python. Tell compelling data stories that influence business strategy.",
      highlight: "For Data Analysts:"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "📈 Statistical Analysis & Insights",
      description: "Apply statistical methods, hypothesis testing, and trend analysis. Turn raw data into actionable business insights and recommendations.",
      highlight: "For Data Analysts:"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "🔒 Data Ethics & Best Practices",
      description: "Learn data governance, privacy protection, and ethical analysis practices. Build trust with stakeholders through responsible data handling.",
      highlight: "For Data Analysts:"
    }
  ];

  return (
    <section id="curriculum" className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            � <span className="text-primary">DATA ANALYST CURRICULUM</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Master data analysis skills for{' '}
            <span className="font-bold text-primary">high-demand analyst roles & consulting</span>
          </p>
        </motion.div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {topics.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="text-primary mr-3 flex-shrink-0">
                  {topic.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{topic.title}</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                <span className="font-medium text-primary">{topic.highlight}</span> {topic.description}
              </p>
              {topic.extra && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {topic.extra}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              � Launch Your Data Analytics Career
            </h3>
            <p className="text-lg mb-6 text-gray-300">
              6 months of hands-on training in Python, SQL, Excel, and Tableau. 
              Learn high-demand skills with guaranteed job placement support and career acceleration.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onApplyNow}
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 text-lg rounded-lg transition-colors"
            >
              <span className="block sm:hidden">View Curriculum</span>
              <span className="hidden sm:block">View Full Curriculum</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}