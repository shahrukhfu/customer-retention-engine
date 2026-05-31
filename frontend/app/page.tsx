import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-surface-container-lowest font-sans text-on-surface selection:bg-primary/30 relative min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-16 py-8 backdrop-blur-xl bg-surface-container-lowest/80 border-b border-outline-variant shadow-sm transition-all duration-300">
        <div className="flex items-center gap-md">
          <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            crisis_alert
          </span>
          <span className="font-display-lg text-title-md font-bold text-primary tracking-tighter">
            ChurnRadar
          </span>
        </div>
        <div className="hidden md:flex gap-xl">
          <Link href="/" className="font-title-md text-label-caps text-primary border-b-2 border-primary pb-1 transition-all">
            Solutions
          </Link>
          <Link href="/metrics" className="font-title-md text-label-caps text-on-surface-variant hover:text-on-surface transition-colors">
            Performance
          </Link>
          <Link href="/dashboard" className="font-title-md text-label-caps text-on-surface-variant hover:text-on-surface transition-colors">
            Workspace
          </Link>
        </div>
        <div className="flex items-center gap-md">
          <Link href="/login" className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface px-md py-sm transition-colors">
            Login
          </Link>
          <Link href="/login" className="font-label-caps text-label-caps bg-primary text-on-primary-container px-lg py-sm rounded-lg hover:brightness-110 active:scale-95 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative pt-48 pb-24 overflow-hidden flex flex-col gap-32">
        {/* Hero Background Decor */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-tertiary-container/5 blur-[120px] rounded-full"></div>
        </div>

        {/* Hero Section */}
        <section className="relative z-10 px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-sm bg-surface-container-high/50 border border-outline-variant px-5 py-2 rounded-full mb-10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-secondary pulse-pink"></span>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest text-xs font-bold">
              v2.4 Enterprise Release
            </span>
          </div>
          <h1 className="font-display-lg text-5xl md:text-[84px] leading-[1.05] tracking-tight mb-10 max-w-5xl">
            Stop Revenue Leakage <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-tertiary">
              Before It Happens.
            </span>
          </h1>
          <p className="font-body-lg text-body-sm md:text-lg text-on-surface-variant max-w-3xl mb-12 mx-auto opacity-80 leading-relaxed">
            Real-time ML-driven customer risk profiling for enterprise retention. Predict churn with 98.4% accuracy using our mission-critical intelligence engine.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-16">
            <Link href="/login" className="group relative font-title-md text-title-md bg-primary text-on-primary-container px-10 py-5 rounded-xl overflow-hidden shadow-[0_0_40px_-10px_rgba(183,109,255,0.5)] hover:shadow-[0_0_60px_-5px_rgba(183,109,255,0.7)] transition-all duration-300">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>
            <Link href="/login" className="font-title-md text-title-md border border-outline-variant bg-surface-container-low/50 hover:bg-surface-container-high text-on-surface px-10 py-5 rounded-xl transition-all">
              View Demo
            </Link>
          </div>

          {/* Dashboard Mockup/Visual */}
          <div className="mt-6 w-full max-w-5xl glass-card rounded-2xl p-4 border border-outline-variant/30 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container-lowest pointer-events-none z-20 h-full"></div>
            <div className="overflow-hidden rounded-xl bg-surface-dim">
              <img
                className="w-full h-auto object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
                alt="A futuristic data analytics dashboard interface displaying retention metrics"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAedTZAqB57auaiuPiPOMj7eiM224WwdD_KQUV8uB181kssFwkoUyp7YEXjPmTxfi-HAuKPlwLlmJQ42t7R5D61qD1DHHz2sfWsQ8diwS7nhLVdgmRJvwOYeWg9_cyRCq8FX_wVoZg4yScJqDOUMvYaIAsFmeErBM5ytxVXRs-OT_qSn7atyMyh1HfhBEg6t_9whU3VsxLndeQVEyq3ZVm-zkzW5bJnQdTb0YtEH9LTgDsbJAGnhW6ttMiGetdj0tET6hjzh2rIi0Me"
              />
            </div>
            {/* Float Card */}
            <div className="absolute -bottom-10 -right-10 hidden lg:block w-72 glass-card p-6 rounded-xl border border-primary/20 shadow-xl z-30">
              <div className="flex justify-between items-center mb-4">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Active Predictions</span>
                <span className="material-symbols-outlined text-secondary text-[18px]">trending_up</span>
              </div>
              <div className="text-display-lg font-bold text-3xl text-primary">2,481</div>
              <div className="text-body-sm text-on-surface-variant mt-2">Real-time alerts triggered</div>
            </div>
          </div>
        </section>

        {/* System Overview Matrix */}
        <section className="relative z-10 px-8 max-w-7xl mx-auto mt-20">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg mb-4 text-3xl font-bold">System Overview Matrix</h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="group bg-[#161F30] border border-white/5 p-8 rounded-xl glow-border transition-all duration-300 hover:-translate-y-2 shadow-md">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  dataset
                </span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface mb-4 font-semibold text-lg">
                Real-time Preprocessing
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed opacity-70">
                Our ingestion layer cleanses and normalizes telemetry events dynamically, ensuring your ML models act on pristine, high-fidelity data signals.
              </p>
              <div className="mt-8 flex items-center gap-base text-primary font-label-caps text-label-caps opacity-0 group-hover:opacity-100 transition-opacity">
                Read Technical Docs <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="group bg-[#161F30] border border-white/5 p-8 rounded-xl glow-border transition-all duration-300 hover:-translate-y-2 shadow-md">
              <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center mb-6 group-hover:bg-tertiary/20 transition-colors">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  bolt
                </span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface mb-4 font-semibold text-lg">
                Low-latency AI Inference
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed opacity-70">
                Proprietary neural architectures deployed globally on edge clusters to provide low-latency risk scoring for every customer interaction.
              </p>
              <div className="mt-8 flex items-center gap-base text-tertiary font-label-caps text-label-caps opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Network <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
            {/* Card 3 */}
            <div className="group bg-[#161F30] border border-white/5 p-8 rounded-xl glow-border transition-all duration-300 hover:-translate-y-2 shadow-md">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  security
                </span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface mb-4 font-semibold text-lg">
                Secure Enterprise Gateways
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed opacity-70">
                SOC2 Type II compliant pipelines with end-to-end encryption. Seamlessly integrate with CRM and custom internal databases.
              </p>
              <div className="mt-8 flex items-center gap-base text-secondary font-label-caps text-label-caps opacity-0 group-hover:opacity-100 transition-opacity">
                Security Overview <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-8 py-16 max-w-7xl mx-auto border-t border-outline-variant/30 mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="font-display-lg text-primary text-3xl font-bold mb-xs">$2.4B+</div>
              <div className="font-label-caps text-label-caps text-on-surface-variant tracking-widest text-xs font-bold uppercase">
                Revenue Retained
              </div>
            </div>
            <div className="text-center">
              <div className="font-display-lg text-primary text-3xl font-bold mb-xs">98.4%</div>
              <div className="font-label-caps text-label-caps text-on-surface-variant tracking-widest text-xs font-bold uppercase">
                Prediction Accuracy
              </div>
            </div>
            <div className="text-center">
              <div className="font-display-lg text-primary text-3xl font-bold mb-xs">50ms</div>
              <div className="font-label-caps text-label-caps text-on-surface-variant tracking-widest text-xs font-bold uppercase">
                Inference Latency
              </div>
            </div>
            <div className="text-center">
              <div className="font-display-lg text-primary text-3xl font-bold mb-xs">15k+</div>
              <div className="font-label-caps text-label-caps text-on-surface-variant tracking-widest text-xs font-bold uppercase">
                Global Clusters
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 px-16 flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-lowest border-t border-outline-variant opacity-80 hover:opacity-100 transition-opacity duration-300">
        <div className="flex flex-col items-center md:items-start gap-sm">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              crisis_alert
            </span>
            <span className="font-title-md text-title-md text-on-surface font-semibold">ChurnRadar AI</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center md:text-left">
            © 2026 ChurnRadar AI. All rights reserved. Precision Retention Engine.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-lg">
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
            Terms of Service
          </a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
            Security
          </a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
