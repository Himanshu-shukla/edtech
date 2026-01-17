import LazyTypewriter from "./LazyTypewriter";
import LazyGlobe from "./LazyGlobe";
// import TechBackground from "../TechBackground";
import RoleCarousel from "./RoleCarousel";
import { useState, useEffect } from "react";
import { getCompanyInfoData } from "../utils/dataAdapter";
import type { CompanyInfo } from "../types";

export default function Hero( { onApplyNow }: { onApplyNow: () => void } ) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const data = await getCompanyInfoData();
        setCompanyInfo(data);
      } catch (error) {
        console.error('Error loading company info:', error);
        // Fallback data
        setCompanyInfo({
          whatsappNumber: '',
          supportEmail: '',
          heroRoles: ['Build', 'Learn', 'Grow'],
          carouselRoles: ['Developer', 'Designer', 'Engineer'],
          marketingStats: [],
          whatsappQuickMessages: [],
          pricingFaq: [],
          courseBenefitsComparison: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadCompanyInfo();
  }, []);

  if (loading || !companyInfo) {
    return (
      <header className="relative min-h-[600px] h-[90vh] max-h-[800px] lg:max-h-none lg:h-screen flex items-center justify-center overflow-hidden pt-20 scroll-mt-24">
        <div className="text-white text-xl">Loading...</div>
      </header>
    );
  }

  return (
    <header className="relative min-h-[600px] h-[90vh] max-h-[800px] lg:max-h-none lg:h-screen flex items-center overflow-hidden pt-20 scroll-mt-24">
      {/* Background Layer - Animated Tech Elements */}
      {/* <div className="absolute inset-0 -z-20">
        <TechBackground className="mix-blend-screen" />
      </div> */}
      
      {/* Globe positioned CENTER on mobile, LEFT with padding on medium+ screens */}
      <div className="absolute inset-0 md:left-8 md:top-8 md:w-1/2 h-full flex items-center justify-center -z-10">
        <LazyGlobe className="w-[650px] h-[650px] md:w-[500px] md:h-[500px] lg:w-[650px] lg:h-[650px]" />
      </div>
      
      {/* Role Carousel positioned on RIGHT side as background - hidden on small screens */}
      <div className="absolute right-8 md:right-12 lg:right-16 xl:right-50 top-0 w-1/2 h-full items-center justify-end hidden md:flex -z-10">
        <RoleCarousel rolesList={companyInfo.carouselRoles} interval={3000} />
      </div>
      
      {/* Gradient overlays for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-edtech-blue/30 via-transparent to-edtech-blue/30 -z-5" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-deep/60 -z-5" />
      
      {/* Main Content Container - Text overlaid on LEFT side over the earth */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:pl-16 lg:pl-16 xl:pl-16 w-full h-full flex items-center">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <div className="h-[120px] sm:h-[140px] lg:h-[160px] flex items-start justify-center md:justify-start mb-6">
            <h1 className=" text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-wide leading-tight">
              <LazyTypewriter
                options={{
                  strings: companyInfo.heroRoles,
                  autoStart: true,
                  loop: true,
                  delay: 40,
                  deleteSpeed: 20,
                  cursor: '<span class="cursor-neon">|</span>'
                }}
              />
            </h1>
          </div>
          <p className="text-white/95 text-lg md:text-xl  mb-8 max-w-2xl md:max-w-none">
         🌐 <span className="text-edtech-green font-semibold">Learn what matters</span>, <span className="text-edtech-orange font-semibold">achieve what you dream</span> — your future in tech starts here.

          </p>
          <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
            <button onClick={onApplyNow} className="cta cta-primary">Get Started</button>
            <button onClick={onApplyNow} className="cta cta-secondary">Talk to us</button>
          </div>
        </div>
      </div>
    </header>
  );
}

