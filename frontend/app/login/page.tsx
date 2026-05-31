"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  
  // Feedback states
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    setLoadingText("Establishing encrypted bridge to CR-Global-HUD...");
    
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);
      
      const response = await fetch("http://localhost:8000/api/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Authentication session failed.");
      }
      
      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user_email", email);
      
      // Simulate connection sync
      setTimeout(() => {
        setLoading(false);
        router.push("/dashboard");
      }, 1500);
      
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || "Failed to initialize session.");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    setLoadingText("Syncing neural profile database...");

    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: regEmail,
          password: regPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration protocol rejected.");
      }

      setTimeout(() => {
        setLoading(false);
        alert("Operator Profile Created successfully! Initializing OAuth2 Secure Login...");
        // Reset states and switch to login
        setEmail(regEmail);
        setActiveTab("login");
        setFirstName("");
        setLastName("");
        setRegEmail("");
        setRegPassword("");
      }, 1500);

    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || "Failed to deploy operator profile.");
    }
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen flex items-center justify-center overflow-y-auto py-16 relative selection:bg-primary-container selection:text-on-primary-container">
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]"></div>
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20" 
          style={{ 
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)", 
            backgroundSize: "48px 48px" 
          }}
        ></div>
      </div>

      {/* Main Auth Container */}
      <main className="relative z-10 w-full max-w-[520px] px-8 py-10">
        <div className="glass-panel glow-animate rounded-xl p-10 md:p-14 flex flex-col items-center shadow-2xl">
          
          {/* Brand Identity */}
          <div className="mb-10 flex flex-col items-center gap-6">
            <span className="material-symbols-outlined text-primary text-6xl drop-shadow-[0_0_15px_rgba(183,109,255,0.4)] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
              crisis_alert
            </span>
            <div className="text-center">
              <h1 className="font-display-lg text-4xl font-bold text-primary tracking-tighter mb-1.5">ChurnRadar</h1>
              <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">
                Secure Authentication Terminal
              </p>
            </div>
          </div>

          {/* Animated Tabs */}
          <div className="flex w-full mb-10 border-b border-outline-variant relative">
            <button 
              className={`flex-1 pb-4 font-label-caps text-xs font-bold tracking-wider tab-transition ${activeTab === "login" ? "tab-active text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
              onClick={() => { setActiveTab("login"); setErrorMsg(""); }}
            >
              OAuth2 SECURE LOGIN
            </button>
            <button 
              className={`flex-1 pb-4 font-label-caps text-xs font-bold tracking-wider tab-transition ${activeTab === "register" ? "tab-active text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
              onClick={() => { setActiveTab("register"); setErrorMsg(""); }}
            >
              USER REGISTRATION
            </button>
          </div>

          {/* Error Message Feedback */}
          {errorMsg && (
            <div className="w-full p-4 bg-error-container/20 border border-error-container/40 rounded-lg text-error text-body-sm mb-8 text-center font-mono">
              [ALERT] {errorMsg}
            </div>
          )}

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="w-full space-y-6">
              <div className="space-y-3">
                <label className="font-label-caps text-xs text-on-surface-variant ml-1 font-bold uppercase tracking-wider">
                  CLIENT IDENTIFIER (EMAIL)
                </label>
                <div className="relative group input-focus-ring border border-outline-variant bg-surface-container-low rounded-lg transition-all duration-300">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary">
                    fingerprint
                  </span>
                  <input 
                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-body-sm font-mono focus:ring-0 placeholder:text-outline-variant outline-none" 
                    placeholder="user@company.ai" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="font-label-caps text-xs text-on-surface-variant ml-1 font-bold uppercase tracking-wider">
                  ACCESS TOKEN / SECRET (PASSWORD)
                </label>
                <div className="relative group input-focus-ring border border-outline-variant bg-surface-container-low rounded-lg transition-all duration-300">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary">
                    key
                  </span>
                  <input 
                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-body-sm font-mono focus:ring-0 placeholder:text-outline-variant outline-none" 
                    placeholder="••••••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full mt-8 py-4 bg-primary text-on-primary font-bold text-lg rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(183,109,255,0.2)]"
              >
                INITIALIZE SESSION
              </button>
            </form>
          )}

          {/* Registration Form */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="w-full space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="font-label-caps text-xs text-on-surface-variant ml-1 font-bold uppercase tracking-wider">
                    FIRST NAME
                  </label>
                  <div className="relative group input-focus-ring border border-outline-variant bg-surface-container-low rounded-lg transition-all duration-300">
                    <input 
                      className="w-full bg-transparent border-none py-3.5 px-4 text-body-sm focus:ring-0 outline-none text-on-surface" 
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="font-label-caps text-xs text-on-surface-variant ml-1 font-bold uppercase tracking-wider">
                    LAST NAME
                  </label>
                  <div className="relative group input-focus-ring border border-outline-variant bg-surface-container-low rounded-lg transition-all duration-300">
                    <input 
                      className="w-full bg-transparent border-none py-3.5 px-4 text-body-sm focus:ring-0 outline-none text-on-surface" 
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="font-label-caps text-xs text-on-surface-variant ml-1 font-bold uppercase tracking-wider">
                  ENTERPRISE EMAIL
                </label>
                <div className="relative group input-focus-ring border border-outline-variant bg-surface-container-low rounded-lg transition-all duration-300">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    mail
                  </span>
                  <input 
                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-body-sm focus:ring-0 outline-none" 
                    placeholder="user@company.ai" 
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="font-label-caps text-xs text-on-surface-variant ml-1 font-bold uppercase tracking-wider">
                  PASSWORD ARCHITECTURE
                </label>
                <div className="relative group input-focus-ring border border-outline-variant bg-surface-container-low rounded-lg transition-all duration-300">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    lock_open
                  </span>
                  <input 
                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-4 text-body-sm focus:ring-0 outline-none" 
                    placeholder="••••••••••••" 
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full mt-8 py-4 bg-secondary text-on-secondary font-bold text-lg rounded-lg hover:bg-secondary-container hover:text-on-secondary-container transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(78,222,163,0.2)]"
              >
                CREATE OPERATOR PROFILE
              </button>
            </form>
          )}

          <footer className="mt-12 text-center">
            <p className="font-body-sm text-xs text-on-surface-variant opacity-60">
              © 2026 ChurnRadar AI. Precision Retention Engine.
            </p>
          </footer>
        </div>
      </main>

      {/* Success Loading Feedback Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md transition-opacity duration-500">
          <div className="text-center p-xl">
            <div className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-lg"></div>
            <h2 className="font-display-lg text-3xl font-bold text-primary mb-sm">Syncing Neural Data</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">{loadingText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
