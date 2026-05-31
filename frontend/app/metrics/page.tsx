"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  timestamp: string;
}

export default function MetricsPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchMetrics = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/metrics", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user_email");
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load metric databases.");
        }

        const data = await response.json();
        setMetrics(data);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load metrics.");
        // Fallback to default metrics
        setMetrics({
          accuracy: 0.942,
          precision: 0.895,
          recall: 0.918,
          f1_score: 0.906,
          tp: 4281,
          fp: 248,
          fn: 512,
          tn: 12894,
          timestamp: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [router]);

  if (loading) {
    return (
      <div className="bg-surface-dim min-h-screen flex items-center justify-center text-on-surface">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent animate-spin mx-auto mb-lg"></div>
          <p className="font-mono text-on-surface-variant">Connecting to neural metrics databases...</p>
        </div>
      </div>
    );
  }

  const accVal = metrics ? (metrics.accuracy * 100).toFixed(1) : "94.2";
  const precVal = metrics ? (metrics.precision * 100).toFixed(1) : "89.5";
  const recVal = metrics ? (metrics.recall * 100).toFixed(1) : "91.8";
  const f1Val = metrics ? (metrics.f1_score * 100).toFixed(1) : "90.6";

  // Recharts Chart Data
  const chartData = [
    { metric: "Accuracy", value: parseFloat(accVal), fill: "#ddb7ff" },
    { metric: "Precision", value: parseFloat(precVal), fill: "#4edea3" },
    { metric: "Recall", value: parseFloat(recVal), fill: "#ffafd3" },
    { metric: "F1-Score", value: parseFloat(f1Val), fill: "#b76dff" }
  ];

  const formattedTime = metrics ? new Date(metrics.timestamp).toLocaleTimeString() : "02:14:58 UTC";

  return (
    <div className="bg-surface-dim text-on-surface font-sans min-h-screen flex">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-screen flex flex-col py-lg px-md z-40 bg-surface-container border-r border-outline-variant w-64 shrink-0">
        <div className="mb-xl px-md">
          <h1 className="font-display-lg text-2xl font-bold text-primary tracking-tighter">ChurnRadar AI</h1>
          <p className="text-on-surface-variant font-label-caps text-[10px] mt-1 opacity-70">ENTERPRISE TIER v4.2</p>
        </div>
        <nav className="flex-grow space-y-2">
          <Link href="/dashboard" className="flex items-center gap-md p-md rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors group">
            <span className="material-symbols-outlined text-primary">dashboard</span>
            <span className="font-label-caps text-xs font-bold uppercase tracking-wider">Dashboard</span>
          </Link>
          <Link href="/metrics" className="flex items-center gap-md p-md rounded-lg text-primary bg-primary-container/10 border-r-4 border-primary group">
            <span className="material-symbols-outlined">query_stats</span>
            <span className="font-label-caps text-xs font-bold uppercase tracking-wider">Metrics HUD</span>
          </Link>
          <Link href="/" className="flex items-center gap-md p-md rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors group">
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-label-caps text-xs font-bold uppercase tracking-wider">Solutions</span>
          </Link>
        </nav>
        <div className="mt-auto space-y-4">
          <button onClick={() => router.push("/dashboard")} className="w-full bg-primary-container text-on-primary-container py-md rounded-lg font-bold text-sm hover:scale-[0.98] transition-transform shadow-lg shadow-primary/20">
            New Analysis
          </button>
          <div className="pt-lg border-t border-outline-variant space-y-2">
            <div className="flex items-center gap-md px-md py-sm">
              <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden border border-outline-variant">
                <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAljmFZNGoacJ1DHv96ZKLMhHYY8hnxc-Py-CnMWdgFgUdlCnJ0LB4hYd3B21eG1s3AfJ5QELBuyx3AjuejsBM-mLyL3P54ZooHd5DPwDRJggDBr1VzgYnbS0XMGlFXrA331ha7XBqoBh_EqNAS1BwGV53JM13OmYfFbJcSH8hk1kOtqJbk4HpPInaPFW7UgQ4pmdiuUju9gsDEkhGjd0i7usGi5Ml__CNk8ULiqEt64C1pOk6T-rTYVBQtC8Xnjkf3BoBP4xM7g5sp"/>
              </div>
              <div>
                <p className="text-[12px] font-bold">Admin User</p>
                <button onClick={() => { localStorage.removeItem("token"); router.push("/login"); }} className="text-[10px] text-on-surface-variant hover:text-primary transition-colors block text-left">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Frame */}
      <main className="ml-64 p-8 md:p-12 min-h-screen flex-grow flex flex-col gap-12 bg-background/50">
        {/* Header (Increased bottom margin to mb-16) */}
        <header className="flex justify-between items-end mb-16 shrink-0">
          <div>
            <nav className="flex gap-sm text-on-surface-variant font-label-caps text-[10px] mb-2 font-bold tracking-wider">
              <span>ML MODELS</span>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-primary">PERFORMANCE HUD</span>
            </nav>
            <h2 className="font-display-lg text-3xl font-bold text-on-surface tracking-tight">
              Model Performance <span className="text-primary">v2.1</span>
            </h2>
          </div>
          <div className="flex items-center gap-lg">
            <div className="text-right">
              <p className="font-label-caps text-[10px] text-on-surface-variant font-bold tracking-wider">LAST UPDATED</p>
              <p className="font-mono text-xs text-secondary">{formattedTime}</p>
            </div>
            <div className="h-10 w-[1px] bg-outline-variant"></div>
            <div className="text-right">
              <p className="font-label-caps text-[10px] text-on-surface-variant font-bold tracking-wider">SYSTEM STATUS</p>
              <div className="flex items-center gap-xs justify-end">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                <p className="font-mono text-xs text-secondary">STABLE</p>
              </div>
            </div>
          </div>
        </header>

        {errorMsg && (
          <div className="p-md bg-error-container/20 border border-error-container/40 rounded-lg text-error text-body-sm font-mono">
            [ALERT] Live DB metrics offline. Showing static cached fallback values.
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 shrink-0">
          <div className="glass-panel p-8 rounded-xl border-l-4 border-primary shadow-md">
            <p className="font-label-caps text-[10px] font-bold text-on-surface-variant mb-4 uppercase tracking-wider">OVERALL ACCURACY</p>
            <div className="flex items-baseline gap-sm">
              <span className="font-display-lg text-4xl font-bold text-on-surface">{accVal}%</span>
              <span className="text-secondary font-mono text-sm">+0.8%</span>
            </div>
          </div>
          <div className="glass-panel p-8 rounded-xl border-l-4 border-secondary shadow-md">
            <p className="font-label-caps text-[10px] font-bold text-on-surface-variant mb-4 uppercase tracking-wider">PRECISION RATE</p>
            <div className="flex items-baseline gap-sm">
              <span className="font-display-lg text-4xl font-bold text-on-surface">{precVal}%</span>
              <span className="text-error font-mono text-sm">-1.2%</span>
            </div>
          </div>
          <div className="glass-panel p-8 rounded-xl border-l-4 border-tertiary shadow-md">
            <p className="font-label-caps text-[10px] font-bold text-on-surface-variant mb-4 uppercase tracking-wider">RECALL SCORE</p>
            <div className="flex items-baseline gap-sm">
              <span className="font-display-lg text-4xl font-bold text-on-surface">{recVal}%</span>
              <span className="text-secondary font-mono text-sm">+2.4%</span>
            </div>
          </div>
          <div className="glass-panel p-8 rounded-xl border-l-4 border-primary-container shadow-md">
            <p className="font-label-caps text-[10px] font-bold text-on-surface-variant mb-4 uppercase tracking-wider">F1-HARMONIC</p>
            <div className="flex items-baseline gap-sm">
              <span className="font-display-lg text-4xl font-bold text-on-surface">{f1Val}%</span>
              <span className="text-on-surface-variant font-mono text-sm">--</span>
            </div>
          </div>
        </div>

        {/* Performance Grid */}
        <div className="grid grid-cols-12 gap-10 flex-grow">
          {/* Left: Confusion Matrix */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h3 className="font-title-md text-title-md font-semibold text-lg text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">grid_view</span>
                Machine Learning Confusion Matrix
              </h3>
              <div className="bg-surface-container-high px-4 py-1.5 rounded-full border border-outline-variant">
                <p className="font-label-caps text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                  CONFIDENCE THRESHOLD: 0.85
                </p>
              </div>
            </div>
            
            <div className="relative grid grid-cols-2 grid-rows-2 gap-6 aspect-square max-h-[600px] w-full p-6 glass-panel rounded-2xl overflow-hidden shadow-lg">
              {/* True Positive */}
              <div className="confusion-cell relative bg-gradient-to-br from-secondary/40 to-secondary/10 border border-secondary/30 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <div className="absolute top-md left-md font-label-caps text-[10px] text-secondary font-bold tracking-wider">
                  TRUE POSITIVE (TP)
                </div>
                <div className="text-5xl font-bold text-secondary mb-4">{metrics?.tp || 4281}</div>
                <div className="font-body-sm text-on-surface-variant text-xs leading-relaxed">Predicted Churn | Actually Churned</div>
                <div className="mt-4 bg-secondary/10 px-6 py-1 rounded-full border border-secondary/20">
                  <span className="text-secondary font-mono text-xs">Correct Hit</span>
                </div>
              </div>
              {/* False Positive */}
              <div className="confusion-cell relative bg-gradient-to-br from-error-container/40 to-error-container/10 border border-error-container/30 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <div className="absolute top-md left-md font-label-caps text-[10px] text-error font-bold tracking-wider">
                  FALSE POSITIVE (FP)
                </div>
                <div className="text-5xl font-bold text-error mb-4">{metrics?.fp || 248}</div>
                <div className="font-body-sm text-on-surface-variant text-xs leading-relaxed">Predicted Churn | Actually Stayed</div>
                <div className="mt-4 bg-error-container/10 px-6 py-1 rounded-full border border-error-container/20">
                  <span className="text-error font-mono text-xs">Type I Error</span>
                </div>
              </div>
              {/* False Negative */}
              <div className="confusion-cell relative bg-gradient-to-br from-tertiary-container/40 to-tertiary-container/10 border border-tertiary-container/30 rounded-xl p-8 flex flex-col items-center justify-center text-center pulse-critical">
                <div className="absolute top-md left-md font-label-caps text-[10px] text-tertiary font-bold tracking-wider">
                  FALSE NEGATIVE (FN)
                </div>
                <div className="text-5xl font-bold text-tertiary mb-4">{metrics?.fn || 512}</div>
                <div className="font-body-sm text-on-surface-variant text-xs leading-relaxed">Predicted Stay | Actually Churned</div>
                <div className="mt-4 bg-tertiary-container/10 px-6 py-1 rounded-full border border-tertiary-container/20">
                  <span className="text-tertiary font-mono text-xs">Critical Miss</span>
                </div>
              </div>
              {/* True Negative */}
              <div className="confusion-cell relative bg-gradient-to-br from-primary-container/40 to-primary-container/10 border border-primary-container/30 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <div className="absolute top-md left-md font-label-caps text-[10px] text-primary font-bold tracking-wider">
                  TRUE NEGATIVE (TN)
                </div>
                <div className="text-5xl font-bold text-primary mb-4">{metrics?.tn || 12894}</div>
                <div className="font-body-sm text-on-surface-variant text-xs leading-relaxed">Predicted Stay | Actually Stayed</div>
                <div className="mt-4 bg-primary-container/10 px-6 py-1 rounded-full border border-primary-container/20">
                  <span className="text-primary font-mono text-xs">Correct Retention</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Analytical Tracking & Dynamic Chart */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h3 className="font-title-md text-title-md font-semibold text-lg text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-secondary">monitoring</span>
                Interactive Analytical Tracking
              </h3>
            </div>
            
            <div className="glass-panel rounded-2xl p-8 md:p-10 flex-grow flex flex-col border border-outline-variant/30 shadow-lg">
              <div className="space-y-8">
                {/* Accuracy Bar */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-label-caps text-xs font-bold text-on-surface-variant tracking-wider text-[11px]">ACCURACY</p>
                      <p className="text-[11px] text-on-surface-variant opacity-60">Global model hit rate</p>
                    </div>
                    <span className="font-mono text-secondary text-base font-semibold">{accVal}%</span>
                  </div>
                  <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${accVal}%` }}></div>
                  </div>
                </div>

                {/* Precision Bar */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-label-caps text-xs font-bold text-on-surface-variant tracking-wider text-[11px]">PRECISION</p>
                      <p className="text-[11px] text-on-surface-variant opacity-60">Quality of positive predictions</p>
                    </div>
                    <span className="font-mono text-secondary text-base font-semibold">{precVal}%</span>
                  </div>
                  <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: `${precVal}%` }}></div>
                  </div>
                </div>

                {/* Recall Bar */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-label-caps text-xs font-bold text-on-surface-variant tracking-wider text-[11px]">RECALL</p>
                      <p className="text-[11px] text-on-surface-variant opacity-60">Ability to find all churners</p>
                    </div>
                    <span className="font-mono text-tertiary text-base font-semibold">{recVal}%</span>
                  </div>
                  <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary" style={{ width: `${recVal}%` }}></div>
                  </div>
                </div>

                {/* F1 Score Bar */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-label-caps text-xs font-bold text-on-surface-variant tracking-wider text-[11px]">F1-SCORE</p>
                      <p className="text-[11px] text-on-surface-variant opacity-60">Harmonic mean of precision & recall</p>
                    </div>
                    <span className="font-mono text-primary text-base font-semibold">{f1Val}%</span>
                  </div>
                  <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${f1Val}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Dynamic Recharts Bar Visualization */}
              <div className="mt-10 flex-grow relative glass-panel rounded-xl bg-surface-dim/30 border border-outline-variant/30 flex flex-col justify-end p-6 overflow-hidden min-h-[240px] shadow-inner">
                <ResponsiveContainer width="100%" height={190}>
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262a35" />
                    <XAxis dataKey="metric" stroke="#988d9f" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <YAxis domain={[0, 100]} stroke="#988d9f" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#171b26", borderColor: "#4d4354" }}
                      labelStyle={{ color: "#dfe2f1", fontWeight: "bold" }}
                      itemStyle={{ color: "#ddb7ff" }}
                    />
                    <Bar dataKey="value" name="Score %" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <rect key={`rect-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="text-center mt-4">
                  <p className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">
                    Cross-Model Variance Index (Recharts Data Stream)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (Expanded top spacing to pt-16 and mt-auto) */}
        <footer className="mt-auto pt-16 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-md shrink-0">
          <div className="flex items-center gap-md">
            <span className="font-title-md text-title-md text-on-surface font-semibold">ChurnRadar AI</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">© 2026. Precision Retention Engine.</p>
          </div>
          <div className="flex gap-lg">
            <a className="font-body-sm text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="font-body-sm text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="font-body-sm text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Security</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
