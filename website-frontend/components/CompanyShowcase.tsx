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
      {/* Theme Update: Deep Black (#020604) Fade Masks */}
      <div className="absolute top-0 left-0 z-10 h-full w-32 bg-gradient-to-r from-[#020604] to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 z-10 h-full w-32 bg-gradient-to-l from-[#020604] to-transparent pointer-events-none" />

      <motion.div
        initial={{ x: direction === "left" ? 0 : "-50%" }}
        animate={{ x: direction === "left" ? "-50%" : 0 }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
        className="flex gap-10 py-4 flex-shrink-0 group-hover:[animation-play-state:paused]"
      >
        {/* Duplicated for smooth infinite scrolling */}
        {[...items, ...items, ...items, ...items].map((company, idx) => (
          <div
            key={`${company.name}-${idx}`}
            // Theme Update: Hover brings out a subtle emerald border and background
            className="relative group/card flex items-center justify-center min-w-[140px] h-20 rounded-lg transition-all duration-500 hover:bg-emerald-900/10 hover:border-emerald-500/30 border border-transparent"
          >
            <img
              src={company.logo}
              alt={company.name}
              // High-end logo treatment: heavily desaturated, low opacity. 
              // Returns to full color and opacity very smoothly on hover.
              className="h-7 w-auto object-contain transition-all duration-500 grayscale opacity-40 group-hover/card:grayscale-0 group-hover/card:opacity-100"
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
    // Theme Update: Background transparent to inherit parent #020604, border changed to subtle emerald
    <section className="relative py-16 bg-transparent overflow-hidden font-sans border-y border-emerald-500/10">
      {/* Theme Update: Glowing emerald atmospheric lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            // Theme Update: Emerald badge styling
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[10px] sm:text-xs font-medium text-emerald-400 mb-8 tracking-[0.2em] uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
            Global Alumni Network
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            // Theme Update: White primary text with Emerald highlight
            className="text-3xl md:text-5xl font-semibold text-white mb-6 tracking-tight leading-tight"
          >
            Our graduates drive innovation at <br className="hidden md:block" />
            <span className="text-emerald-400">
              industry-leading organizations
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            // Theme Update: Slate-gray text with bright white highlights
            className="text-base md:text-lg text-gray-400 font-light max-w-2xl mx-auto"
          >
            From <span className="text-white font-normal">Silicon Valley</span> to <span className="text-white font-normal">Fortune 500 firms</span>, we place top-tier talent where it matters most.
          </motion.p>
        </div>

        {/* Marquee Rows */}
        <div className="space-y-6 relative z-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="flex flex-col gap-4"
          >
            <Marquee items={row1} direction="left" speed={35} />
            <Marquee items={row2} direction="right" speed={40} />
            <Marquee items={row3} direction="left" speed={45} />
          </motion.div>
        </div>

        {/* Bottom Stat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center relative z-20"
        >
          {/* Theme Update: Emerald gradient lines and highlights */}
          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-500/40"></div>
            <p className="text-gray-400 text-xs md:text-sm font-light tracking-wide uppercase">
              Trusted by <span className="text-emerald-400 font-medium">500+ Hiring Partners</span> Worldwide
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-500/40"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}