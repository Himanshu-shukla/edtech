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
      question: "What programming experience do I need for this bootcamp?",
      answer: "You need basic Python knowledge and familiarity with programming concepts. We'll cover everything from AI fundamentals to advanced agent architectures. If you can write simple Python functions and understand basic coding concepts, you're ready to start building AI agents!"
    },
    {
      question: "How is this different from other AI courses?",
      answer: "Most AI courses focus on theory or basic machine learning. Our bootcamp is 100% hands-on, focusing specifically on Agentic AI - building autonomous systems that can think, plan, and act independently. You'll build 15+ real AI agents using cutting-edge frameworks like LangChain and AutoGen, not just learn about them."
    },
    {
      question: "Can I really land an AI job after just 4 months?",
      answer: "Absolutely! Our comprehensive 4-month program includes 100+ hours of hands-on practice with real-world projects, job placement assistance, and career coaching. You'll have a complete portfolio of working AI agents and deep understanding of production deployment. Our 98% placement rate speaks for itself - companies are desperately looking for practical AI skills, and our graduates are perfectly positioned to meet that demand."
    },
    {
      question: "What if I can't attend live sessions?",
      answer: "All sessions are recorded and available for lifetime access. However, we strongly recommend attending live for the interactive coding sessions, real-time Q&A, and networking with fellow AI builders. You'll also get access to our private Discord community for ongoing support."
    },
    {
      question: "What kind of AI agents will I build?",
      answer: "You'll build diverse agents including: customer support chatbots, data analysis agents, content creation systems, web scraping bots, multi-agent workflows, and production-ready applications. Each project is designed to showcase different AI capabilities you can add to your portfolio."
    },
    {
      question: "Do you provide job placement assistance?",
      answer: "Absolutely! We offer direct referrals to AI-focused companies, resume optimization for AI roles, mock interviews with AI hiring managers, and access to our exclusive job board. Our career support continues for 4 months after completion."
    },
    {
      question: "What tools and software will I need?",
      answer: "You'll need a computer with internet access. We'll provide access to all necessary AI tools, APIs, and cloud platforms during the bootcamp. You'll get free credits for OpenAI, cloud deployment platforms, and lifetime access to our custom AI development environment."
    },
    {
      question: "What career support do you provide?",
      answer: "We provide comprehensive career support including job placement assistance, resume optimization, mock interviews, and access to our exclusive network of 200+ hiring partners. Our career support continues for 4 months after program completion to ensure your success."
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
            Everything you need to know about our Agentic AI bootcamp
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
            Our team is here to help you make the right decision for your AI career.
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