import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// import TechBackground from "../TechBackground";
import MicrosoftBadge from "../components/MicrosoftBadge";
import useRevealOnScroll from "../hooks/useRevealOnScroll";
import { useCourseEnrollmentModal } from "../contexts/CourseEnrollmentModalContext";
import { usePaymentModal } from "../contexts/PaymentModalContext";
import { useContactModal } from "../contexts/ContactModalContext";
import { getCoursePricingData, getPricingFAQ, getCourseBenefitsComparison } from "../utils/dataAdapter";
import type { CoursePricing, PricingFAQ, CourseBenefit } from "../types";

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [paymentMode, setPaymentMode] = useState<'one-time' | 'installment'>('one-time');
  const [coursePricing, setCoursePricing] = useState<CoursePricing[]>([]);
  const [faqs, setFaqs] = useState<PricingFAQ[]>([]);
  const [courseBenefits, setCourseBenefits] = useState<CourseBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const { openModal: openEnrollmentModal } = useCourseEnrollmentModal();
  const { openModal: openPaymentModal } = usePaymentModal();
  const { openModal } = useContactModal();

  useEffect(() => {
    const loadPricingData = async () => {
      try {
        const [pricingData, faqData, benefitsData] = await Promise.all([
          getCoursePricingData(),
          getPricingFAQ(),
          getCourseBenefitsComparison()
        ]);
        setCoursePricing(pricingData);
        setFaqs(faqData);
        setCourseBenefits(benefitsData);
      } catch (error) {
        console.error('Error loading pricing data:', error);
        setCoursePricing([]);
        setFaqs([]);
        setCourseBenefits([]);
      } finally {
        setLoading(false);
      }
    };

    loadPricingData();
  }, []);

  // Add scroll reveal animations
  useRevealOnScroll();

  // Initialize scroll reveal for dynamic content after data loads
  useEffect(() => {
    if (!loading && coursePricing.length > 0) {
      const timer = setTimeout(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) e.target.classList.add("visible");
            });
          },
          { threshold: 0.1 }
        );
        
        const pricingRevealElements = document.querySelectorAll('.pricing-reveal');
        pricingRevealElements.forEach((el) => observer.observe(el));
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [loading, coursePricing.length]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };



  const handleEnrollNow = (course: any, pricing: any) => {
    if (paymentMode === 'installment') {
      // Use enrollment modal for installment inquiries
      openEnrollmentModal(course.id, course.name, course.category, 'pricing-page');
    } else {
      // Use payment modal for one-time payments
      const courseObj = {
        id: course.id,
        title: course.name,
        category: course.category,
        badge: course.badge,
        desc: course.description,
        duration: course.duration,
        extra: course.extra,
        accent: course.accent
      };
      openPaymentModal(courseObj, pricing.price, 'pricing-page');
    }
  };

  // Get display price based on payment mode
  const getDisplayPrice = (course: any) => {
    if (paymentMode === 'installment') {
      return {
        price: course.installmentPrice,
        period: `/month for ${course.installmentMonths} months`,
        total: course.installmentPrice * course.installmentMonths,
        savings: course.currentPrice - (course.installmentPrice * course.installmentMonths)
      };
    }
    return {
      price: course.currentPrice,
      period: 'one-time payment',
      total: course.currentPrice,
      savings: course.originalPrice - course.currentPrice
    };
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Background */}
      {/* <div className="fixed inset-0 -z-10">
        <TechBackground className="mix-blend-screen opacity-30" />
      </div> */}
      
      <main className="pt-20">
        {/* SECTION 1: Hero Section - DARK */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-edtech-blue via-bg-deep to-edtech-blue/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          {/* <TechBackground className="opacity-15" /> */}
          
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="text-center mb-16 reveal">
              <div className="badge-hero mx-auto w-max mb-8">
                <span>💰</span><span>PROGRAM PRICING</span>
              </div>

              {/* Microsoft Partnership Badge */}
              <div className="mb-8 flex justify-center">
                <MicrosoftBadge size="lg" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-8 leading-tight">
                Invest in Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-edtech-green to-edtech-orange">Future</span> Today
              </h1>
              <p className="text-white/80 text-xl md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed">
                ✨ Ready to level up? Choose the <span className="text-edtech-green font-semibold">elite program</span> that accelerates your career growth. All programs include our 
                30-day guarantee and are designed to position you among the <span className="text-edtech-orange font-semibold">top 1%</span> in your field.
              </p>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-edtech-green mb-2">{coursePricing.length}+</div>
                  <div className="text-white/80 text-sm font-medium">Expert Programs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-edtech-orange mb-2">30</div>
                  <div className="text-white/80 text-sm font-medium">Day Guarantee</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">90%</div>
                  <div className="text-white/80 text-sm font-medium">Job Success</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-edtech-red mb-2">24/7</div>
                  <div className="text-white/80 text-sm font-medium">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: All Courses - LIGHT */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16 reveal">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our <span className="text-edtech-blue">Complete Program</span> Catalog
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                🚀 <span className="text-edtech-blue font-semibold">Next-gen programs</span> designed to <span className="text-edtech-orange font-semibold">transform your career</span> with the skills that matter most in today's market
              </p>
              
              {/* Payment Toggle */}
              <div className="flex items-center justify-center mb-16">
                <div className="bg-gray-100 p-1 rounded-full border border-gray-200">
                  <button
                    onClick={() => setPaymentMode('one-time')}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                      paymentMode === 'one-time'
                        ? 'bg-edtech-blue text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    One-time Payment
                  </button>
                  <button
                    onClick={() => setPaymentMode('installment')}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                      paymentMode === 'installment'
                        ? 'bg-edtech-blue text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Installments
                  </button>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 pricing-reveal reveal pt-12">
              {coursePricing.map((course) => {
                const pricing = getDisplayPrice(course);
                return (
                  <div 
                    key={course.id} 
                    className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-visible border-2 group h-full flex flex-col ${
                      course.highlighted 
                        ? 'border-edtech-orange shadow-2xl' 
                        : 'border-gray-100 hover:border-gray-200 hover:scale-[1.02]'
                    }`}
                  >
                    {/* Course Badge */}
                    <div className="absolute top-6 right-6 z-10">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                        course.badge === 'FEATURED' ? 'bg-red-500 text-white' :
                        course.badge === 'TRENDING' ? 'bg-edtech-green text-black' :
                        course.badge === 'MOST POPULAR' ? 'bg-edtech-orange text-black' : 
                        course.badge === 'NEW' ? 'bg-blue-500 text-white' :
                        course.badge === 'HOT' ? 'bg-red-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {course.badge}
                      </span>
                    </div>

                    {course.highlighted && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-edtech-orange text-black rounded-full text-sm font-bold shadow-lg z-20">
                        Most Popular
                      </div>
                    )}

                    <div className="p-8 flex flex-col h-full">
                      {/* Course Header - Fixed minimum height */}
                      <div className="mb-6 min-h-[180px]">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {course.category}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            course.accent === 'edtech-green' ? 'bg-edtech-green' : 
                            course.accent === 'edtech-orange' ? 'bg-edtech-orange' :
                            course.accent === 'edtech-red' ? 'bg-edtech-red' : 'bg-edtech-blue'
                          }`}></div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-edtech-blue transition-colors leading-tight min-h-[60px] flex items-start">
                          {course.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 min-h-[64px]">
                          {course.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            {course.extra}
                          </span>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="text-3xl font-bold text-gray-900">
                            £{pricing.price.toLocaleString()}
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            £{course.originalPrice.toLocaleString()}
                          </span>
                          <span className="text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                            {course.discount}
                          </span>
                        </div>
                        <div className="text-gray-600 text-sm mb-2">{pricing.period}</div>
                        
                        {paymentMode === 'installment' && (
                          <div className="text-xs text-gray-500">
                            Total: £{pricing.total.toLocaleString()} 
                            {pricing.savings > 0 && (
                              <span className="text-red-600 ml-2">
                                (£{pricing.savings} more than one-time)
                              </span>
                            )}
                          </div>
                        )}
                        
                        {paymentMode === 'one-time' && (
                          <div className="text-xs text-edtech-green font-medium">
                            Save £{pricing.savings.toLocaleString()} vs. original price
                          </div>
                        )}
                      </div>

                      {/* Key Features - Flexible height */}
                      <div className="mb-8 flex-grow">
                        <ul className="space-y-3">
                          {course.features.slice(0, 5).map((feature, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                              <svg className="w-4 h-4 text-edtech-green mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 8 8">
                                <path d="m2.3 6.73.04-.04L6.67 2.3c.4-.4 1.06-.4 1.46 0s.4 1.06 0 1.46L3.8 8.09c-.4.4-1.06.4-1.46 0L.1 5.85c-.4-.4-.4-1.06 0-1.46s1.06-.4 1.46 0l.74.74z"/>
                              </svg>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Course Actions - Fixed at bottom */}
                      <div className="space-y-3 mt-auto">
                        <button 
                          onClick={() => handleEnrollNow(course, pricing)}
                          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg ${
                            course.highlighted 
                              ? 'bg-gradient-to-r from-edtech-green to-edtech-orange text-black hover:brightness-110' 
                              : 'bg-gradient-to-r from-edtech-green to-edtech-orange text-black hover:brightness-110'
                          }`}
                        >
                          {course.cta} - {paymentMode === 'installment' ? `£${pricing.price}/mo` : `£${pricing.price}`}
                        </button>
                        <Link 
                          to={`/program/${course.id}`} 
                          className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-xl font-semibold text-center transition-all duration-300"
                        >
                          View Full Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust Section */}
            <div className="text-center mt-16">
              <div className="bg-white rounded-3xl shadow-lg p-8 max-w-3xl mx-auto border border-gray-100">
                <div className="w-16 h-16 bg-edtech-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-edtech-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">30-Day Money-Back Guarantee</h3>
                <p className="text-gray-700 leading-relaxed">
                  We're confident you'll love our programs. If you're not completely satisfied within 30 days, 
                  we'll refund your money, no questions asked. Your success is our priority.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Why Choose Us - DARK */}
        <section className="py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-deep via-bg-deep to-edtech-blue/5" />
          
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="text-center mb-16 reveal">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Choose <span className="text-edtech-green">Our Programs?</span>
              </h2>
              <p className="text-white/70 text-xl max-w-3xl mx-auto">
                🌟 Be the 1% — See how our <span className="text-edtech-green font-semibold">elite programs</span> outperform other online education platforms
              </p>
            </div>

            <div className="overflow-x-auto reveal">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="text-left p-6 font-bold text-white">Features</th>
                      <th className="text-center p-6 font-bold text-edtech-green">EdTech Informative</th>
                      <th className="text-center p-6 font-bold text-white/60">Other Platforms</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {courseBenefits.map((benefit, index) => (
                      <tr key={index} className="hover:bg-white/5 transition-colors">
                        <td className="p-6">
                          <div className="font-semibold text-white">{benefit.feature}</div>
                          <div className="text-sm text-white/60 mt-1">{benefit.description}</div>
                        </td>
                        <td className="p-6 text-center">
                          {benefit.us === true ? (
                            <svg className="w-6 h-6 text-edtech-green mx-auto" fill="currentColor" viewBox="0 0 8 8">
                              <path d="m2.3 6.73.04-.04L6.67 2.3c.4-.4 1.06-.4 1.46 0s.4 1.06 0 1.46L3.8 8.09c-.4.4-1.06.4-1.46 0L.1 5.85c-.4-.4-.4-1.06 0-1.46s1.06-.4 1.46 0l.74.74z"/>
                            </svg>
                          ) : (
                            <span className="text-edtech-green font-semibold text-sm">{benefit.us}</span>
                          )}
                        </td>
                        <td className="p-6 text-center text-white/60">
                          {benefit.others === true ? (
                            <svg className="w-6 h-6 text-edtech-green mx-auto" fill="currentColor" viewBox="0 0 8 8">
                              <path d="m2.3 6.73.04-.04L6.67 2.3c.4-.4 1.06-.4 1.46 0s.4 1.06 0 1.46L3.8 8.09c-.4.4-1.06-.4-1.46 0L.1 5.85c-.4-.4-.4-1.06 0-1.46s1.06-.4 1.46 0l.74.74z"/>
                            </svg>
                          ) : benefit.others === false ? (
                            <svg className="w-6 h-6 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          ) : (
                            <span className="text-sm font-medium">{benefit.others}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: FAQ Section - LIGHT */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center mb-16 reveal">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Frequently Asked <span className="text-edtech-orange">Questions</span>
              </h2>
              <p className="text-gray-600 text-xl leading-relaxed">
                🚀 On the <span className="text-edtech-blue font-semibold">path to excellence</span>? We have answers to <span className="text-edtech-orange font-semibold">accelerate your journey</span>. Need more guidance? 
                <button 
                  onClick={() => openModal("Get Answers", "Our team is here to help you find the perfect program and answer any questions you have about your learning journey.")}
                  className="text-edtech-orange hover:text-edtech-green transition-colors ml-1 underline underline-offset-2"
                >
                  Contact us
                </button>.
              </p>
            </div>

            <div className="space-y-4 reveal">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-300">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-6 flex items-center justify-between group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-8 group-hover:text-edtech-orange transition-colors">
                      {faq.question}
                    </h3>
                    <svg
                      className={`w-5 h-5 text-gray-500 group-hover:text-edtech-orange transition-all duration-300 ${
                        openFaq === index ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === index
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 border-t border-gray-200">
                      <p className="text-gray-700 pt-4 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: CTA Section - ENHANCED */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-edtech-blue via-bg-deep to-edtech-blue relative overflow-hidden">
          {/* <div className="absolute inset-0">
            <TechBackground className="opacity-10" />
          </div> */}
          
          <div className="relative mx-auto max-w-5xl px-6 text-center">
            <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-12 reveal">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/10 text-white border border-white/20">
                  🚀 Ready to Transform Your Career?
                </span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-edtech-green to-edtech-orange">Learning Journey</span> Today
              </h2>
              
              <p className="text-white/80 text-xl mb-8 leading-relaxed max-w-3xl mx-auto">
                🌐 From <span className="text-edtech-green font-semibold">learners to leaders</span> — join thousands who've transformed their careers with our <span className="text-edtech-orange font-semibold">expert-led programs</span>.
                Your fast-track to mastering skills that Fortune 500 companies actively seek starts here.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button 
                  onClick={() => openModal("Book FREE Strategy Call", "Schedule a personalized consultation to discuss your career goals and find the perfect program for you")}
                  className="bg-gradient-to-r from-edtech-green to-edtech-orange text-black px-8 py-4 rounded-full font-bold text-lg hover:brightness-110 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  🎯 Claim Your FREE Strategy Call
                </button>
                <Link 
                  to="/programs" 
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  💻 Browse All Programs
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="flex flex-wrap justify-center items-center gap-8 text-white/60">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-edtech-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">30-Day Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-edtech-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">Industry Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-edtech-orange" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm">4.8/5 Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">1000+ Success Stories</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>


      
      <Footer />
    </div>
  );
}
