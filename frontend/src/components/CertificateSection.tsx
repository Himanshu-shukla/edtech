import { motion } from 'framer-motion';
import { Award, CheckCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import certificate1 from '../assets/certificate1.webp';
import certificate2 from '../assets/certificate2.webp';
import certificate3 from '../assets/certificate3.webp';

interface CertificateSectionProps {
  onApplyNow: () => void;
}

export default function CertificateSection({ onApplyNow }: CertificateSectionProps) {
  // Certificate images array
  const certificates = [
    { id: 1, src: certificate1, alt: 'Professional Certificate 1' },
    { id: 2, src: certificate2, alt: 'Professional Certificate 2' },
    { id: 3, src: certificate3, alt: 'Professional Certificate 3' }
  ];

  const [currentCertificate, setCurrentCertificate] = useState(0);

  const nextCertificate = () => {
    setCurrentCertificate((prev) => (prev + 1) % certificates.length);
  };

  const prevCertificate = () => {
    setCurrentCertificate((prev) => (prev - 1 + certificates.length) % certificates.length);
  };

  return (
    <section className="py-10 bg-white overflow-hidden">
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
              className="inline-flex items-center space-x-2 bg-edtech-blue/10 rounded-full px-4 py-2 mb-6"
            >
              <Award className="w-4 h-4 text-edtech-blue" />
              <span className="text-sm font-medium text-edtech-blue">Industry-Recognized Certification</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">Get Your </span>
              <span className="text-edtech-blue">Professional</span>
              <span className="text-gray-900"> Certificate</span>
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              Upon successful completion of our comprehensive programs, you'll receive an 
              industry-recognized certificate that validates your expertise and demonstrates 
              your commitment to professional development.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-edtech-blue flex-shrink-0" />
                <span className="text-gray-700">Verified completion of expert-led training</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-edtech-blue flex-shrink-0" />
                <span className="text-gray-700">Hands-on project portfolio with real-world applications</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-edtech-blue flex-shrink-0" />
                <span className="text-gray-700">Showcase your skills to top employers</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-edtech-blue flex-shrink-0" />
                <span className="text-gray-700">LinkedIn-shareable digital certificate</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onApplyNow}
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-edtech-red to-edtech-orange text-black rounded-full font-bold text-lg hover:brightness-110 transition-all hover:shadow-xl"
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
            {/* Certificate Image Carousel */}
            <div className="relative">
              {/* Certificate Image */}
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                <img
                  src={certificates[currentCertificate].src}
                  alt={certificates[currentCertificate].alt}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>

              {/* Navigation Buttons */}
              {certificates.length > 1 && (
                <>
                  <button
                    onClick={prevCertificate}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-edtech-blue p-3 rounded-full shadow-lg transition-all hover:scale-110"
                    aria-label="Previous certificate"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextCertificate}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-edtech-blue p-3 rounded-full shadow-lg transition-all hover:scale-110"
                    aria-label="Next certificate"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {certificates.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {certificates.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCertificate(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentCertificate
                          ? 'bg-edtech-blue w-8'
                          : 'bg-white/60 hover:bg-white/80'
                      }`}
                      aria-label={`Go to certificate ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-edtech-orange text-black rounded-full p-4 shadow-lg"
            >
              <Award className="w-8 h-8" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}