import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFAQsData } from '../utils/dataAdapter';
import type { FAQ } from '../types';
import { useContactModal } from '../contexts/ContactModalContext';

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const { openModal } = useContactModal();

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const data = await getFAQsData();
        setFAQs(data);
      } catch (error) {
        console.error('Error loading FAQs:', error);
        setFAQs([]);
      } finally {
        setLoading(false);
      }
    };

    loadFAQs();
  }, []);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const handleBookConsultation = () => {
    openModal("Book Free Consultation", "Schedule a free consultation to discuss your career goals and learning path");
  };

  return (
    <section className="py-8 md:py-12 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <div className="badge-hero mx-auto w-max mb-6">
            <span>❓</span>
            <span>FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Frequently Asked <span className="text-edtech-orange font-extrabold">Questions</span>
          </h2>
          <p className="text-white/70 max-w-4xl mx-auto text-lg leading-relaxed">
            Everything you need to know about our <span className="text-edtech-green font-bold">career transformation programs</span>
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-white/70 text-lg">Loading FAQs...</div>
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-white/70 text-lg">No FAQs available at the moment.</div>
              </div>
            ) : (
              faqs.map((faq) => (
              <div
                key={faq.id}
                className="card p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="flex w-full items-center justify-between text-left focus:outline-none group"
                >
                  <h3 className="text-lg font-semibold text-white group-hover:text-edtech-orange transition-colors pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <svg
                      className={`w-5 h-5 text-white/70 transition-transform duration-200 ${
                        openId === faq.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openId === faq.id
                      ? 'max-h-96 opacity-100 mt-4'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="text-white/80 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="card p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-white/70 mb-6">
              Our team is here to help you choose the right program for your career goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="cta cta-primary"
              >
                Contact Support
              </Link>
              <button
                onClick={handleBookConsultation}
                className="cta cta-secondary"
              >
                Book Free Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
