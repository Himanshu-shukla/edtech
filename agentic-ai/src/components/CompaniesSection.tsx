'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CompaniesSection() {
  const companiesRow1 = [
    { name: 'Google', logoUrl: 'https://levelup.1to10x.com/wp-content/uploads/2024/11/Group-1000007278-1.png' },
    { name: 'Microsoft', logoUrl: 'https://levelup.1to10x.com/wp-content/uploads/2024/11/Group-1000007277-4-1.png' },
    { name: 'Amazon', logoUrl: 'https://levelup.1to10x.com/wp-content/uploads/2024/11/Frame-2-2-1.png' },
    { name: 'Meta', logoUrl: 'https://levelup.1to10x.com/wp-content/uploads/2024/11/Frame-2-3-1.png' },
    { name: 'Netflix', logoUrl: 'https://levelup.1to10x.com/wp-content/uploads/2024/11/Frame-2-4-1.png' },
    { name: 'Uber', logoUrl: 'https://levelup.1to10x.com/wp-content/uploads/2024/11/Frame-2-5-1.png' },
    { name: 'Adobe', logoUrl: 'https://levelup.1to10x.com/wp-content/uploads/2024/11/Frame-2-6-1.png' },
    { name: 'Salesforce', logoUrl: 'https://levelup.1to10x.com/wp-content/uploads/2024/11/Frame-2-7-1.png' },
  ];

  const companiesRow2 = [
    { name: 'Apple', logoUrl: 'https://levelup.1to10x.com/wp-content/uploads/2024/11/Frame-2-15.png' },
    { name: 'Tesla', logoUrl: 'https://levelup.1to10x.com/wp-content/uploads/2024/11/Frame-2-16.png' },
    { name: 'IBM', logoUrl: 'https://levelup.1to10x.com/wp-content/uploads/2024/11/Frame-2-17.png' },
    { name: 'Oracle', logoUrl: 'https://levelup.1to10x.com/wp-content/uploads/2024/11/Frame-2-18.png' },
    { name: 'Intel', logoUrl: 'https://levelup.1to10x.com/wp-content/uploads/2024/11/Frame-2-19.png' },
    { name: 'NVIDIA', logoUrl: 'https://levelup.1to10x.com/wp-content/uploads/2024/11/Frame-2-20.png' },
    { name: 'PayPal', logoUrl: 'https://levelup.1to10x.com/wp-content/uploads/2024/11/Frame-2-21.png' },
    { name: 'LinkedIn', logoUrl: 'https://levelup.1to10x.com/wp-content/uploads/2024/11/Frame-2-22.png' },
  ];

  // Create double arrays for seamless scrolling
  const scrollingCompaniesRow1 = [...companiesRow1, ...companiesRow1];
  const scrollingCompaniesRow2 = [...companiesRow2, ...companiesRow2];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Professionals Get Placed In Leading <br className="hidden md:block" />
            <span className="text-primary">AI & Tech Companies</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join graduates who've landed roles at top AI companies and tech giants
          </p>
        </motion.div>

        {/* Company Logos Carousel Row 1 */}
        <div className="carousel-container relative mb-8">
          <div className="flex animate-scroll space-x-6">
            {scrollingCompaniesRow1.map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-60 h-20 bg-white rounded-lg border border-gray-100 flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  width={120}
                  height={60}
                  className="max-w-full max-h-full object-contain p-2"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Company Logos Carousel Row 2 - Reverse Direction */}
        <div className="carousel-container relative">
          <div className="flex animate-scroll-reverse space-x-6">
            {scrollingCompaniesRow2.map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-60 h-20 bg-white rounded-lg border border-gray-100 flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  width={120}
                  height={60}
                  className="max-w-full max-h-full object-contain p-2"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}