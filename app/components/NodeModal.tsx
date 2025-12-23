"use client";
import { X, Cpu, Server, Database, Network } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#8b5cf6', '#1e293b']; // Purple & Slate for the Chart

export default function NodeModal({ node, stats, close }: any) {
  // Loading State (while fetching stats)
  if (!stats) return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="text-purple-400 font-mono text-xs animate-pulse">ESTABLISHING SECURE CONNECTION...</p>
        </div>
    </div>
  );

  // Calculate Storage for the Chart
  const totalGB = (stats.metadata?.total_bytes || 0) / 1e9;
  const chartData = [{ name: 'Used', value: (stats.file_size || 0) / 1e9 }, { name: 'Free', value: totalGB - ((stats.file_size || 0) / 1e9) }];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-fade-in-down" onClick={close}>
      <div className="bg-[#0b1121] border border-purple-500/20 w-full max-w-2xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-6 border-b border-white/5 flex justify-between items-center relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Server className="text-purple-500" size={24} /> 
                    {node.name}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm font-mono">
                    <span className="text-xl">{node.location?.flag}</span> {node.location?.city}, {node.location?.country}
                </div>
             </div>
             {/* Close Button */}
             <button onClick={close} className="relative z-10 text-slate-400 hover:text-white bg-white/5 hover:bg-red-500/20 p-2 rounded-lg transition-colors">
                <X size={20} />
             </button>
        </div>

        {/* CONTENT GRID */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-black/20">
          
          {/* LEFT: HARDWARE SPECS */}
          <div className="space-y-4">
            <h3 className="text-purple-400 text-[10px] uppercase tracking-widest font-black mb-4 flex items-center gap-2">
                <Cpu size={14}/> Hardware Telemetry
            </h3>
            
            {/* CPU Spec */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:border-purple-500/30 transition-colors">
                <div className="text-slate-400 text-xs font-bold uppercase">CPU Load</div>
                <div className="text-right">
                    <span className="text-white font-mono text-sm block">{node.specs?.cpu || "8 vCPU"}</span>
                    <span className="text-emerald-400 text-[10px] font-bold">Active</span>
                </div>
            </div>

            {/* RAM Spec */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:border-purple-500/30 transition-colors">
                <div className="text-slate-400 text-xs font-bold uppercase">Memory</div>
                <div className="text-right">
                    <span className="text-white font-mono text-sm block">{node.specs?.ram || "32 GB"}</span>
                    <span className="text-purple-400 text-[10px] font-bold">{node.specs?.ramType || "DDR5"}</span>
                </div>
            </div>

            {/* Network Spec */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:border-purple-500/30 transition-colors">
                <div className="text-slate-400 text-xs font-bold uppercase">Network</div>
                <div className="text-right">
                    <span className="text-white font-mono text-sm block">{node.specs?.network || "1 Gbps"}</span>
                    <span className="text-emerald-400 text-[10px] font-bold">Low Latency</span>
                </div>
            </div>
          </div>

          {/* RIGHT: STORAGE VISUALIZATION */}
          <div className="bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center relative">
             <div className="absolute top-4 left-4 text-purple-400 text-[10px] uppercase tracking-widest font-black flex items-center gap-2">
                <Database size={14}/> Storage Pool
             </div>
             
             <div className="h-48 w-full relative mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} 
                    itemStyle={{ color: '#fff' }} 
                    formatter={(value: any) => [`${value.toFixed(1)} GB`, '']} 
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Overlay Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-3xl font-black text-white">{totalGB.toFixed(0)}</span>
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">GB Total</span>
              </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}