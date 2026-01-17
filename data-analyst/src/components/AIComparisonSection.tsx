'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface AIComparisonSectionProps {
  onApplyNow: () => void;
}

export default function AIComparisonSection({ onApplyNow }: AIComparisonSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className=" max-w-6xl mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            <span className="text-red-600">80% of Data Analysts will be automated.</span><br />
            The rest will become <span className="text-primary">indispensable.</span>
          </h2>
          <p className="text-xl text-gray-700 font-medium">
            AI-powered analytics is not optional—it's your <span className="font-bold text-primary">survival strategy</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
          {/* Without AI Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg border-l-4 border-red-500"
          >
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-red-600 text-xl sm:text-2xl">😰</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-red-600 mb-2">
                Traditional Data Analyst
              </h3>
            </div>
            <ul className="space-y-2 sm:space-y-3 text-slate-700">
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-red-500 mr-3 flex-shrink-0">❌</span>
                <span>Manual data cleaning & processing</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-red-500 mr-3 flex-shrink-0">❌</span>
                <span>Time-consuming report generation</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-red-500 mr-3 flex-shrink-0">❌</span>
                <span>Limited to basic visualizations</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-red-500 mr-3 flex-shrink-0">❌</span>
                <span>Reactive insights only</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-red-500 mr-3 flex-shrink-0">❌</span>
                <span>Risk of job automation</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-red-500 mr-3 flex-shrink-0">❌</span>
                <span>Stuck with repetitive tasks</span>
              </li>
            </ul>
          </motion.div>

          {/* With AI Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg border-l-4 border-green-500"
          >
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-green-600 text-xl sm:text-2xl">🚀</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 mb-2">
                AI-Powered Data Analyst
              </h3>
            </div>
            <ul className="space-y-2 sm:space-y-3 text-slate-700">
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-green-500 mr-3 flex-shrink-0">✅</span>
                <span>Automated data pipelines & cleaning</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-green-500 mr-3 flex-shrink-0">✅</span>
                <span>AI-generated insights & predictions</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-green-500 mr-3 flex-shrink-0">✅</span>
                <span>Advanced ML-powered visualizations</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-green-500 mr-3 flex-shrink-0">✅</span>
                <span>10x faster analysis delivery</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-green-500 mr-3 flex-shrink-0">✅</span>
                <span>AI-augmented decision making</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-green-500 mr-3 flex-shrink-0">✅</span>
                <span>Strategic business impact</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-slate-900 p-4 sm:p-6 md:p-8 rounded-xl text-white">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">
              This program teaches you:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="text-center">
                <h4 className="font-bold text-blue-300 mb-2 text-sm sm:text-base">
                  Python + AI Libraries
                </h4>
                <p className="text-xs sm:text-sm">
                  Pandas, NumPy, Scikit-learn, ChatGPT API
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-green-300 mb-2 text-sm sm:text-base">
                  Automated Analytics
                </h4>
                <p className="text-xs sm:text-sm">
                  AI-powered dashboards & reporting
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-purple-300 mb-2 text-sm sm:text-base">
                  Predictive Modeling
                </h4>
                <p className="text-xs sm:text-sm">
                  Machine learning & forecasting
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onApplyNow}
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 text-lg rounded-lg transition-all duration-300 hover:shadow-xl"
            >
              Become AI-Powered Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
