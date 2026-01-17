'use client';

import { motion } from 'framer-motion';
import { Clock, Users, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface UrgencyScarcityProps {
  onApplyNow: () => void;
}

export default function UrgencyScarcity({ onApplyNow }: UrgencyScarcityProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 33,
    seconds: 45
  });

  const [seatsLeft] = useState(7); // Simulated scarcity

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50 border-t-4 border-warning">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-warning/20"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center space-x-2 bg-warning/10 rounded-full px-6 py-2 mb-4"
            >
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span className="text-warning font-bold text-sm">LIMITED TIME OFFER</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🔥 <span className="text-warning">Early Bird Registration</span> Ends Soon!
            </h2>
            <p className="text-lg text-gray-600">
              Limited spots available - secure your place with exclusive early bird benefits
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center md:justify-start">
                <Clock className="w-6 h-6 text-warning mr-2" />
                Offer Expires In:
              </h3>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Min', value: timeLeft.minutes },
                  { label: 'Sec', value: timeLeft.seconds }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    animate={{ scale: item.label === 'Sec' ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 1, repeat: item.label === 'Sec' ? Infinity : 0 }}
                    className="bg-gradient-to-br from-warning to-orange-500 text-white rounded-lg p-4 text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold">
                      {item.value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm opacity-90">{item.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center md:justify-start text-red-600 mb-2">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Only {seatsLeft} Seats Left!</span>
                </div>
                <p className="text-red-600 text-sm">
                  23 people viewed this page in the last hour. Don't miss out!
                </p>
              </div>
            </motion.div>

            {/* Pricing */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Early Bird Benefits</h3>
                
                <div className="mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-4xl font-bold text-warning">Exclusive Access</span>
                  </div>
                  <p className="text-green-400 font-semibold">Limited Time Registration</p>
                </div>

                <div className="space-y-3 mb-8 text-left">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-warning mr-3 flex-shrink-0" />
                    <span>6-Month Comprehensive Program</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-warning mr-3 flex-shrink-0" />
                    <span>Job Placement Assistance</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-warning mr-3 flex-shrink-0" />
                    <span>Freelancing Business Setup</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-warning mr-3 flex-shrink-0" />
                    <span>Priority Support Access</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-warning mr-3 flex-shrink-0" />
                    <span>Industry Certificate</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onApplyNow}
                  className="w-full bg-warning hover:bg-orange-500 text-white font-bold py-5 px-10 rounded-full text-xl transition-colors pulse-glow"
                >
                  Reserve My Spot Now
                  <ArrowRight className="inline ml-2 w-5 h-5" />
                </motion.button>
                
                <p className="text-gray-400 text-sm mt-4">
                  🎯 Expert guidance • 🚀 Career acceleration • ⭐ Premium resources
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}