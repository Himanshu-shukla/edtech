import { useState, useEffect } from "react";
import { getContactDataData } from "../utils/dataAdapter";
import type { ContactData } from "../types";
import { submitContactForm } from "../api";

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
      await submitContactForm({
        ...formData,
        source: 'contact_section'
      });
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

  if (loading || !contactData) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-bg-deep via-bg-deep to-edtech-blue/5">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="text-white/70 text-lg">Loading contact information...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-bg-deep via-bg-deep to-edtech-blue/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Contact Info & Map */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Get in <span className="text-edtech-green">Touch</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Ready to <span className="text-edtech-green font-bold">transform your career</span>? We're here to guide you every step of the way. 
                Reach out and let's discuss how we can help you <span className="text-edtech-orange font-bold">achieve your goals</span>.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid gap-6">
              {contactData.offices.map((office, index) => (
                <div key={index} className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-edtech-green/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-edtech-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{office.name}</h3>
                      <p className="text-white/70 mb-2">{office.address}</p>
                      {office.email && (
                        <p className="text-white/70 mb-1">
                          <span className="font-medium">Email:</span> 
                          <a href={`mailto:${office.email}`} className="text-edtech-green hover:text-edtech-green/80 transition-colors ml-1">
                            {office.email}
                          </a>
                        </p>
                      )}
                      <p className="text-white/70">
                        <span className="font-medium">Phone:</span> 
                        <a href={`tel:${office.phone}`} className="text-edtech-green hover:text-edtech-green/80 transition-colors ml-1">
                          {office.phone}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
              <div className="h-64 w-full">
                <iframe
                  title="Office Location"
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={contactData.mapEmbedUrl}
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-edtech-green/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            
            <div className="relative">
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Send us a Message
                </h3>
                <p className="text-white/70">
                  {contactData.responseTime}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-white/80 mb-2">Full Name *</label>
                    <input 
                      className="w-full bg-white/[0.02] border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-edtech-green focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                      placeholder="Enter your full name" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-white/80 mb-2">Email Address *</label>
                    <input 
                      className="w-full bg-white/[0.02] border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-edtech-green focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                      placeholder="Enter your email" 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-white/80 mb-2">Phone Number *</label>
                  <input 
                    className="w-full bg-white/[0.02] border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-edtech-green focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                    placeholder="Enter your phone number" 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-white/80 mb-2">Subject</label>
                  <input 
                    className="w-full bg-white/[0.02] border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-edtech-green focus:border-transparent transition-all duration-300 group-hover:border-white/30"
                    placeholder="What's this about?" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-white/80 mb-2">Message *</label>
                  <textarea 
                    className="w-full bg-white/[0.02] border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-edtech-green focus:border-transparent transition-all duration-300 group-hover:border-white/30 resize-none"
                    rows={5} 
                    placeholder="Tell us more about your inquiry..."
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button 
                  className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 ${
                    isSubmitting 
                      ? 'bg-white/20 cursor-not-allowed text-white/60' 
                      : submitStatus === 'success'
                      ? 'bg-edtech-green hover:bg-edtech-green/80 text-white'
                      : submitStatus === 'error'
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gradient-to-r from-edtech-green to-edtech-orange hover:scale-105 hover:shadow-lg text-white'
                  }`}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : submitStatus === 'success' ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Message Sent!
                    </div>
                  ) : submitStatus === 'error' ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Failed - Try Again
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Message
                    </div>
                  )}
                </button>

                {/* Success/Error Messages */}
                {submitStatus === 'success' && (
                  <div className="bg-edtech-green/10 border border-edtech-green/30 rounded-xl p-4 text-edtech-green">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Thank you for your message!</span>
                    </div>
                    <p className="text-sm mt-1 text-edtech-green/80">We'll get back to you within 24 hours.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Something went wrong!</span>
                    </div>
                    <p className="text-sm mt-1 text-red-400/80">Please try again or contact us directly.</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

