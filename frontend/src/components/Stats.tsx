import { useState, useEffect } from "react";
import { getCompanyInfoData } from "../utils/dataAdapter";
import type { CompanyInfo } from "../types";

export default function Stats() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const data = await getCompanyInfoData();
        setCompanyInfo(data);
      } catch (error) {
        console.error('Error loading company info:', error);
        setCompanyInfo({ 
          whatsappNumber: '', 
          supportEmail: '', 
          heroRoles: [], 
          carouselRoles: [], 
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

  // Initialize scroll reveal animation after stats are loaded
  useEffect(() => {
    if (!loading && companyInfo && companyInfo.marketingStats.length > 0) {
      const timer = setTimeout(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) e.target.classList.add("visible");
            });
          },
          { threshold: 0.1 }
        );
        
        const statsElements = document.querySelectorAll('.stats-reveal');
        statsElements.forEach((el) => observer.observe(el));
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [loading, companyInfo]);

  if (loading || !companyInfo || companyInfo.marketingStats.length === 0) {
    return (
      <section id="stats" className="py-24 md:py-28 bg-black/30">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="text-white/70">Loading stats...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="stats" className="py-24 md:py-28 bg-black/30">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {companyInfo.marketingStats.map((stat) => (
          <div key={stat.label} className="stats-reveal reveal">
            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-edtech-green to-edtech-blue drop-shadow" style={{ WebkitTextStroke: '2px rgba(255,255,255,.8)' }}>{stat.number}</div>
            <div className="mt-2 text-white/70">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

