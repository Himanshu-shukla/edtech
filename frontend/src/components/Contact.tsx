import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Phone, Mail, Send, User, MessageSquare, 
  Loader2, CheckCircle2, AlertCircle, Sparkles 
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { getContactDataData } from "../utils/dataAdapter";
import type { ContactData } from "../types";
import { submitContactForm } from "../api";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Sub-Components ---

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
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      rows={4}
      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300 hover:bg-zinc-900/80 resize-none"
    />
  </div>
);

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContactData = async () => {
      try {
        const data = await getContactDataData();
        setContactData(data);
      } catch (error) {
        console.error('Error loading contact data:', error);
        setContactData({
          offices: [],
          responseTime: 'We respond within 24 hours',
          mapEmbedUrl: ''
        });
      } finally {
        setLoading(false);
      }
    };
    loadContactData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await submitContactForm({ ...formData, source: 'contact_section' });
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

  if (loading) {
    return (
      <section className="py-24 bg-zinc-950 flex items-center justify-center">
        <div className="flex gap-2 text-zinc-500 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading contact info...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 bg-zinc-950 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* --- Left Column: Info & Map --- */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-emerald-400 mb-6">
                <Sparkles className="w-3 h-3" />
                <span>LET'S CONNECT</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Touch</span>
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Ready to transform your career? We're here to guide you every step of the way. 
                Reach out and let's discuss how we can help you achieve your goals.
              </p>
            </div>

            {/* Office Cards */}
            <div className="grid gap-4">
              {contactData?.offices.map((office, index) => (
                <div key={index} className="group p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm hover:bg-zinc-900/60 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-bold text-white">{office.name}</h3>
                      <p className="text-zinc-400 text-sm">{office.address}</p>
                      <div className="flex flex-wrap gap-4 pt-2 text-sm">
                        {office.email && (
                          <a href={`mailto:${office.email}`} className="flex items-center gap-2 text-zinc-300 hover:text-emerald-400 transition-colors">
                            <Mail className="w-4 h-4" /> {office.email}
                          </a>
                        )}
                        <a href={`tel:${office.phone}`} className="flex items-center gap-2 text-zinc-300 hover:text-emerald-400 transition-colors">
                          <Phone className="w-4 h-4" /> {office.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Embed */}
            {contactData?.mapEmbedUrl && (
              <div className="h-64 w-full rounded-2xl border border-zinc-800 overflow-hidden relative group">
                <iframe
                  title="Office Location"
                  className="w-full h-full grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  src={contactData.mapEmbedUrl}
                  loading="lazy"
                  allowFullScreen
                />
                <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl" />
              </div>
            )}
          </motion.div>

          {/* --- Right Column: Form --- */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-2xl relative"
          >
            {/* Form Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Send a Message</h3>
              <p className="text-zinc-500 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {contactData?.responseTime || "We respond within 24 hours"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <InputGroup
                  icon={User}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                />
                <InputGroup
                  icon={Mail}
                  name="email"
                  type="email"
                  value={formData.email}
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
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  required
                />
                <InputGroup
                  icon={MessageSquare}
                  name="subject"
                  value={formData.subject}
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
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg",
                  isSubmitting 
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                    : submitStatus === 'success'
                    ? "bg-emerald-500 text-white"
                    : submitStatus === 'error'
                    ? "bg-red-500 text-white"
                    : "bg-white text-black hover:bg-zinc-200 hover:shadow-emerald-500/10"
                )}
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

              {/* Status Messages */}
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
  );
}