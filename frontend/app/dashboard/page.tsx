"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface RecommendedAction {
  title: string;
  icon: string;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  
  // Form states
  const [tenure, setTenure] = useState(24);
  const [monthlyCharges, setMonthlyCharges] = useState(85);
  const [contract, setContract] = useState("Month-to-month");
  const [internetService, setInternetService] = useState("Fiber optic");
  
  // Prediction response states
  const [churnProb, setChurnProb] = useState<number | null>(12);
  const [riskProfile, setRiskProfile] = useState("Low Risk Profile");
  const [predictedLtv, setPredictedLtv] = useState(1632);
  const [actions, setActions] = useState<RecommendedAction[]>([
    { title: "Auto-renew loyalty credit", icon: "redeem", status: "active" },
    { title: "Priority Support Escalation", icon: "support_agent", status: "locked" }
  ]);
  
  // UI states
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Auth verification on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("user_email");
    if (!token) {
      router.push("/login");
    } else {
      setUserEmail(email || "admin@company.ai");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
    router.push("/login");
  };

  const runPrediction = async () => {
    setLoading(true);
    setErrorMsg("");
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Session expired. Please log in again.");
      }

      const response = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          tenure: parseInt(tenure.toString()),
          MonthlyCharges: parseFloat(monthlyCharges.toString()),
          Contract: contract,
          InternetService: internetService
        })
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Prediction failure.");
      }

      const data = await response.json();
      
      const parsedProb = Math.round(data.churn_probability * 100);
      setChurnProb(parsedProb);
      setRiskProfile(data.risk_profile);
      setPredictedLtv(Math.round(data.predicted_ltv));
      setActions(data.recommended_actions);

    } catch (err: any) {
      setErrorMsg(err.message || "Failed to compute churn risk.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (prob: number) => {
    if (prob < 30) return "#4edea3"; // emerald success
    if (prob < 60) return "#ddb7ff"; // electric purple
    return "#e364a7"; // hot-pink critical
  };

  const getRiskGlow = (prob: number) => {
    if (prob < 30) return "rgba(78, 222, 163, 0.1)";
    if (prob < 60) return "rgba(221, 183, 255, 0.1)";
    return "rgba(227, 100, 167, 0.1)";
  };

  const getRiskIcon = (prob: number) => {
    if (prob < 30) return "verified_user";
    if (prob < 60) return "warning";
    return "emergency";
  };

  const getRiskBadgeClass = (prob: number) => {
    if (prob < 30) return "inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full mb-6 text-secondary";
    if (prob < 60) return "inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6 text-primary";
    return "inline-flex items-center gap-2 px-4 py-2 bg-tertiary-container/10 border border-tertiary/20 rounded-full mb-6 text-tertiary";
  };

  return (
    <div className="bg-background text-on-surface font-sans min-h-screen flex">
      
      {/* Collapsed Side Navigation */}
      <aside className="h-screen w-20 flex flex-col items-center py-lg bg-surface-container border-r border-outline-variant z-40 shrink-0">
        <div className="mb-xl">
          <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            crisis_alert
          </span>
        </div>
        <nav className="flex-grow flex flex-col gap-lg">
          <button 
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-container/10 text-primary border-r-4 border-primary"
            onClick={() => router.push("/dashboard")}
          >
            <span className="material-symbols-outlined">dashboard</span>
          </button>
          <button 
            className="w-12 h-12 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
            onClick={() => router.push("/metrics")}
          >
            <span className="material-symbols-outlined">query_stats</span>
          </button>
          <button 
            className="w-12 h-12 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
            onClick={() => router.push("/")}
          >
            <span className="material-symbols-outlined">analytics</span>
          </button>
        </nav>
        <div className="mt-auto flex flex-col gap-lg">
          <button 
            className="w-12 h-12 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
            onClick={handleLogout}
            title="Log Out"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
          <div className="w-10 h-10 rounded-full border border-outline overflow-hidden">
            <img 
              alt="Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAljmFZNGoacJ1DHv96ZKLMhHYY8hnxc-Py-CnMWdgFgUdlCnJ0LB4hYd3B21eG1s3AfJ5QELBuyx3AjuejsBM-mLyL3P54ZooHd5DPwDRJggDBr1VzgYnbS0XMGlFXrA331ha7XBqoBh_EqNAS1BwGV53JM13OmYfFbJcSH8hk1kOtqJbk4HpPInaPFW7UgQ4pmdiuUju9gsDEkhGjd0i7usGi5Ml__CNk8ULiqEt64C1pOk6T-rTYVBQtC8Xnjkf3BoBP4xM7g5sp"
            />
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top AppBar (Expanded h-24 and px-12) */}
        <header className="h-24 flex justify-between items-center px-12 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant z-30 shrink-0">
          <div className="flex items-center gap-md">
            <h1 className="font-display-lg text-2xl font-bold tracking-tighter text-primary">
              ChurnRadar <span className="text-on-surface font-normal">AI Workspace</span>
            </h1>
            <span className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full font-label-caps text-[10px] font-bold">
              ENTERPRISE HUD
            </span>
          </div>
          
          <div className="flex items-center gap-8">
            <span className="text-body-sm font-mono text-on-surface-variant hidden md:inline">
              Operator: <span className="text-primary">{userEmail}</span>
            </span>
            <button 
              onClick={() => router.push("/metrics")} 
              className="bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary px-6 py-2.5 rounded-lg font-title-md text-body-sm font-bold transition-all"
            >
              Model Performance
            </button>
          </div>
        </header>

        {/* Workspace Dashboard Content (Dynamically adjusted height offset) */}
        <main className="p-8 md:p-12 overflow-y-auto flex-1 flex flex-col gap-12 max-h-[calc(100vh-96px)] bg-background/50">
          
          <div className="grid grid-cols-12 gap-10">
            {/* Left Column: Parameter Module */}
            <section className="col-span-12 xl:col-span-7 flex flex-col gap-8">
              
              <div className="glass-panel p-8 md:p-10 rounded-xl relative overflow-hidden group border border-outline-variant/30 shadow-lg">
                
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="font-title-md text-title-md text-on-surface mb-xs font-semibold text-xl">
                      Prediction Parameters
                    </h2>
                    <p className="text-on-surface-variant text-body-sm mt-1">
                      Adjust customer profile attributes to simulate churn risk.
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-primary-container/40 text-4xl">hub</span>
                </div>

                {errorMsg && (
                  <div className="p-md bg-error-container/20 border border-error-container/40 rounded-lg text-error text-body-sm mb-lg font-mono">
                    [ERROR] {errorMsg}
                  </div>
                )}

                {/* Range Sliders */}
                <div className="space-y-8">
                  {/* Tenure Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="font-label-caps text-xs font-bold text-on-surface-variant tracking-wider">
                        Customer Tenure (Months)
                      </label>
                      <span className="font-code-data font-mono text-primary text-lg font-semibold">
                        {tenure}
                      </span>
                    </div>
                    <input 
                      className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary" 
                      max="72" 
                      min="0" 
                      type="range" 
                      value={tenure}
                      onChange={(e) => setTenure(parseInt(e.target.value))}
                    />
                    <div className="flex justify-between text-[10px] text-outline uppercase tracking-widest font-bold">
                      <span>New</span>
                      <span>Loyal (72m)</span>
                    </div>
                  </div>

                  {/* Charges Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="font-label-caps text-xs font-bold text-on-surface-variant tracking-wider">
                        Monthly Charges ($)
                      </label>
                      <span className="font-code-data font-mono text-secondary text-lg font-semibold">
                        ${monthlyCharges}.00
                      </span>
                    </div>
                    <input 
                      className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-secondary" 
                      max="250" 
                      min="10" 
                      type="range" 
                      value={monthlyCharges}
                      onChange={(e) => setMonthlyCharges(parseInt(e.target.value))}
                    />
                    <div className="flex justify-between text-[10px] text-outline uppercase tracking-widest font-bold">
                      <span>Basic ($10)</span>
                      <span>Premium ($250)</span>
                    </div>
                  </div>
                </div>

                {/* Categorical Dropdowns */}
                <div className="grid grid-cols-2 gap-6 mt-10">
                  <div className="space-y-3">
                    <label className="font-label-caps text-xs font-bold text-on-surface-variant tracking-wider uppercase">
                      Contract Type
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full bg-surface-dim border border-outline-variant rounded-lg px-4 py-3.5 text-body-sm appearance-none focus:border-primary outline-none text-on-surface"
                        value={contract}
                        onChange={(e) => setContract(e.target.value)}
                      >
                        <option>Month-to-month</option>
                        <option>One year</option>
                        <option>Two year</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="font-label-caps text-xs font-bold text-on-surface-variant tracking-wider uppercase">
                      Internet Service
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full bg-surface-dim border border-outline-variant rounded-lg px-4 py-3.5 text-body-sm appearance-none focus:border-primary outline-none text-on-surface"
                        value={internetService}
                        onChange={(e) => setInternetService(e.target.value)}
                      >
                        <option>Fiber optic</option>
                        <option>DSL</option>
                        <option>No Service</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={runPrediction}
                  disabled={loading}
                  className="w-full mt-10 py-4 bg-primary-container text-on-primary-container font-semibold rounded-lg flex items-center justify-center gap-md active:scale-[0.98] transition-all relative overflow-hidden disabled:opacity-80 shadow-md"
                >
                  <span>Run Risk Profiler</span>
                  <span className="material-symbols-outlined">bolt</span>
                  
                  {loading && (
                    <div className="absolute inset-0 bg-primary-container flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
              </div>

              {/* Contextual Data Grid */}
              <div className="grid grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-xl border-l-4 border-secondary shadow-md">
                  <p className="font-label-caps text-[10px] font-bold text-outline mb-2 uppercase tracking-wider">DATA QUALITY</p>
                  <h4 className="text-xl font-mono text-secondary font-semibold">99.8%</h4>
                </div>
                <div className="glass-panel p-6 rounded-xl border-l-4 border-primary shadow-md">
                  <p className="font-label-caps text-[10px] font-bold text-outline mb-2 uppercase tracking-wider">LATENCY</p>
                  <h4 className="text-xl font-mono text-primary font-semibold">12ms</h4>
                </div>
                <div className="glass-panel p-6 rounded-xl border-l-4 border-tertiary shadow-md">
                  <p className="font-label-caps text-[10px] font-bold text-outline mb-2 uppercase tracking-wider">MODELS</p>
                  <h4 className="text-xl font-mono text-tertiary font-semibold">v4.2-Pro</h4>
                </div>
              </div>
            </section>

            {/* Right Column: Real-time Response HUD */}
            <section className="col-span-12 xl:col-span-5 flex flex-col gap-8">
              <div className="glass-panel h-full rounded-xl flex flex-col items-center justify-center p-8 md:p-10 relative border border-outline-variant/30 shadow-lg">
                <div className="absolute top-md left-md flex items-center gap-xs">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  <span className="font-label-caps text-[10px] text-secondary tracking-widest font-bold">LIVE HUD RESPONSE</span>
                </div>
                
                <div className="relative flex flex-col items-center my-8">
                  {/* Radial Progress Gauge */}
                  {churnProb !== null ? (
                    <div 
                      className={`radial-progress flex items-center justify-center ${churnProb >= 60 ? "risk-active" : ""}`}
                      style={{ 
                        "--value": churnProb, 
                        "--track-color": getRiskColor(churnProb),
                        "--size": "14rem"
                      } as any}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-6xl font-black font-sans tracking-tighter text-on-surface">{churnProb}%</span>
                        <span className="font-label-caps text-[10px] text-outline mt-2 uppercase tracking-wider font-bold">Churn Prob.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-56 h-56 rounded-full border border-dashed border-outline-variant flex items-center justify-center text-on-surface-variant font-mono">
                      Awaiting Input
                    </div>
                  )}
                  
                  {/* Dynamic Ambient Glow */}
                  <div 
                    className="absolute -inset-10 blur-[65px] -z-10 rounded-full transition-all duration-700 pointer-events-none"
                    style={{ backgroundColor: getRiskGlow(churnProb || 0) }}
                  ></div>
                </div>

                <div className="text-center mb-8">
                  <div className={getRiskBadgeClass(churnProb || 0)}>
                    <span className="material-symbols-outlined text-sm">{getRiskIcon(churnProb || 0)}</span>
                    <span className="font-label-caps text-xs uppercase tracking-wider font-bold ml-1">{riskProfile}</span>
                  </div>
                  
                  <p className="text-on-surface-variant text-body-sm max-w-sm mx-auto leading-relaxed">
                    {churnProb && churnProb >= 60 
                      ? "High churn probability identified. Immediate retention intervention required. Customer contract and charges are critical concerns."
                      : churnProb && churnProb >= 30
                      ? "Moderate churn risk detected. Recommend proactive customer outreach, surveyor checks, and soft discount incentives."
                      : "Customer behavior aligns with high-retention cohorts. Predicted value is stable."
                    } Estimated LTV: <span className="text-primary font-bold">${predictedLtv}</span>.
                  </p>
                </div>

                {/* Recommended Retention Actions */}
                <div className="w-full border-t border-outline-variant pt-8">
                  <h5 className="font-label-caps text-[11px] text-outline mb-6 uppercase text-center tracking-widest font-bold">
                    Retention Recommended Actions
                  </h5>
                  <div className="space-y-4">
                    {actions.map((action, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-center gap-md p-4 rounded-lg bg-surface-container-high/50 border border-outline-variant/30 ${action.status === "locked" ? "opacity-50" : ""}`}
                      >
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-sm">{action.icon}</span>
                        </span>
                        <span className="text-body-sm flex-1 font-medium">{action.title}</span>
                        <span className="material-symbols-outlined text-outline">
                          {action.status === "locked" ? "lock" : "chevron_right"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Bottom Bento Box Metrics */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
            <div className="glass-panel p-8 rounded-xl flex flex-col justify-between border border-outline-variant/30 shadow-md">
              <div>
                <p className="font-label-caps text-[10px] text-outline mb-2 uppercase font-bold tracking-wider">TOTAL ANALYZED</p>
                <h3 className="text-3xl font-bold text-on-surface">1.2M+</h3>
              </div>
              <div className="h-10 w-full bg-gradient-to-r from-primary/20 to-transparent rounded-full flex items-end px-sm pb-1 overflow-hidden mt-6">
                <div className="w-full h-2 bg-primary/40 rounded-full relative">
                  <div className="absolute inset-0 bg-primary w-2/3 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-8 rounded-xl flex flex-col justify-between border border-outline-variant/30 shadow-md">
              <div>
                <p className="font-label-caps text-[10px] text-outline mb-2 uppercase font-bold tracking-wider">AVG CHURN RISK</p>
                <h3 className="text-3xl font-bold text-secondary">4.2%</h3>
              </div>
              <div className="flex items-center gap-xs text-secondary text-body-sm mt-6">
                <span className="material-symbols-outlined text-sm">trending_down</span>
                <span>1.2% reduction this cycle</span>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-xl flex flex-col justify-between border border-outline-variant/30 shadow-md">
              <div>
                <p className="font-label-caps text-[10px] text-outline mb-2 uppercase font-bold tracking-wider">RETENTION ROI</p>
                <h3 className="text-3xl font-bold text-primary">$420k</h3>
              </div>
              <div className="flex items-center gap-xs text-primary text-body-sm mt-6">
                <span className="material-symbols-outlined text-sm">monitoring</span>
                <span>Active simulation</span>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-xl flex flex-col justify-between bg-tertiary-container/5 border border-tertiary/20 shadow-md">
              <div>
                <p className="font-label-caps text-[10px] text-tertiary mb-2 uppercase font-bold tracking-wider">ACTIVE ALERTS</p>
                <h3 className="text-3xl font-bold text-tertiary">14</h3>
              </div>
              <button className="text-tertiary font-label-caps text-[10px] underline tracking-widest text-left font-bold uppercase mt-6">
                VIEW CRITICAL ALERTS
              </button>
            </div>
          </section>
        </main>

        {/* Footer (Expanded h-16 and px-12) */}
        <footer className="h-16 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between px-12 z-30 shrink-0">
          <div className="flex items-center gap-lg">
            <span className="text-[10px] font-label-caps text-outline font-bold">
              © 2026 CHURNRADAR AI PRECISION ENGINE
            </span>
          </div>
          <div className="flex items-center gap-xs">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="text-[10px] font-label-caps text-secondary uppercase font-bold">
              System Operational
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
