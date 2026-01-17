import { motion } from "framer-motion";

// --- Data ---
const companies = [
  // Tech Giants
  { name: 'Microsoft', logo: 'https://msftstories.thesourcemediaassets.com/2022/05/Microsoft-logo_rgb_c-wht-768x344.png' },
  { name: 'Google', logo: '../assets/google-1-1.svg' },
  { name: 'Apple', logo: 'https://brandfetch.com/apple.com?view=library&library=default&collection=logos&asset=idJBc9nPEf&utm_source=https%253A%252F%252Fbrandfetch.com%252Fapple.com&utm_medium=copyAction&utm_campaign=brandPageReferral' },
  { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com' },
  { name: 'Meta', logo: 'https://logo.clearbit.com/meta.com' },
  { name: 'Netflix', logo: 'https://logo.clearbit.com/netflix.com' },
  { name: 'Tesla', logo: 'https://logo.clearbit.com/tesla.com' },
  { name: 'Salesforce', logo: 'https://logo.clearbit.com/salesforce.com' },
  { name: 'Adobe', logo: 'https://logo.clearbit.com/adobe.com' },
  { name: 'Uber', logo: 'https://logo.clearbit.com/uber.com' },
  { name: 'IBM', logo: 'https://logo.clearbit.com/ibm.com' },
  
  // Financial & Others
  { name: 'JPMorgan', logo: 'https://logo.clearbit.com/jpmorganchase.com' },
  { name: 'Goldman Sachs', logo: 'https://logo.clearbit.com/goldmansachs.com' },
  { name: 'Morgan Stanley', logo: 'https://logo.clearbit.com/morganstanley.com' },
  { name: 'HSBC', logo: 'https://logo.clearbit.com/hsbc.com' },
  { name: 'Barclays', logo: 'https://logo.clearbit.com/barclays.com' },
  { name: 'BP', logo: 'https://logo.clearbit.com/bp.com' },
  { name: 'Vodafone', logo: 'https://logo.clearbit.com/vodafone.com' },
  { name: 'McKinsey', logo: 'https://logo.clearbit.com/mckinsey.com' },
  { name: 'Deloitte', logo: 'https://logo.clearbit.com/deloitte.com' },
  { name: 'Accenture', logo: 'https://logo.clearbit.com/accenture.com' },
  { name: 'Emirates', logo: 'https://logo.clearbit.com/emirates.com' },
  { name: 'Etisalat', logo: 'https://logo.clearbit.com/etisalat.ae' },
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
      {/* Gradient Masks for fade effect */}
      <div className="absolute top-0 left-0 z-10 h-full w-24 bg-gradient-to-r from-zinc-950 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 z-10 h-full w-24 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none" />
      
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
            className="relative group/card flex items-center justify-center min-w-[140px] h-20 rounded-xl bg-zinc-900/40 border border-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-800 hover:border-white/10 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <img 
              src={company.logo} 
              alt={company.name}
              className="h-8 w-auto object-contain opacity-40 grayscale transition-all duration-300 group-hover/card:grayscale-0 group-hover/card:opacity-100 group-hover/card:scale-110"
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
    <section className="relative py-24 bg-zinc-950 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-semibold text-emerald-400 mb-6"
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
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight"
          >
            Join alumni working at <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
              world-class companies
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400"
          >
            From <span className="text-white font-medium">Silicon Valley</span> to <span className="text-white font-medium">Fortune 500 firms</span>, our graduates are shaping the future of technology across the globe.
          </motion.p>
        </div>

        {/* Marquee Rows */}
        <div className="space-y-8 relative">
          {/* Vertical fade masks for the whole block */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-20 pointer-events-none" />

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
          <div className="inline-block p-[1px] rounded-2xl bg-gradient-to-r from-transparent via-zinc-700 to-transparent">
            <div className="px-8 py-4 bg-zinc-950 rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
               <p className="text-zinc-400 text-sm font-medium">
                 Trusted by over <span className="text-white font-bold">500+ Hiring Partners</span> worldwide
               </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}