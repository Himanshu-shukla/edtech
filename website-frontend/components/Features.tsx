export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="reveal">
          <h2 className="text-3xl md:text-4xl font-bold">Built for modern learners</h2>
          <p className="mt-4 text-white/70">Clean curriculum, <span className="text-edtech-green font-semibold">live mentoring</span> and a <span className="text-edtech-orange font-semibold">hands-on approach</span> that accelerates mastery.</p>
          <ul className="mt-8 space-y-3 text-white/80">
            <li className="flex gap-3"><span className="h-6 w-6 rounded-full bg-edtech-green/30 border border-edtech-green/50 inline-flex items-center justify-center">✓</span> Live, expert-led classes</li>
            <li className="flex gap-3"><span className="h-6 w-6 rounded-full bg-edtech-blue/30 border border-edtech-blue/50 inline-flex items-center justify-center">✓</span> Real projects and code reviews</li>
            <li className="flex gap-3"><span className="h-6 w-6 rounded-full bg-edtech-orange/30 border border-edtech-orange/50 inline-flex items-center justify-center">✓</span> Career prep and interview practice</li>
          </ul>
        </div>
        <div className="reveal">
          <div className="card p-8 min-h-[280px] flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="h-24 rounded-xl bg-edtech-green/20 border border-edtech-green/40" />
              <div className="h-24 rounded-xl bg-edtech-blue/20 border border-edtech-blue/40" />
              <div className="h-24 rounded-xl bg-edtech-orange/20 border border-edtech-orange/40" />
              <div className="h-24 rounded-xl bg-edtech-blue/20 border border-edtech-blue/40" />
              <div className="h-24 rounded-xl bg-edtech-orange/20 border border-edtech-orange/40" />
              <div className="h-24 rounded-xl bg-edtech-green/20 border border-edtech-green/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

