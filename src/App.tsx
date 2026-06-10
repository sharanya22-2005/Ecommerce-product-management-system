import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Settings, 
  Terminal, 
  Sparkles, 
  Users, 
  Package, 
  Ticket, 
  CheckCircle, 
  Bell, 
  TrendingUp, 
  ShoppingBag,
  Cpu,
  Info
} from 'lucide-react';
import PhoneSimulator from './components/PhoneSimulator';
import AdminDashboard from './components/AdminDashboard';
import DeveloperConsole from './components/DeveloperConsole';

export default function App() {
  // Navigation role state
  const [activeTab, setActiveTab] = useState<'mobile' | 'admin' | 'developer'>('mobile');
  
  // Real active user login state
  const [currentUser, setCurrentUser] = useState<any>({
    id: "user-1",
    name: "Sharanya Viswanathan",
    email: "pvsharanya21@gmail.com",
    mobile: "+91 9876543210",
    role: "Customer"
  });

  // Dynamic system notifications events log
  const [systemLogs, setSystemLogs] = useState<Array<{ id: string; title: string; desc: string; time: string }>>([
    { id: '1', title: 'SmartCommerce Bootstrap', desc: 'Secure Express server started successfully on port 3000.', time: '13:02:40' },
    { id: '2', title: 'Memory Seed Sync', desc: 'Loaded 7 premium products, 4 promo coupons, and spam models.', time: '13:02:41' }
  ]);

  const addSystemLog = (title: string, desc: string) => {
    const newLog = {
      id: Date.now().toString(),
      title,
      desc,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setSystemLogs(prev => [newLog, ...prev.slice(0, 10)]); // Keep latest 10
  };

  // Synchronize admin status overrides
  useEffect(() => {
    if (currentUser && currentUser.email === 'admin@smartcommerce.com') {
      addSystemLog("Privilege Escalation", "Admin override active. Interactive reports ready.");
    } else if (currentUser) {
      addSystemLog("Session Standardized", `Logged in as Customer: ${currentUser.name}`);
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans flex flex-col selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* Top Professional Header Bar */}
      <header className="bg-[#0c0c0e] text-zinc-100 border-b border-[#27272a] p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-blue-500 flex items-center justify-center animate-pulse">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-emerald-400 bg-clip-text text-transparent">SmartCommerce</h1>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">E-Commerce Ecosystem & Admin Dashboard</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex bg-[#18181b] p-1 rounded-xl border border-[#27272a] gap-1">
            <button 
              onClick={() => setActiveTab('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${activeTab === 'mobile' ? 'bg-blue-600 text-white' : 'hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200'}`}
            >
              <Smartphone className="w-4 h-4" />
              Customer Mobile App
            </button>
            <button 
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${activeTab === 'admin' ? 'bg-blue-600 text-white' : 'hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200'}`}
            >
              <Settings className="w-4 h-4" />
              Admin Portal
            </button>
            <button 
              onClick={() => setActiveTab('developer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${activeTab === 'developer' ? 'bg-blue-600 text-white' : 'hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200'}`}
            >
              <Terminal className="w-4 h-4" />
              Source Exporter
            </button>
          </div>

        </div>
      </header>

      {/* Main Screen Layout Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        
        {/* MOBILE PREVIEW TAB */}
        {activeTab === 'mobile' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Visual Phone Simulator */}
            <div className="lg:col-span-5 flex justify-center">
              <PhoneSimulator 
                currentUser={currentUser} 
                setCurrentUser={setCurrentUser} 
                onNotificationTriggered={addSystemLog} 
              />
            </div>

            {/* Simulated instructions / features checklist panel */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-[#18181b] p-6 rounded-2xl border border-[#27272a] shadow-lg space-y-4">
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Info className="text-blue-400 w-5 h-5" /> Interactive Demonstration Walkthrough
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Welcome to the **SmartCommerce Virtual Simulation**. In this area, we have created an operational mobile interface resembling the final Android/iOS application. Use these simple scripts to test the operational flowport:
                </p>

                <div className="grid md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-[#0c0c0e] border border-[#27272a] hover:border-[#3f3f46] text-zinc-200 rounded-xl space-y-1 transition-colors">
                    <span className="font-bold text-blue-400 block pb-1 border-b border-[#27272a]/40">Step 1: Authenticate</span>
                    <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
                      Use the suggested demo logins or register a new customer profile via mobile registration simulations.
                    </p>
                  </div>
                  <div className="p-3.5 bg-[#0c0c0e] border border-[#27272a] hover:border-[#3f3f46] text-zinc-200 rounded-xl space-y-1 transition-colors">
                    <span className="font-bold text-indigo-400 block pb-1 border-b border-[#27272a]/40">Step 2: Apply Coupons</span>
                    <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
                      Shop Electronics, add items to cart, type <code className="bg-zinc-800 text-white px-1 border border-zinc-700 rounded font-mono">SMART20</code> inside promotions and claim discounts instantly!
                    </p>
                  </div>
                  <div className="p-3.5 bg-[#0c0c0e] border border-[#27272a] hover:border-[#3f3f46] text-zinc-200 rounded-xl space-y-1 transition-colors">
                    <span className="font-bold text-emerald-400 block pb-1 border-b border-[#27272a]/40">Step 3: Admin Sync</span>
                    <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
                      Switch to **Admin Portal** to update order timelines (e.g. mark dispatch) and watch live updates reflect on the phone!
                    </p>
                  </div>
                </div>
              </div>

              {/* Gemini grounded Chatbot info */}
              <div className="bg-gradient-to-br from-[#1e1b4b] to-[#0c0c0e] text-zinc-100 p-6 rounded-2xl border border-[#3730a3] shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-300">
                    <Cpu className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Server-side Intel: Smart AI Chatbot</h3>
                    <p className="text-[11px] text-zinc-400">Powered by `@google/genai` utilizing standard `gemini-3.5-flash` model</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Inside the mobile view, tap the chat bubble index on home view. The chatbot queries the in-memory backend, accessing direct variables of active warehoused products, active coupons, and your order numbers. Try querying:
                </p>
                <div className="border border-[#27272a] bg-[#0c0c0e]/80 p-3 rounded-xl font-mono text-xs text-indigo-300 space-y-1">
                  <div>&gt; "Are there active coupons?"</div>
                  <div>&gt; "Do you have electronics?"</div>
                  <div>&gt; "Track my order SMC-2026-1182 for me"</div>
                </div>
              </div>

              {/* Dynamic live event logs */}
              <div className="bg-[#18181b] p-6 rounded-2xl border border-[#27272a] shadow-lg space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[#27272a]">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-blue-400 animate-bounce" /> Operational Event Logs
                  </h4>
                  <span className="bg-blue-600/15 text-blue-400 border border-blue-500/20 text-[10px] font-bold p-1 px-2.5 rounded-full">Database: Synced</span>
                </div>
                
                <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                  {systemLogs.map(log => (
                    <div key={log.id} className="text-xs flex justify-between gap-4 py-1.5 border-b border-[#27272a]/50 last:border-0 hover:bg-[#1f1f23] transition p-1 rounded">
                      <div>
                        <span className="font-bold text-zinc-100 block text-xs">{log.title}</span>
                        <span className="text-[11px] text-zinc-400">{log.desc}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono flex-shrink-0">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ADMIN PORTAL TAB */}
        {activeTab === 'admin' && (
          <div className="fade-in">
            <AdminDashboard onNotificationTriggered={addSystemLog} />
          </div>
        )}

        {/* DEVELOPER BOILERPLATE CODE EXPORTER TAB */}
        {activeTab === 'developer' && (
          <div className="fade-in h-[620px]">
            <DeveloperConsole />
          </div>
        )}

      </main>

      {/* Humble clean aesthetic system footer */}
      <footer className="bg-[#0c0c0e] border-t border-[#27272a] p-6 text-center text-xs text-zinc-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 SmartCommerce System. Open Source Mobile & API Boilerplate ready.</p>
          <div className="flex gap-4 text-[11px]">
            <span>Flutter v3.19.x</span>
            <span>•</span>
            <span>Flask REST v3.0.x</span>
            <span>•</span>
            <span>MySQL InnoDB</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
