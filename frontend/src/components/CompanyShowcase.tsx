import { motion } from "framer-motion";

// --- Data ---
const companies = [
  // Tech Giants
  { name: 'Microsoft', logo: '../assets/microsoft.png' },
  { name: 'Google', logo: '../assets/google.png' },
  { name: 'Apple', logo: '../assets/apple.png' },
  { name: 'Amazon', logo: '../assets/amazon.png' },
  { name: 'Meta', logo: '../assets/Meta.webp' },
  { name: 'Netflix', logo: '../assets/netflix.png' },
  { name: 'Tesla', logo: '../assets/tesla.png' },
  { name: 'Salesforce', logo: '../assets/salesforce.png' },
  { name: 'Adobe', logo: '../assets/adobe.png' },
  { name: 'Uber', logo: '../assets/uber.png' },
  { name: 'IBM', logo: '../assets/ibm.png' },
  
  // Financial & Others
  { name: 'JPMorgan', logo: '../assets/jpmorgan.png' },
  { name: 'Goldman Sachs', logo: '../assets/goldman.png' },
  { name: 'Morgan Stanley', logo: '../assets/MorganStanley.png' },
  { name: 'HSBC', logo: '../assets/HSBC.png' },
  { name: 'Barclays', logo: '../assets/barclays.png' },
  { name: 'BP', logo: '../assets/bp.png' },
  { name: 'Vodafone', logo: '../assets/Vodafone.png' },
  { name: 'McKinsey', logo: '../assets/McKinsey.png' },
  { name: 'Deloitte', logo: '../assets/Deloitte.png' },
  { name: 'Accenture', logo: '../assets/accenture.png' },
  { name: 'Emirates', logo: '../assets/emirates.png' },
  { name: 'Etisalat', logo: '../assets/Etisalat.png' },
];

// --- Sub-Component: Infinite Marquee ---
const Marquee = ({ 
  items, 
  direction = "left", 
  speed = 20 
}: { 
  items: typeof companies, 
  direction?: "left" | "right", 
  speed?: number 
}) => {
  return (
    <div className="relative flex overflow-hidden group">
      {/* Gradient Masks for fade effect - Updated to Light Theme (Slate-50) */}
      <div className="absolute top-0 left-0 z-10 h-full w-24 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 z-10 h-full w-24 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
      
      <motion.div
        initial={{ x: direction === "left" ? 0 : "-50%" }}
        animate={{ x: direction === "left" ? "-50%" : 0 }}
        transition={{ 
          duration: speed, 
          ease: "linear", 
          repeat: Infinity,
        }}
        className="flex gap-8 py-4 flex-shrink-0 group-hover:[animation-play-state:paused]"
      >
        {/* We duplicate the items 4 times to ensure smooth infinite scroll on wide screens */}
        {[...items, ...items, ...items, ...items].map((company, idx) => (
          <div 
            key={`${company.name}-${idx}`} 
            // Light Theme Card: White bg, slate border, soft shadow
            className="relative group/card flex items-center justify-center min-w-[140px] h-20 rounded-xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:bg-white hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <img 
              src={company.logo} 
              alt={company.name}
              className="h-8 w-auto object-contain transition-all duration-300 group-hover/card:scale-110"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function CompanyShowcase() {
  // Split companies into rows
  const row1 = companies.slice(0, 8);
  const row2 = companies.slice(8, 16);
  const row3 = companies.slice(16);

  return (
    // Light Theme Background: slate-50
    <section className="relative py-12 bg-slate-50 overflow-hidden">
      {/* Background Decor - Adjusted opacity for light mode */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            // Light Theme Badge: White bg, slate border, darker text
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-emerald-600 mb-6 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            YOUR GATEWAY TO GLOBAL CAREERS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            // Light Theme Heading: Slate-900
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight"
          >
            Join alumni working at <br className="hidden md:block" />
            {/* Gradient darkened slightly for contrast against white */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">
              world-class companies
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            // Light Theme Text: Slate-500
            className="text-lg text-slate-500"
          >
            From <span className="text-slate-900 font-semibold">Silicon Valley</span> to <span className="text-slate-900 font-semibold">Fortune 500 firms</span>, our graduates are shaping the future of technology across the globe.
          </motion.p>
        </div>

        {/* Marquee Rows */}
        <div className="space-y-8 relative">
          {/* Vertical fade masks - Updated to Slate-50 */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none" />
          
          <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
             className="flex flex-col gap-6"
          >
            <Marquee items={row1} direction="left" speed={30} />
            <Marquee items={row2} direction="right" speed={35} />
            <Marquee items={row3} direction="left" speed={40} />
          </motion.div>
        </div>

        {/* Bottom Stat */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          {/* Border Wrapper: Slate-300 */}
          <div className="inline-block p-[1px] rounded-2xl bg-gradient-to-r from-transparent via-slate-300 to-transparent">
            {/* Inner Content: White bg */}
            <div className="px-8 py-4 bg-white rounded-2xl relative overflow-hidden shadow-sm">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
               <p className="text-slate-500 text-sm font-medium">
                 Trusted by over <span className="text-slate-900 font-bold">500+ Hiring Partners</span> worldwide
               </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}