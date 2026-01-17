'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Ananya Singh",
      role: "AI Product Manager @ SaaS",
      image: "/female_6.jpg",
      testimonial: "The agentic frameworks were super actionable. I automated PRD drafting and saved hours this week."
    },
    {
      name: "Rohit Verma",
      role: "Senior PM @ Fintech",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      testimonial: "Agent workflows demo was a game-changer. We rolled out an AI pilot within a week."
    },
    {
      name: "Maya Kapoor",
      role: "Group PM @ Marketplace",
      image: "/female_4.jpg",
      testimonial: "Life-changing 4-month program. The comprehensive training helped me master agentic AI architecture and land my dream job."
    },
    {
      name: "Mohd. Faraz",
      role: "Senior PM @ Mobility",
      image: "https://randomuser.me/api/portraits/men/56.jpg",
      testimonial: "Great balance of AI strategy and hands-on—perfect for non-coding PMs entering AI space."
    },
    {
      name: "Prathibha Agarwal",
      role: "PM @ HealthTech",
      image: "https://randomuser.me/api/portraits/women/89.jpg",
      testimonial: "Walked away with a concrete roadmap for adding agentic AI to our Q4 backlog."
    },
    {
      name: "Tushar Tyagi",
      role: "Lead PM @ EdTech",
      image: "https://randomuser.me/api/portraits/men/34.jpg",
      testimonial: "AI tool stack section was gold—I knew exactly what LangChain tools to try on Monday."
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Learners Say
          </h2>
          <p className="text-lg text-gray-600">
            Real outcomes from previous Agentic AI sessions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="text-base font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-warning mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              
              <p className="text-sm text-gray-700 leading-relaxed">
                "{testimonial.testimonial}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}