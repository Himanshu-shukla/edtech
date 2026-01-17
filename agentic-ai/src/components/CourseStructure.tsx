'use client';

import { motion } from 'framer-motion';
import { BookOpen, Brain, Target, Zap, Code, Lightbulb, Shield, ArrowRight } from 'lucide-react';

interface CourseStructureProps {
  onApplyNow: () => void;
}

export default function CourseStructure({ onApplyNow }: CourseStructureProps) {
  const topics = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Module 1 - Foundations of Agentic AI",
      description: "Introduction to Agentic AI, Python for development, LLM fundamentals & prompt engineering, and LangChain basics. Build your first sales assistant agent.",
      highlight: "Week 1-4:",
      extra: "Capstone Project: Sales Assistant Agent with Python + OpenAI + LangChain"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Module 2 - Advanced Agent Development",
      description: "Agent tools & function calling, memory management, RAG systems, and multi-agent frameworks with AutoGen. Create knowledge management systems.",
      highlight: "Week 5-8:",
      extra: "Capstone Project: Knowledge Management System with RAG + Multi-Agent workflows"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Module 3 - Production AI Systems",
      description: "CrewAI orchestration, advanced LangChain & LCEL, API development with FastAPI, and cloud deployment strategies for scalable AI systems.",
      highlight: "Week 9-12:",
      extra: "Capstone Project: Production AI Service with cloud deployment and monitoring"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Module 4 - Professional Applications",
      description: "Domain-specific AI applications, enterprise integration patterns, portfolio development, and career acceleration strategies for AI professionals.",
      highlight: "Week 13-16:",
      extra: "Final Capstone: End-to-end client project in Finance, Marketing, HR, or Operations"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Master Industry Tools",
      description: "Hands-on experience with Python, LangChain, OpenAI API, AutoGen, CrewAI, FastAPI, Vector Databases, and Docker deployment.",
      highlight: "Throughout Course:",
      extra: "Learn advanced techniques and industry workflows that employers value most"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Real-World Projects",
      description: "Build 4+ production-ready AI agents including customer service bots, content generation systems, and enterprise automation solutions.",
      highlight: "Portfolio Ready:",
      extra: "Complete with case studies, documentation, and measurable business impact results"
    }
  ];

  return (
    <section id="curriculum" className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Master Agentic AI in <span className="text-primary">4 Powerful Modules</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Each module transforms your skills and unlocks new capabilities. Build production-ready AI agents that solve{' '}
            <span className="font-bold text-primary">real business problems</span>
          </p>
        </motion.div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {topics.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="text-primary mr-3 flex-shrink-0">
                  {topic.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{topic.title}</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                <span className="font-medium text-primary">{topic.highlight}</span> {topic.description}
              </p>
              {topic.extra && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {topic.extra}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              Build the Future with Agentic AI
            </h3>
            <p className="text-lg mb-6 text-gray-300">
              16 weeks of comprehensive training covering foundations to advanced deployment. 
              Master the most in-demand AI agent development skills with hands-on projects and expert guidance.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onApplyNow}
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 text-lg rounded-lg transition-colors"
            >
              <span className="block sm:hidden">View Curriculum</span>
              <span className="hidden sm:block">View Full Curriculum</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}