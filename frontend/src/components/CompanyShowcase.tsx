// Company logos data
const companies = [
  // Tech Giants
  { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com' },
  { name: 'Google', logo: 'https://logo.clearbit.com/google.com' },
  { name: 'Apple', logo: 'https://logo.clearbit.com/apple.com' },
  { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com' },
  { name: 'Meta', logo: 'https://logo.clearbit.com/meta.com' },
  { name: 'Netflix', logo: 'https://logo.clearbit.com/netflix.com' },
  { name: 'Tesla', logo: 'https://logo.clearbit.com/tesla.com' },
  { name: 'Salesforce', logo: 'https://logo.clearbit.com/salesforce.com' },
  { name: 'Adobe', logo: 'https://logo.clearbit.com/adobe.com' },
  { name: 'Uber', logo: 'https://logo.clearbit.com/uber.com' },
  { name: 'IBM', logo: 'https://logo.clearbit.com/ibm.com' },
  
  // Financial Services
  { name: 'JPMorgan Chase', logo: 'https://logo.clearbit.com/jpmorganchase.com' },
  { name: 'Goldman Sachs', logo: 'https://logo.clearbit.com/goldmansachs.com' },
  { name: 'Morgan Stanley', logo: 'https://logo.clearbit.com/morganstanley.com' },
  { name: 'HSBC', logo: 'https://logo.clearbit.com/hsbc.com' },
  { name: 'Barclays', logo: 'https://logo.clearbit.com/barclays.com' },
  
  // Energy & Infrastructure
  { name: 'BP', logo: 'https://logo.clearbit.com/bp.com' },
  { name: 'Vodafone', logo: 'https://logo.clearbit.com/vodafone.com' },
  { name: 'Rolls-Royce', logo: 'https://logo.clearbit.com/rolls-royce.com' },
  { name: 'BT Group', logo: 'https://logo.clearbit.com/bt.com' },
  
  // Consulting
  { name: 'McKinsey', logo: 'https://logo.clearbit.com/mckinsey.com' },
  { name: 'Deloitte', logo: 'https://logo.clearbit.com/deloitte.com' },
  { name: 'PwC', logo: 'https://logo.clearbit.com/pwc.com' },
  { name: 'Accenture', logo: 'https://logo.clearbit.com/accenture.com' },
  
  // Regional Companies
  { name: 'Emirates', logo: 'https://logo.clearbit.com/emirates.com' },
  { name: 'Etisalat', logo: 'https://logo.clearbit.com/etisalat.ae' },
  { name: 'DP World', logo: 'https://logo.clearbit.com/dpworld.com' },
  { name: 'ADNOC', logo: 'https://logo.clearbit.com/adnoc.ae' }
];

export default function CompanyShowcase() {
  // Create multiple sets for seamless scrolling
  const firstRow = [...companies.slice(0, 10), ...companies.slice(0, 10), ...companies.slice(0, 10)];
  const secondRow = [...companies.slice(10, 20), ...companies.slice(10, 20), ...companies.slice(10, 20)];
  const thirdRow = [...companies.slice(20), ...companies.slice(20), ...companies.slice(20)];

  return (
    <>
      <section className="py-10 px-4 bg-bg-deep">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-hero mx-auto w-max">
              <span>🚀 </span>
              <span>YOUR GATEWAY TO GLOBAL CAREERS</span>
            </div>
            <h2 className="mt-6 text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Explore the top companies employing our <span className="text-edtech-orange font-extrabold">alumni</span>
            </h2>
            <p className="text-white/80 max-w-3xl mx-auto font-semibold">
            From <span className="text-edtech-green font-bold">Silicon Valley</span> to <span className="text-edtech-orange font-bold">Fortune 500 firms</span>, our graduates are shaping industries worldwide. Join the community that turns potential into global success.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* First Row - Left to Right */}
            <div className="overflow-hidden whitespace-nowrap">
              <div className="inline-flex py-1 animate-scroll-left gap-8">
                {firstRow.map((company, index) => (
                  <div key={`${company.name}-${index}`} className="flex-shrink-0">
                    <div className="company-card">
                      <img 
                        src={company.logo} 
                        alt={company.name}
                        className="company-logo"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Second Row - Right to Left */}
            <div className="overflow-hidden whitespace-nowrap">
              <div className="inline-flex py-1 animate-scroll-right gap-8">
                {secondRow.map((company, index) => (
                  <div key={`${company.name}-${index}`} className="flex-shrink-0">
                    <div className="company-card">
                      <img 
                        src={company.logo} 
                        alt={company.name}
                        className="company-logo"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Third Row - Left to Right */}
            <div className="overflow-hidden whitespace-nowrap">
              <div className="inline-flex py-1 animate-scroll-left-slow gap-8">
                {thirdRow.map((company, index) => (
                  <div key={`${company.name}-${index}`} className="flex-shrink-0">
                    <div className="company-card">
                      <img 
                        src={company.logo} 
                        alt={company.name}
                        className="company-logo"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
