'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface FooterProps {
  onApplyNow: () => void;
}

export default function Footer({ onApplyNow }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center p-1">
              <Image
                src="/favicon.png"
                alt="Edtech Informative Logo"
                width={20}
                height={20}
                className="w-5 h-5"
                loading="lazy"
              />
            </div>
            <span className="text-xl font-bold">Edtech Informative</span>
          </div>
          <p className="text-gray-400 mb-8">
            Master Agentic AI and transform your career with cutting-edge technology.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={onApplyNow}
            className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
          >
            Apply Now
          </motion.button>
        </div>
      </div>
    </footer>
  );
}