import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, Clock, Star, Sparkles, ArrowDown, 
  MapPin, Phone, Mail, Send, User, MessageSquare, 
  Loader2, CheckCircle2, AlertCircle 
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { submitContactForm } from "../api";

// --- Sub-Components (Inlined to prevent import errors) ---

const InputGroup = ({ 
  icon: Icon, 
  name, 
  value, 
  onChange, 
  placeholder, 
  type = "text", 
  required = false 
}: any) => (
  <div className="relative group">
    <div className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors duration-300">
      <Icon className="w-5 h-5" />
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300 hover:bg-zinc-900/80"
    />
  </div>
);

const TextAreaGroup = ({ name, value, onChange, placeholder, required }: any) => (
  <div className="relative group">
    <div className="absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors duration-300">
      <MessageSquare className="w-5 h-5" />
    </div>
    <textarea
      name={name}
      value={value ?? ""}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      rows={4}
      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300 hover:bg-zinc-900/80 resize-none"
    />
  </div>
);

export default function ContactPage() {
  // --- Form State ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await submitContactForm({ ...formData, source: 'contact_page' });
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setIsSubmitting(false);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  // --- Stats Data ---
  const stats = [
    { 
      icon: Clock, 
      value: "< 1 Hour", 
      label: "Avg. Response Time", 
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    },
    { 
      icon: Sparkles, 
      value: "24/7", 
      label: "Global Support", 
      color: "text-orange-400",
      bg: "bg-orange-500/10"
    },
    { 
      icon: Star, 
      value: "98%", 
      label: "Satisfaction Rate", 
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-orange-500/30">
      <Navbar />
      
      <main className="pt-20">
        
        {/* --- HERO SECTION --- */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          
          {/* Background Atmosphere */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-orange-400 mb-8"
            >
              <MessageCircle className="w-3 h-3" />
              <span>GET IN TOUCH</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight"
            >
              Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Conversation</span>
            </motion.h1>

            {/* Subhead */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-16"
            >
              Have questions about our <span className="text-white font-medium">industry-leading programs</span>? 
              We're here to fast-track your career with personalized guidance.
            </motion.p>
            
            {/* Quick Contact Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  className="group relative p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Visual Arrow indicating scroll to form */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-16 flex justify-center"
            >
              <div className="p-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-500 animate-bounce">
                <ArrowDown className="w-5 h-5" />
              </div>
            </motion.div>

          </div>
        </section>
        
        {/* --- FORM SECTION --- */}
        <div className="-mt-12 relative z-20 pb-20">
          <section className="relative py-12">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                
                {/* Left Column: Info & Map */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
                  {/* Office Cards */}
                  <div className="group p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm hover:bg-zinc-900/60 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-bold text-white">Main Headquarters</h3>
                        <p className="text-zinc-400 text-sm">123 Tech Boulevard, Silicon Valley, CA 94025</p>
                        <div className="flex flex-wrap gap-4 pt-2 text-sm">
                          <a href="mailto:support@edtech.com" className="flex items-center gap-2 text-zinc-300 hover:text-emerald-400 transition-colors">
                            <Mail className="w-4 h-4" /> support@edtech.com
                          </a>
                          <a href="tel:+1234567890" className="flex items-center gap-2 text-zinc-300 hover:text-emerald-400 transition-colors">
                            <Phone className="w-4 h-4" /> +1 (234) 567-890
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map Embed */}
                  <div className="h-64 w-full rounded-2xl border border-zinc-800 overflow-hidden relative group">
                    <iframe
                      title="Office Location"
                      className="w-full h-full grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555098464!2d-122.507640204439!3d37.757814996609724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1647000000000!5m2!1sen!2sus"
                      loading="lazy"
                      allowFullScreen
                    />
                    <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl" />
                  </div>
                </motion.div>

                {/* Right Column: Form */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-2xl relative"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

                  <div className="mb-8">
                    {/* THIS WAS THE LIKELY SOURCE OF THE PREVIOUS ERROR (H2 Component) */}
                    <h2 className="text-2xl font-bold text-white mb-2">Send a Message</h2>
                    <p className="text-zinc-500 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      We respond within 24 hours
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <InputGroup
                        icon={User}
                        name="name"
                        value={formData.name ?? ""}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        required
                      />
                      <InputGroup
                        icon={Mail}
                        name="email"
                        type="email"
                        value={formData.email ?? ""}
                        onChange={handleInputChange}
                        placeholder="Email Address"
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <InputGroup
                        icon={Phone}
                        name="phone"
                        type="tel"
                        value={formData.phone ?? ""}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        required
                      />
                      <InputGroup
                        icon={MessageSquare}
                        name="subject"
                        value={formData.subject ?? ""}
                        onChange={handleInputChange}
                        placeholder="Subject"
                      />
                    </div>

                    <TextAreaGroup
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="How can we help you?"
                      required
                    />

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                        isSubmitting 
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                          : submitStatus === 'success'
                          ? "bg-emerald-500 text-white"
                          : submitStatus === 'error'
                          ? "bg-red-500 text-white"
                          : "bg-white text-black hover:bg-zinc-200 hover:shadow-emerald-500/10"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                        </>
                      ) : submitStatus === 'success' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Message Sent!
                        </>
                      ) : submitStatus === 'error' ? (
                        <>
                          <AlertCircle className="w-4 h-4" /> Failed. Try Again.
                        </>
                      ) : (
                        <>
                          Send Message <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <AnimatePresence>
                      {submitStatus === 'success' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-emerald-400 text-sm flex items-start gap-3"
                        >
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold">Message sent successfully!</p>
                            <p className="opacity-80">We'll get back to you shortly.</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </motion.div>

              </div>
            </div>
          </section>
        </div>

      </main>
      <Footer />
    </div>
  );
}