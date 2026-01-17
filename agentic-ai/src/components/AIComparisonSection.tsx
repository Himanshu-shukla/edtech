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
            <span className="text-red-600">95% of Professionals will be replaced by AI.</span><br />
            The rest will become <span className="text-primary">irreplaceable.</span>
          </h2>
          <p className="text-xl text-gray-700 font-medium">
            Agentic AI is not optional—it's your <span className="font-bold text-primary">competitive advantage</span>
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
                Professionals Without Agentic AI
              </h3>
            </div>
            <ul className="space-y-2 sm:space-y-3 text-slate-700">
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-red-500 mr-3 flex-shrink-0">❌</span>
                <span>Manual PRD creation & analysis</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-red-500 mr-3 flex-shrink-0">❌</span>
                <span>Time-consuming user research</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-red-500 mr-3 flex-shrink-0">❌</span>
                <span>Reactive decision making</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-red-500 mr-3 flex-shrink-0">❌</span>
                <span>Limited scalability & impact</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-red-500 mr-3 flex-shrink-0">❌</span>
                <span>Risk of AI disruption</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-red-500 mr-3 flex-shrink-0">❌</span>
                <span>Falling behind competition</span>
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
                Agentic AI-Powered Professionals
              </h3>
            </div>
            <ul className="space-y-2 sm:space-y-3 text-slate-700">
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-green-500 mr-3 flex-shrink-0">✅</span>
                <span>AI agents automate research & specs</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-green-500 mr-3 flex-shrink-0">✅</span>
                <span>Real-time market intelligence</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-green-500 mr-3 flex-shrink-0">✅</span>
                <span>Predictive product insights</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-green-500 mr-3 flex-shrink-0">✅</span>
                <span>15x faster execution</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-green-500 mr-3 flex-shrink-0">✅</span>
                <span>AI-native leadership skills</span>
              </li>
              <li className="flex items-center text-sm sm:text-base">
                <span className="text-green-500 mr-3 flex-shrink-0">✅</span>
                <span>Future-proof career trajectory</span>
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
              This bootcamp teaches you:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="text-center">
                <h4 className="font-bold text-blue-300 mb-2 text-sm sm:text-base">
                  Agentic Frameworks
                </h4>
                <p className="text-xs sm:text-sm">
                  LangChain, AutoGen, Multi-agent systems
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-green-300 mb-2 text-sm sm:text-base">
                  AI Product Strategy
                </h4>
                <p className="text-xs sm:text-sm">
                  Build, deploy & scale AI products
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-purple-300 mb-2 text-sm sm:text-base">
                  Production Systems
                </h4>
                <p className="text-xs sm:text-sm">
                  Enterprise deployment & monetization
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onApplyNow}
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 text-lg rounded-lg transition-all duration-300 hover:shadow-xl"
            >
              Master Agentic AI Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
