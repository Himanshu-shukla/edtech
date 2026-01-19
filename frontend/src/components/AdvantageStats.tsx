import { useState, useEffect } from "react";
import { getAdvantageStatsData } from "../utils/dataAdapter";
import type { AdvantageStat } from "../types";

export default function AdvantageStats() {
  const [advantageStats, setAdvantageStats] = useState<AdvantageStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdvantageStats = async () => {
      try {
        const data = await getAdvantageStatsData();
        setAdvantageStats(data);
      } catch (error) {
        console.error("Error loading advantage stats:", error);
        setAdvantageStats([]);
      } finally {
        setLoading(false);
      }
    };

    loadAdvantageStats();
  }, []);

  useEffect(() => {
    if (loading || advantageStats.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // ✅ prevent re-trigger
          }
        });
      },
      { threshold: 0.3 }
    );

    const revealElements = document.querySelectorAll(".advantage-reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, advantageStats]);

  if (loading) {
    return (
      <section className="py-20 px-4 bg-[#f4f7f1]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-gray-600 text-lg">
            Loading advantage stats...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-[#f4f7f1]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 advantage-reveal">
          <div className="badge-hero mx-auto w-max">
            <span>⚡</span>
            <span>THE EDTECH ADVANTAGE</span>
          </div>

          <h2 className="mt-6 text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="text-edtech-blue">Transform</span>,{" "}
            <span className="text-edtech-blue">excel</span>, and{" "}
            <span className="text-edtech-blue">dominate</span>.
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantageStats.length === 0 ? (
            <div className="col-span-full text-center text-gray-600">
              No stats available at the moment.
            </div>
          ) : (
            advantageStats.map((stat) => (
              <div
                key={stat.id}
                className="advantage-stat-card bg-white rounded-2xl p-6 border border-gray-200 transition-all duration-300 hover:-translate-y-1 advantage-reveal"
                data-accent={stat.accent}
              >
                <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">
                  {stat.title}
                </h3>

                <div
                  className={`text-4xl font-bold mb-2 ${
                    stat.accent === "blue"
                      ? "text-edtech-blue"
                      : stat.accent === "orange"
                      ? "text-edtech-orange"
                      : "text-edtech-green"
                  }`}
                >
                  {stat.value}
                </div>

                <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  {stat.label}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
