import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactSection from "../components/Contact";
// import TechBackground from "../TechBackground";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Background */}
      {/* <div className="fixed inset-0 -z-10">
        <TechBackground className="mix-blend-screen opacity-30" />
      </div> */}
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-edtech-blue via-bg-deep to-edtech-blue/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          {/* <TechBackground className="opacity-15" /> */}
          
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <div className="badge-hero mx-auto w-max mb-8">
              <span>💬</span><span>GET IN TOUCH</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight">
              Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-edtech-green to-edtech-orange">Conversation</span>
            </h1>
            <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              ✨ Ready to level up? Have questions about our <span className="text-edtech-green font-semibold">industry-leading programs</span>? 
              We're here to <span className="text-edtech-orange font-semibold">fast-track your career</span> with personalized guidance every step of the way.
            </p>
            
            {/* Quick Contact Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-edtech-green text-2xl font-bold mb-2">&lt; 1 Hour</div>
                <div className="text-white/80 text-sm">🚀 Lightning-Fast Response</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-edtech-orange text-2xl font-bold mb-2">24/7</div>
                <div className="text-white/80 text-sm">🌟 Round-the-Clock Support</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-edtech-green text-2xl font-bold mb-2">98%</div>
                <div className="text-white/80 text-sm">🌟 Elite Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </section>
        
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}