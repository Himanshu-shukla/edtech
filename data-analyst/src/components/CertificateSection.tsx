'use client';

import { motion } from 'framer-motion';
import { Award, CheckCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface CertificateSectionProps {
  onApplyNow: () => void;
}

export default function CertificateSection({ onApplyNow }: CertificateSectionProps) {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6"
            >
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Industry-Recognized Certification</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Get Your </span>
              <span className="text-primary">Data Analytics Professional</span>
              <span className="text-foreground"> Certificate</span>
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              Upon successful completion of our 6-month comprehensive program, you'll receive an 
              industry-recognized certificate that validates your expertise in data analysis, 
              Python, SQL, and business intelligence tools.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-gray-700">Verified completion of 150+ hours of data analytics training</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-gray-700">Hands-on project portfolio with real business data</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-gray-700">Showcase your skills to top data-driven companies</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-gray-700">LinkedIn-shareable digital certificate</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onApplyNow}
              className="inline-flex items-center px-10 py-5 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-dark transition-colors hover:shadow-xl"
            >
              Earn Your Certificate
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Right Certificate Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border-4 border-primary/20">
              {/* Certificate Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Image
                    src="/favicon.png"
                    alt="Edtech Informative"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                    loading="lazy"
                  />
                  <h3 className="text-xl font-bold text-primary">Edtech Informative</h3>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-4"></div>
                <h4 className="text-2xl font-bold text-foreground mb-2">Certificate of Completion</h4>
                <p className="text-gray-600 text-sm">This certifies that</p>
              </div>

              {/* Certificate Body */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary mb-2">Oliver Richardson</div>
                <p className="text-gray-700 mb-4">has successfully completed the</p>
                <div className="bg-primary/10 rounded-lg p-4 mb-4">
                  <h5 className="text-xl font-bold text-primary mb-2">
                    Data Analytics Professional Program
                  </h5>
                  <p className="text-sm text-gray-600">
                    6-Month Career Program • 150+ Hours • Real-World Projects
                  </p>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Demonstrating proficiency in Python, SQL, Excel, Tableau, and statistical analysis
                </p>
              </div>

              {/* Certificate Footer */}
              <div className="flex justify-between items-end text-xs text-gray-500">
                <div>
                  <div className="w-20 h-px bg-gray-300 mb-1"></div>
                  <p>Date: 18 January 2025</p>
                </div>
                <div className="text-right">
                  <div className="w-20 h-px bg-gray-300 mb-1 ml-auto"></div>
                  <p>Verification ID: #DA-CERT2025</p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30"></div>
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-warning text-white rounded-full p-4 shadow-lg"
            >
              <Award className="w-8 h-8" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}