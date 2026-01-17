import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, X, ChevronDown, CreditCard, Calendar, 
  Sparkles, ShieldCheck, Zap, HelpCircle, ArrowRight 
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MicrosoftBadge from "../components/MicrosoftBadge";
import { useCourseEnrollmentModal } from "../contexts/CourseEnrollmentModalContext";
import { usePaymentModal } from "../contexts/PaymentModalContext";
import { useContactModal } from "../contexts/ContactModalContext";
import { getCoursePricingData, getPricingFAQ, getCourseBenefitsComparison } from "../utils/dataAdapter";
import type { CoursePricing, PricingFAQ, CourseBenefit } from "../types";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Sub-Components ---

const FaqItem = ({ faq, isOpen, onClick }: { faq: PricingFAQ, isOpen: boolean, onClick: () => void }) => (
  <div className="border-b border-zinc-800 last:border-0">
    <button
      onClick={onClick}
      className="w-full py-6 flex items-center justify-between text-left group"
    >
      <span className={cn("text-lg font-medium transition-colors", isOpen ? "text-white" : "text-zinc-400 group-hover:text-white")}>
        {faq.question}
      </span>
      <ChevronDown className={cn("w-5 h-5 text-zinc-500 transition-transform duration-300", isOpen && "rotate-180 text-orange-400")} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <p className="pb-6 text-zinc-400 leading-relaxed">
            {faq.answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [paymentMode, setPaymentMode] = useState<'one-time' | 'installment'>('one-time');
  const [coursePricing, setCoursePricing] = useState<CoursePricing[]>([]);
  const [faqs, setFaqs] = useState<PricingFAQ[]>([]);
  const [courseBenefits, setCourseBenefits] = useState<CourseBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { openModal: openEnrollmentModal } = useCourseEnrollmentModal();
  const { openModal: openPaymentModal } = usePaymentModal();
  const { openModal: openContactModal } = useContactModal();

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
      } finally {
        setLoading(false);
      }
    };
    loadPricingData();
  }, []);

  const handleEnrollNow = (course: any, pricing: any) => {
    if (paymentMode === 'installment') {
      openEnrollmentModal(course.id, course.name, course.category, 'pricing-page');
    } else {
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

  const getDisplayPrice = (course: any) => {
    if (paymentMode === 'installment') {
      return {
        price: course.installmentPrice,
        period: `/month (${course.installmentMonths} mo)`,
        total: course.installmentPrice * course.installmentMonths,
        savings: course.currentPrice - (course.installmentPrice * course.installmentMonths)
      };
    }
    return {
      price: course.currentPrice,
      period: 'one-time',
      total: course.currentPrice,
      savings: course.originalPrice - course.currentPrice
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-orange-500 rounded-full animate-spin" />
          <span className="text-zinc-500 text-sm animate-pulse">Calculating Best Value...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-orange-500/30">
      <Navbar />
      
      <main className="pt-20">
        
        {/* --- HERO SECTION --- */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Backgrounds */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-6 text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-orange-400 mb-8">
                <Sparkles className="w-3 h-3" />
                <span>PROGRAM PRICING</span>
              </div>
              
              <div className="mb-8 flex justify-center transform hover:scale-105 transition-transform duration-300">
                <MicrosoftBadge size="lg" />
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
                Invest in Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-orange-400">Future</span> Today
              </h1>
              
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-16 leading-relaxed">
                Choose the <span className="text-white font-medium">elite program</span> that accelerates your career growth. 
                All programs include our 30-day guarantee.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
                {[
                  { value: `${coursePricing.length}+`, label: "Programs", color: "text-emerald-400" },
                  { value: "30", label: "Day Guarantee", color: "text-orange-400" },
                  { value: "90%", label: "Job Success", color: "text-white" },
                  { value: "24/7", label: "Mentor Support", color: "text-red-400" }
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm">
                    <div className={cn("text-3xl font-bold mb-1", stat.color)}>{stat.value}</div>
                    <div className="text-xs text-zinc-500 font-bold uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- PRICING SECTION --- */}
        <section className="relative py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            
            {/* Toggle Switch */}
            <div className="flex justify-center mb-16">
              <div className="relative bg-zinc-900/80 p-1.5 rounded-full border border-zinc-800 flex shadow-xl backdrop-blur-sm">
                <button
                  onClick={() => setPaymentMode('one-time')}
                  className={cn(
                    "relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 flex items-center gap-2",
                    paymentMode === 'one-time' ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <CreditCard className="w-4 h-4" /> One-time
                </button>
                <button
                  onClick={() => setPaymentMode('installment')}
                  className={cn(
                    "relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 flex items-center gap-2",
                    paymentMode === 'installment' ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <Calendar className="w-4 h-4" /> Monthly
                </button>
                
                {/* Sliding Background */}
                <motion.div
                  className="absolute top-1.5 bottom-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full shadow-lg"
                  initial={false}
                  animate={{
                    left: paymentMode === 'one-time' ? '6px' : '50%',
                    width: paymentMode === 'one-time' ? '135px' : '130px',
                    x: paymentMode === 'one-time' ? 0 : 4
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
            </div>

            {/* Pricing Grid */}
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {coursePricing.map((course) => {
                const pricing = getDisplayPrice(course);
                const isHighlight = course.highlighted;

                return (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={cn(
                      "relative flex flex-col p-8 rounded-3xl bg-zinc-900/40 border backdrop-blur-sm transition-all duration-300",
                      isHighlight 
                        ? "border-orange-500/50 shadow-[0_0_40px_-10px_rgba(249,115,22,0.2)] bg-zinc-900/60 scale-100 lg:scale-105 z-10" 
                        : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60"
                    )}
                  >
                    {isHighlight && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1.5">
                        <Zap className="w-3 h-3 fill-white" /> Most Popular
                      </div>
                    )}

                    {/* Header */}
                    <div className="mb-6">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                          {course.category}
                        </span>
                        {course.badge && (
                          <span className={cn(
                             "text-[10px] font-bold px-2 py-1 rounded-full",
                             course.badge === 'HOT' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                          )}>
                            {course.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{course.name}</h3>
                      <p className="text-sm text-zinc-400 line-clamp-2 h-10">{course.description}</p>
                    </div>

                    {/* Price Tag */}
                    <div className="mb-8 p-6 rounded-2xl bg-zinc-950/50 border border-zinc-800/50 text-center">
                       <div className="flex items-center justify-center gap-2 mb-1">
                         <span className="text-4xl font-bold text-white tracking-tight">£{pricing.price.toLocaleString()}</span>
                       </div>
                       <div className="text-sm text-zinc-500 font-medium mb-3">{pricing.period}</div>
                       
                       {paymentMode === 'one-time' && (
                         <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                           Save £{pricing.savings.toLocaleString()}
                         </div>
                       )}
                       
                       {paymentMode === 'installment' && (
                         <div className="text-xs text-zinc-600">
                           Total: £{pricing.total.toLocaleString()}
                         </div>
                       )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8 flex-1">
                      {course.features.slice(0, 5).map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                           <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                           <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Actions */}
                    <div className="space-y-3 mt-auto">
                      <button 
                        onClick={() => handleEnrollNow(course, pricing)}
                        className={cn(
                          "w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:scale-[1.02]",
                          isHighlight 
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-900/20" 
                            : "bg-white text-black hover:bg-zinc-200"
                        )}
                      >
                        {course.cta}
                      </button>
                      <Link 
                        to={`/program/${course.id}`} 
                        className="block w-full py-3 rounded-xl text-sm font-semibold text-center text-zinc-400 hover:text-white transition-colors"
                      >
                        View Full Details
                      </Link>
                    </div>

                  </motion.div>
                );
              })}
            </div>

            {/* Guarantee Box */}
            <div className="mt-20 flex justify-center">
              <div className="max-w-2xl w-full p-1 rounded-3xl bg-gradient-to-r from-zinc-800 to-zinc-900">
                <div className="bg-zinc-950 rounded-[22px] p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">30-Day Money-Back Guarantee</h3>
                    <p className="text-zinc-400 text-sm">
                      We're confident you'll love our programs. If you're not completely satisfied within 30 days, we'll refund your money, no questions asked.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- COMPARISON TABLE --- */}
        <section className="py-20 bg-zinc-900/30 border-y border-white/5">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Choose <span className="text-emerald-400">EdTech?</span>
              </h2>
              <p className="text-zinc-400 text-lg">See how we stack up against the rest.</p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left p-6 font-bold text-zinc-300 w-1/3">Features</th>
                    <th className="text-center p-6 w-1/3">
                      <div className="inline-block px-4 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-bold border border-emerald-500/20">
                        EdTech Informative
                      </div>
                    </th>
                    <th className="text-center p-6 font-bold text-zinc-500 w-1/3">Other Platforms</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {courseBenefits.map((benefit, index) => (
                    <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-6">
                        <div className="font-semibold text-zinc-200">{benefit.feature}</div>
                        <div className="text-xs text-zinc-500 mt-1">{benefit.description}</div>
                      </td>
                      <td className="p-6 text-center">
                        {benefit.us === true ? (
                          <div className="flex justify-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                              <Check className="w-5 h-5 text-emerald-500" />
                            </div>
                          </div>
                        ) : (
                          <span className="text-emerald-400 font-bold">{benefit.us}</span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {benefit.others === true ? (
                          <Check className="w-5 h-5 text-zinc-600 mx-auto" />
                        ) : benefit.others === false ? (
                           <div className="flex justify-center">
                             <X className="w-5 h-5 text-zinc-600" />
                           </div>
                        ) : (
                          <span className="text-zinc-500 font-medium text-sm">{benefit.others}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section className="py-20 md:py-32">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-blue-400 mb-6">
                <HelpCircle className="w-3 h-3" />
                <span>COMMON QUESTIONS</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Frequently Asked <span className="text-orange-400">Questions</span>
              </h2>
            </div>

            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <FaqItem 
                  key={index} 
                  faq={faq} 
                  isOpen={openFaq === index} 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)} 
                />
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-zinc-500">
                Still have questions? 
                <button 
                  onClick={() => openContactModal("Get Answers", "I have questions about pricing")}
                  className="text-white hover:text-emerald-400 font-medium ml-1 transition-colors underline underline-offset-4"
                >
                  Chat with our team
                </button>
              </p>
            </div>
          </div>
        </section>

        {/* --- CTA --- */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-zinc-950 to-orange-900/20" />
          
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 rounded-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-xl shadow-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-orange-400">Level Up?</span>
              </h2>
              
              <p className="text-zinc-300 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of students who have transformed their careers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => openContactModal("Book Strategy Call", "Pricing Page CTA")}
                  className="group relative overflow-hidden px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Book Strategy Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
                </button>
                
                <Link 
                  to="/programs" 
                  className="px-8 py-4 rounded-full border border-zinc-700 text-white font-medium hover:bg-zinc-800 transition-colors"
                >
                  Browse Programs
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}