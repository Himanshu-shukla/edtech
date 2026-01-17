'use client';

import { motion } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface FAQSectionProps {
  onApplyNow: () => void;
}

export default function FAQSection({ onApplyNow }: FAQSectionProps) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0); // First FAQ open by default

  const faqs = [
    {
      question: "Do I need any math or programming background for data analysis?",
      answer: "Basic math skills are helpful, but not required! We start with fundamentals and build up gradually. No prior programming experience needed - we'll teach you Python from scratch specifically for data analysis. If you can use Excel comfortably, you're ready to become a data analyst."
    },
    {
      question: "How is this different from other data analysis courses?",
      answer: "Most courses are either too theoretical or only cover one tool. Our program is 100% hands-on with real business datasets. You'll master the complete data analyst toolkit: Python, SQL, Excel, Tableau, and Power BI. Plus, you'll work on real projects that mirror actual business scenarios analysts face daily."
    },
    {
      question: "Can I really get a data analyst job after 6 months?",
      answer: "Yes! Our comprehensive 6-month program includes 150+ hours of hands-on practice with real datasets, job placement assistance, and interview preparation. You'll have a complete portfolio of data analysis projects and dashboard creation skills. With 95% job placement rate, companies desperately need skilled data analysts who can turn data into actionable insights."
    },
    {
      question: "What if I can't attend live sessions?",
      answer: "All sessions are recorded and available for lifetime access. However, we strongly recommend attending live for hands-on data analysis practice, real-time Q&A, and networking with fellow analysts. You'll also get access to our private Discord community for ongoing support."
    },
    {
      question: "What kind of projects will I work on?",
      answer: "You'll work on real-world projects including: sales performance analysis, customer segmentation, financial reporting dashboards, marketing campaign analysis, inventory optimization, and business intelligence reports. Each project is designed to showcase different analytical skills employers are looking for."
    },
    {
      question: "Do you provide job placement assistance?",
      answer: "Absolutely! We offer direct referrals to companies needing data analysts, resume optimization for analyst roles, mock interviews with hiring managers, and access to our exclusive job board. Our career support continues for 6 months after completion."
    },
    {
      question: "What tools and software will I need?",
      answer: "You'll need a computer with internet access. We'll provide access to Python, SQL databases, Excel, Tableau, and Power BI during the program. You'll get free professional licenses for premium tools and lifetime access to our custom data analysis environment and datasets."
    },
    {
      question: "What career opportunities are available for data analysts?",
      answer: "Data analysts are in high demand across industries including finance, healthcare, retail, technology, and consulting. Career paths include senior analyst roles, business intelligence specialists, data scientists, and analytics managers. The demand for skilled analysts means excellent growth opportunities and job security with potential for rapid career advancement."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <HelpCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our Data Analyst Career Program
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded-xl"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openFAQ === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  {openFAQ === index ? (
                    <Minus className="w-5 h-5 text-primary" />
                  ) : (
                    <Plus className="w-5 h-5 text-primary" />
                  )}
                </motion.div>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openFAQ === index ? "auto" : 0,
                  opacity: openFAQ === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our team is here to help you make the right decision for your data analyst career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onApplyNow}
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors"
            >
              Apply Now & Get Started
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:support@edtechinformative.uk"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Contact Support
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}