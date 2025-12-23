"use client";
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Book, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function FaqPage() {
  const faqs = [
    { 
      icon: <Server size={24} className="text-purple-400"/>,
      q: "What is a Xandeum pNode?", 
      a: "A pNode (Provider Node) is a storage unit in the Xandeum network. Unlike traditional validators that compute transactions, pNodes provide scalable, decentralized storage capacity for Solana dApps." 
    },
    { 
        icon: <Zap size={24} className="text-emerald-400"/>,
        q: "Why is a node shown as 'Offline'?", 
        a: "Nodes are marked offline if they fail to respond to the `get-pods` RPC heartbeat for more than 5 minutes. This is usually due to network maintenance, ISP interruptions, or the node software updating." 
    },
    { 
        icon: <ShieldCheck size={24} className="text-pink-400"/>,
        q: "How is 'Adoption' calculated?", 
        a: "Adoption represents the percentage of the network currently running the latest stable consensus version. A high adoption rate (>80%) indicates a healthy, secure network." 
    },
    { 
        icon: <Globe size={24} className="text-blue-400"/>,
        q: "How do I run my own Node?", 
        a: "The Xandeum network is open to the public. You can download the Xandeum CLI from the official documentation, stake the required SOL, and configure your storage paths to join the mainnet." 
    },
    { 
        icon: <Activity size={24} className="text-orange-400"/>,
        q: "What does 'Simulation Mode' mean?", 
        a: "If the local RPC connection fails, this dashboard switches to a high-fidelity simulation mode to demonstrate UI capabilities using mock data. This ensures the interface is always reviewable." 
    }
  ];

  // Helper component for icons
  function Server({size, className}: any) { return <div className={className}><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg></div> }
  function Activity({size, className}: any) { return <div className={className}><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div> }


  return (
    <div className="min-h-screen p-6 md:p-20 text-slate-200 font-sans">
        <div className="max-w-4xl mx-auto animate-fade-in-down">
            
            {/* Header */}
            <div className="mb-12">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/> Back to Dashboard
                </Link>
                <div className="flex items-center gap-4">
                    <div className="bg-purple-600 p-3 rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.4)]">
                        <Book size={32} className="text-white" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white">
                        Knowledge <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Base</span>
                    </h1>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="glass-panel p-8 rounded-2xl group hover:border-purple-500/40 transition-all duration-300">
                        <div className="flex gap-6 items-start">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                {faq.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{faq.q}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm md:text-base">{faq.a}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-12 text-center border-t border-white/5 pt-8">
                <p className="text-slate-500 text-sm">
                    Still have questions? Join the <a href="#" className="text-purple-400 hover:text-purple-300 underline">Xandeum Discord</a>.
                </p>
            </div>
        </div>
    </div>
  );
}