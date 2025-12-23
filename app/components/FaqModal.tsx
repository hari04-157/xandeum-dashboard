"use client";
import { X, Book, Server, Zap, ShieldCheck, Globe, Activity } from 'lucide-react';

export default function FaqModal({ close }: { close: () => void }) {
  const faqs = [
    { 
      icon: <Server size={20} className="text-purple-400"/>,
      q: "What is a Xandeum pNode?", 
      a: "A pNode (Provider Node) is a storage unit in the Xandeum network. Unlike traditional validators, pNodes provide scalable, decentralized storage capacity for Solana dApps." 
    },
    { 
        icon: <Zap size={20} className="text-emerald-400"/>,
        q: "Why is a node shown as 'Offline'?", 
        a: "Nodes are marked offline if they fail to respond to the `get-pods` RPC heartbeat for more than 5 minutes. This is usually due to network maintenance or ISP interruptions." 
    },
    { 
        icon: <ShieldCheck size={20} className="text-pink-400"/>,
        q: "How is 'Adoption' calculated?", 
        a: "Adoption represents the percentage of the network currently running the latest stable consensus version. A high adoption rate (>80%) indicates a secure network." 
    },
    { 
        icon: <Globe size={20} className="text-blue-400"/>,
        q: "How do I run my own Node?", 
        a: "The Xandeum network is open. You can download the Xandeum CLI from the official documentation, stake the required SOL, and configure your storage paths to join." 
    },
    { 
        icon: <Activity size={20} className="text-orange-400"/>,
        q: "What is 'Simulation Mode'?", 
        a: "If the local RPC connection fails, this dashboard automatically switches to a high-fidelity simulation mode to demonstrate UI capabilities using realistic mock data." 
    }
  ];

  return (
    // FIX 2: Increased Z-Index to z-[200] so it sits ABOVE the Header (z-[100])
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[200] animate-fade-in-down" onClick={close}>
      <div 
        className="bg-[#0b1121] border border-purple-500/20 w-full max-w-3xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden relative max-h-[80vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-6 border-b border-white/5 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-3">
                <div className="bg-purple-600/20 p-2 rounded-lg">
                    <Book size={24} className="text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                    Knowledge <span className="text-purple-400">Base</span>
                </h2>
             </div>
             <button onClick={close} className="text-slate-400 hover:text-white bg-white/5 hover:bg-red-500/20 p-2 rounded-lg transition-colors">
                <X size={20} />
             </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-white/5 p-5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:bg-white/[0.07]">
                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-black/40 rounded-lg border border-white/5 mt-1">
                                {faq.icon}
                            </div>
                            <div>
                                <h3 className="text-purple-100 font-bold text-sm mb-2">{faq.q}</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">{faq.a}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-slate-500 text-xs">
                    Need more help? Join the <a href="https://discord.gg/uqRSmmM5m" target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 underline font-bold transition-colors">Xandeum Discord Community</a>.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}