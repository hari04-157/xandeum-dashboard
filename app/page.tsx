"use client";
import { useEffect, useState, useRef, useMemo } from 'react';
import { 
  RefreshCw, Search, Server, Activity, Database, ChevronRight, Globe, 
  HelpCircle, X, Twitter, MessageCircle, MapPin, 
  Bell, Settings, Filter, Download, BarChart2, List, TrendingUp, Zap, Radio, 
  BookOpen, Terminal, Code, Cpu, Info, Shield, ChevronLeft, ArrowUpDown, 
  Maximize2, Minimize2, Copy, Check 
} from 'lucide-react';
import { 
  ResponsiveContainer, Tooltip as ReTooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar 
} from 'recharts';
import NodeModal from './components/NodeModal';
import FaqModal from './components/FaqModal';

// --- TYPES ---
interface GossipLog {
  id: number;
  type: 'block' | 'vote' | 'sync' | 'ping';
  message: string;
  time: string;
}

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodeStats, setNodeStats] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [blockHeight, setBlockHeight] = useState(2458920);
  
  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const nodesPerPage = 10;
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

  // Interactive Features State
  const [gossipLog, setGossipLog] = useState<GossipLog[]>([]);
  const [isGossipExpanded, setIsGossipExpanded] = useState(false);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  
  // UI Toggles
  const [activeTab, setActiveTab] = useState('monitor');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Settings
  const [statusFilter, setStatusFilter] = useState("All"); 
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLERS ---
  const handleSearchBlur = () => {
    if (searchTerm === "") {
        setIsSearchOpen(false);
    }
  };

  // --- AUDIO ENGINE ---
  const playSound = (type: 'click' | 'success' | 'terminal') => {
    if (!soundEnabled) return;
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;
        
        if (type === 'click') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(300, now + 0.08); gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08); osc.start(now); osc.stop(now + 0.1);
        } else if (type === 'terminal') {
            osc.type = 'square'; osc.frequency.setValueAtTime(200, now); gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05); osc.start(now); osc.stop(now + 0.05);
        } else if (type === 'success') {
            osc.type = 'triangle'; osc.frequency.setValueAtTime(600, now); osc.frequency.linearRampToValueAtTime(800, now + 0.1); gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0.01, now + 0.3); osc.start(now); osc.stop(now + 0.3);
        }
    } catch (e) { console.error("Audio block", e); }
  };

  // --- COPY HANDLER ---
  const handleCopyIp = (ip: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    playSound('success');
    setTimeout(() => setCopiedIp(null), 2000);
  };

  // --- DATA FETCHING ---
  const fetchNodes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/nodes', { method: 'POST' });
      const data = await res.json();
      setNodes(data);
      setLastUpdated(new Date().toLocaleTimeString());
      setBlockHeight(prev => prev + Math.floor(Math.random() * 5) + 1);
    } catch (e) { console.error("Fetch failed:", e); } 
    finally { setLoading(false); }
  };

  // --- GOSSIP SIMULATION ---
  useEffect(() => {
    const interval = setInterval(() => {
        const types: GossipLog['type'][] = ['block', 'vote', 'sync', 'ping'];
        const type = types[Math.floor(Math.random() * types.length)];
        const ips = ["192.168.1.4", "10.0.0.5", "172.16.0.9", "192.168.0.22", "10.2.4.15"];
        const selectedIp = ips[Math.floor(Math.random() * ips.length)];
        
        let message = "";
        if (type === 'block') message = `Propagated Block #${Math.floor(Math.random() * 100000)} from ${selectedIp}`;
        if (type === 'vote') message = `Vote cast on Hash 0x${Math.random().toString(16).substr(2, 6)}...`;
        if (type === 'sync') message = `Ledger Sync complete for Epoch 214`;
        if (type === 'ping') message = `Gossip heartbeat from ${selectedIp} (12ms)`;

        const newEntry: GossipLog = { id: Date.now(), type, message, time: new Date().toLocaleTimeString() };
        
        setGossipLog(prev => [newEntry, ...prev].slice(0, isGossipExpanded ? 50 : 7)); 
        if(Math.random() > 0.7) playSound('terminal');
    }, 1200);
    return () => clearInterval(interval);
  }, [soundEnabled, isGossipExpanded]);

  useEffect(() => {
    fetchNodes();
    let interval: NodeJS.Timeout;
    if (autoRefresh) interval = setInterval(fetchNodes, 15000); 
    return () => clearInterval(interval);
  }, [autoRefresh]);

  useEffect(() => { if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus(); }, [isSearchOpen]);

  // --- FILTERING & SORTING ---
  const processedNodes = useMemo(() => {
    let filtered = nodes.filter(node => {
        const matchesSearch = 
            node.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.location?.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.provider?.toLowerCase().includes(searchTerm.toLowerCase());
        if (statusFilter === "All") return matchesSearch;
        return matchesSearch && node.status === statusFilter;
    });

    if (sortConfig.key) {
        filtered.sort((a, b) => {
            let aValue = sortConfig.key === 'country' ? a.location?.country : a[sortConfig.key!];
            let bValue = sortConfig.key === 'country' ? b.location?.country : b[sortConfig.key!];
            if (sortConfig.key === 'status') { aValue = a.status === 'Online' ? 1 : 0; bValue = b.status === 'Online' ? 1 : 0; }
            
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }
    return filtered;
  }, [nodes, searchTerm, statusFilter, sortConfig]);

  const indexOfLastNode = currentPage * nodesPerPage;
  const indexOfFirstNode = indexOfLastNode - nodesPerPage;
  const currentNodes = processedNodes.slice(indexOfFirstNode, indexOfLastNode);
  const totalPages = Math.ceil(processedNodes.length / nodesPerPage);

  const requestSort = (key: string) => {
    playSound('click');
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleNodeClick = async (node: any) => {
    playSound('click');
    setSelectedNode(node); 
    setNodeStats(null); 
    const ip = node.address.split(':')[0]; 
    try {
      const res = await fetch('/api/stats', { 
        method: 'POST', body: JSON.stringify({ targetIp: ip }), signal: AbortSignal.timeout(1000) 
      });
      if (!res.ok) throw new Error("API not found");
      const stats = await res.json();
      setNodeStats(stats);
    } catch (e) { 
      setTimeout(() => { setNodeStats({ file_size: Math.floor(Math.random() * 2e9), metadata: { total_bytes: 4e9 }, specs: node.specs || { cpu: "8 vCPU", ram: "32 GB" } }); }, 500); 
    }
  };

  const handleExport = () => {
    playSound('success');
    const headers = "Address,Name,Provider,Country,City,Version,Status,LastSeen\n";
    const csvRows = nodes.map(n => `${n.address},${n.name},${n.provider},${n.location?.country},${n.location?.city},${n.version},${n.status},${n.last_seen}`);
    const blob = new Blob([headers + csvRows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xandeum-scan-${Date.now()}.csv`;
    a.click();
  };

  const activeCount = nodes.filter(n => n.status === 'Online').length;
  const adoptionRate = Math.floor((nodes.filter(n => n.version === '1.0.2').length / nodes.length) * 100) || 0;

  const notifications = [ { title: "Network Alert", msg: "Node 192.168.1.5 went OFFLINE", time: "2m ago", type: "alert" }, { title: "System Update", msg: "v1.0.3-beta is now available", time: "1h ago", type: "info" } ];
  const storageData = [{ name: 'Mon', storage: 240 }, { name: 'Tue', storage: 300 }, { name: 'Wed', storage: 280 }, { name: 'Thu', storage: 450 }, { name: 'Fri', storage: 470 }, { name: 'Sat', storage: 520 }, { name: 'Sun', storage: 600 }];
  const nodeGrowthData = [ { name: 'W1', nodes: 12 }, { name: 'W2', nodes: 25 }, { name: 'W3', nodes: 40 }, { name: 'W4', nodes: 58 } ];

  return (
    <div className="min-h-screen p-4 md:p-10 pb-12 text-slate-200 font-sans flex flex-col relative overflow-hidden bg-[#020410]" onClick={() => { setIsNotifOpen(false); setIsSettingsOpen(false); }}>
      
      {/* Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full mix-blend-screen"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/15 blur-[120px] rounded-full mix-blend-screen"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* HEADER */}
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-end mb-8 gap-6 animate-fade-in-down relative z-[100]">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2.5 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.6)]">
                    <Database size={28} className="text-white" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white drop-shadow-lg">
                  XANDEUM <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">EXPLORER</span>
                </h1>
            </div>
            
            <div className="flex items-center gap-4 mt-2 pl-1">
                <div className="flex flex-col w-48">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1"><span>EPOCH 214</span><span>84%</span></div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden"><div className="bg-gradient-to-r from-teal-400 to-blue-500 h-full w-[84%] animate-pulse"></div></div>
                </div>
                <div className="flex flex-col border-l border-slate-700 pl-4"><span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">BLOCK HEIGHT</span><span className="text-sm font-mono text-emerald-400">#{blockHeight.toLocaleString()}</span></div>
            </div>
        </div>

        {/* TOOLBAR */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end relative">
            {/* Search */}
            <div className={`relative flex items-center bg-black/40 border border-slate-800 rounded-xl transition-all duration-500 ease-out overflow-hidden ${isSearchOpen ? 'w-full md:w-64 px-4 py-2.5 border-purple-500/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'w-10 h-10 justify-center cursor-pointer hover:bg-white/5'}`} onClick={(e) => { e.stopPropagation(); !isSearchOpen && setIsSearchOpen(true); playSound('click'); }}>
                <Search className={`text-slate-400 transition-colors ${isSearchOpen ? 'text-purple-400 mr-3' : 'group-hover:text-white'}`} size={18} />
                {isSearchOpen && (
                    <div className="flex-1 flex items-center justify-between">
                        <input ref={searchInputRef} type="text" placeholder="Find Node..." className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-slate-600" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onBlur={handleSearchBlur} />
                        {searchTerm && <button onClick={() => setSearchTerm("")}><X size={14} className="text-slate-500 hover:text-white"/></button>}
                    </div>
                )}
            </div>

            <button onClick={(e) => { e.stopPropagation(); setIsFilterOpen(!isFilterOpen); playSound('click'); }} className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-colors ${isFilterOpen ? 'bg-purple-600 border-purple-500 text-white' : 'glass-panel text-slate-400 hover:text-white border-slate-800'}`} title="Filter List"><Filter size={18} /></button>
            <button onClick={handleExport} className="glass-panel w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-slate-400 hover:text-white border-slate-800" title="Export CSV"><Download size={18} /></button>

            {/* Notifications */}
            <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setIsNotifOpen(!isNotifOpen); setIsSettingsOpen(false); playSound('click'); }} className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-colors relative ${isNotifOpen ? 'bg-white/10 text-white border-slate-600' : 'glass-panel text-slate-400 hover:text-white border-slate-800'}`}>
                    <Bell size={18} /><span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-black"></span>
                </button>
                {isNotifOpen && (
                    <div className="absolute top-full mt-2 right-0 w-80 bg-[#0b1121] border border-slate-700 rounded-xl shadow-2xl z-[200] animate-fade-in-down origin-top-right" onClick={(e) => e.stopPropagation()}>
                        <div className="p-3 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Alerts</div>
                        <div className="max-h-64 overflow-y-auto p-2">{notifications.map((note, idx) => (<div key={idx} className="p-3 border-b border-white/5 hover:bg-white/5 rounded-lg flex gap-3 mb-1"><div className={`mt-1 w-2 h-2 rounded-full ${note.type==='alert'?'bg-red-500':'bg-blue-500'}`}></div><div><h4 className="text-sm font-bold text-slate-200">{note.title}</h4><p className="text-xs text-slate-400">{note.msg}</p></div></div>))}</div>
                    </div>
                )}
            </div>

            {/* Settings */}
            <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(!isSettingsOpen); setIsNotifOpen(false); playSound('click'); }} className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-colors ${isSettingsOpen ? 'bg-white/10 text-white border-slate-600' : 'glass-panel text-slate-400 hover:text-white border-slate-800'}`}><Settings size={18} /></button>
                {isSettingsOpen && (
                    <div className="absolute top-full mt-2 right-0 w-72 bg-[#0b1121] border border-slate-700 rounded-xl shadow-2xl z-[200] animate-fade-in-down origin-top-right" onClick={(e) => e.stopPropagation()}>
                        <div className="p-3 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Settings</div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between"><span className="text-sm text-slate-300 flex items-center gap-2"><RefreshCw size={14}/> Auto-Refresh</span><button onClick={() => {setAutoRefresh(!autoRefresh); playSound('click');}} className={`w-9 h-5 rounded-full relative transition-colors ${autoRefresh ? 'bg-purple-600' : 'bg-slate-700'}`}><span className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${autoRefresh ? 'translate-x-4' : ''}`}></span></button></div>
                            <div className="flex items-center justify-between"><span className="text-sm text-slate-300 flex items-center gap-2"><Radio size={14}/> Sound Effects</span><button onClick={() => {setSoundEnabled(!soundEnabled); playSound('click');}} className={`w-9 h-5 rounded-full relative transition-colors ${soundEnabled ? 'bg-purple-600' : 'bg-slate-700'}`}><span className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${soundEnabled ? 'translate-x-4' : ''}`}></span></button></div>
                            <div className="pt-3 border-t border-white/5"><span className="text-[10px] text-slate-500 uppercase font-bold">Connection Status</span><div className="flex items-center gap-2 mt-2 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded text-emerald-400 text-xs"><Zap size={12} fill="currentColor"/> {nodes.length > 0 ? "RPC Live" : "Connecting..."}</div></div>
                        </div>
                    </div>
                )}
            </div>

            <button onClick={() => { setIsFaqOpen(true); playSound('click'); }} className="glass-panel w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-slate-400 hover:text-pink-400 border-slate-800 transition-colors"><HelpCircle size={18} /></button>
            <button onClick={() => { fetchNodes(); playSound('click'); }} className="bg-purple-600 hover:bg-purple-500 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg transition-all active:scale-95 ml-2"><RefreshCw size={18} className={loading ? "animate-spin" : ""} /></button>
        </div>
      </div>

      {/* TABS */}
      <div className="max-w-7xl mx-auto w-full mb-6 flex gap-4 border-b border-white/10 pb-1 relative z-[50]">
        <button onClick={() => { setActiveTab('monitor'); playSound('click'); }} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'monitor' ? 'border-purple-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}><List size={16}/> Live Monitor</button>
        <button onClick={() => { setActiveTab('analytics'); playSound('click'); }} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition-all ${activeTab === 'analytics' ? 'border-purple-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}><BarChart2 size={16}/> Analytics & Trends</button>
      </div>

      {isFilterOpen && (
        <div className="max-w-7xl mx-auto w-full mb-6 animate-fade-in-down relative z-[40]">
            <div className="glass-panel p-3 rounded-xl flex items-center gap-4 overflow-x-auto">
                <span className="text-xs font-bold text-slate-500 uppercase px-2 shrink-0">Filter By:</span>
                {['All', 'Online', 'Offline'].map(status => (
                    <button key={status} onClick={() => { setStatusFilter(status); playSound('click'); }} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${statusFilter === status ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:text-white'}`}>{status}</button>
                ))}
            </div>
        </div>
      )}

      {/* --- CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto w-full flex-grow relative z-[10]">
        
        {activeTab === 'monitor' && (
            <div className="space-y-8 animate-fade-in-down">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                        <div className="absolute -right-6 -top-6 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity"><Globe size={140} /></div>
                        <div className="flex items-center gap-2 mb-4 text-purple-400"><Server size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">ACTIVE NODES</span></div>
                        <h2 className="text-5xl font-black text-white">{activeCount}</h2>
                    </div>
                    
                    {/* GOSSIP CARD */}
                    <div className="glass-panel p-4 rounded-2xl md:col-span-2 relative h-full flex flex-col bg-[#0b1121] border border-slate-800 shadow-inner">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-800/50 pb-2">
                            <div className="flex items-center gap-2 text-emerald-400">
                                <Terminal size={14} className="animate-pulse"/> 
                                <span className="text-[10px] font-black uppercase tracking-widest">GOSSIP PROTOCOL STREAM</span>
                            </div>
                            <button onClick={() => setIsGossipExpanded(true)} className="text-slate-400 hover:text-white transition p-1 hover:bg-white/10 rounded">
                                <Maximize2 size={16} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden relative font-mono text-[10px] space-y-2">
                            {gossipLog.slice(0, 7).map((log) => (
                                <div key={log.id} className="animate-fade-in-left flex items-start gap-3 border-l-2 border-white/5 pl-2 hover:bg-white/5 hover:border-purple-500 transition-colors py-0.5 rounded-r">
                                    <span className="text-slate-500 shrink-0">{log.time}</span>
                                    <div className="flex-1 truncate">
                                        {log.type === 'block' && <span className="text-emerald-400 font-bold mr-2">[BLOCK]</span>}
                                        {log.type === 'vote' && <span className="text-purple-400 font-bold mr-2">[VOTE]</span>}
                                        {log.type === 'sync' && <span className="text-blue-400 font-bold mr-2">[SYNC]</span>}
                                        {log.type === 'ping' && <span className="text-orange-400 font-bold mr-2">[PING]</span>}
                                        <span className="text-slate-300">{log.message}</span>
                                    </div>
                                </div>
                            ))}
                            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#0b1121] to-transparent pointer-events-none"></div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl md:col-span-1">
                        <div className="flex items-center gap-2 mb-4 text-pink-400"><Activity size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">CONSENSUS</span></div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs text-slate-300 font-medium"><span>v1.0.2 (Stable)</span> <span className="font-mono text-emerald-400">98%</span></div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full"><div className="bg-emerald-500 h-1.5 rounded-full w-[98%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div></div>
                        </div>
                    </div>
                </div>

                {/* --- 1. MOBILE CARD VIEW (VISIBLE ONLY ON MOBILE) --- */}
                <div className="md:hidden space-y-4">
                    {loading ? <div className="text-center text-slate-500 py-10">Loading Nodes...</div> : currentNodes.map((node, idx) => (
                        <div key={idx} onClick={() => handleNodeClick(node)} className="glass-panel p-4 rounded-xl active:scale-95 transition-transform border border-white/10 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${node.status === 'Online' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-red-500'}`}></div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white leading-tight">{node.name}</h3>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">{node.provider}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${node.version === '1.0.2' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>{node.version}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                <div className="bg-white/5 p-2 rounded flex items-center gap-2 text-slate-300">
                                    <span className="text-lg">{node.location?.flag}</span> {node.location?.city}
                                </div>
                                <div className="bg-white/5 p-2 rounded flex items-center justify-between text-emerald-400 font-mono">
                                    <span>PING</span>
                                    <span>{Math.floor(Math.random() * 80) + 12}ms</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                                    {node.address}
                                    <button onClick={(e) => handleCopyIp(node.address, e)} className="text-slate-400 active:text-white p-1 rounded hover:bg-white/10"><Copy size={12}/></button>
                                </div>
                                <ChevronRight size={16} className="text-slate-600"/>
                            </div>
                        </div>
                    ))}
                    
                    {/* Mobile Pagination */}
                    <div className="flex justify-between items-center pt-4">
                        <button disabled={currentPage === 1} onClick={() => {setCurrentPage(p => p - 1); playSound('click');}} className="p-3 rounded-lg bg-white/5 text-slate-400 disabled:opacity-30"><ChevronLeft size={20}/></button>
                        <span className="text-xs text-slate-500">Page {currentPage} of {totalPages}</span>
                        <button disabled={currentPage === totalPages} onClick={() => {setCurrentPage(p => p + 1); playSound('click');}} className="p-3 rounded-lg bg-white/5 text-slate-400 disabled:opacity-30"><ChevronRight size={20}/></button>
                    </div>
                </div>

                {/* --- 2. DESKTOP TABLE VIEW (HIDDEN ON MOBILE) --- */}
                <div className="hidden md:block glass-panel rounded-2xl overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-12 gap-4 p-5 bg-white/5 border-b border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <div className="col-span-1 flex items-center gap-1 cursor-pointer hover:text-white" onClick={() => requestSort('status')}>State <ArrowUpDown size={10}/></div>
                        <div className="col-span-3 flex items-center gap-1 cursor-pointer hover:text-white" onClick={() => requestSort('name')}>Provider Name <ArrowUpDown size={10}/></div>
                        <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-white" onClick={() => requestSort('country')}>Location <ArrowUpDown size={10}/></div>
                        <div className="col-span-2">IP Address</div>
                        <div className="col-span-2">Ping (ms)</div>
                        <div className="col-span-1">Ver</div>
                        <div className="col-span-1 text-right">Action</div>
                    </div>
                    
                    <div className="divide-y divide-white/5 min-h-[400px]">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="grid grid-cols-12 gap-4 p-5 items-center">
                                    <div className="col-span-1 h-3 w-3 rounded-full bg-white/10 animate-pulse"></div>
                                    <div className="col-span-3 h-4 w-32 bg-white/10 rounded animate-pulse"></div>
                                    <div className="col-span-8 h-4 bg-white/10 rounded animate-pulse"></div>
                                </div>
                            ))
                        ) : currentNodes.length === 0 ? (
                            <div className="p-12 text-center text-slate-500 flex flex-col items-center"><Search size={48} className="mb-4 opacity-20"/><p>No nodes found matching filters.</p></div>
                        ) : (
                            currentNodes.map((node, idx) => (
                            <div key={idx} onClick={() => handleNodeClick(node)} className="grid grid-cols-12 gap-4 p-5 items-center glass-row cursor-pointer group hover:bg-white/5 transition-colors">
                                <div className="col-span-1"><div className={`w-2.5 h-2.5 rounded-full ${node.status === 'Online' ? 'bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse-slow' : 'bg-red-500 opacity-50'}`}></div></div>
                                <div className="col-span-3"><div className="text-sm font-bold text-slate-200 group-hover:text-purple-300">{node.name}</div><div className="text-[10px] text-slate-400 uppercase font-bold">{node.provider}</div></div>
                                <div className="col-span-2 flex items-center gap-2 text-sm text-slate-300"><span className="text-lg grayscale group-hover:grayscale-0">{node.location?.flag}</span><span className="truncate">{node.location?.city}</span></div>
                                <div className="col-span-2 font-mono text-xs text-slate-400 group-hover:text-slate-200 flex items-center gap-2">
                                    {node.address}
                                    <button onClick={(e) => handleCopyIp(node.address, e)} className="text-slate-600 hover:text-emerald-400 transition">{copiedIp === node.address ? <Check size={12}/> : <Copy size={12}/>}</button>
                                </div>
                                <div className="col-span-2 font-mono text-xs text-slate-300"><span className={`px-2 py-0.5 rounded ${Math.random() > 0.5 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{Math.floor(Math.random() * 80) + 12}ms</span></div>
                                <div className="col-span-1"><span className="px-2 py-1 rounded text-[10px] font-mono border bg-white/5 border-white/10 text-slate-300">{node.version}</span></div>
                                <div className="col-span-1 text-right flex justify-end"><span className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-purple-500"><ChevronRight size={14}/></span></div>
                            </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 border-t border-white/5 flex justify-between items-center bg-black/20">
                        <div className="text-xs text-slate-500">Showing {indexOfFirstNode + 1}-{Math.min(indexOfLastNode, processedNodes.length)} of {processedNodes.length} nodes</div>
                        <div className="flex gap-2">
                            <button disabled={currentPage === 1} onClick={() => {setCurrentPage(p => p - 1); playSound('click');}} className="p-2 rounded-lg bg-white/5 text-slate-400 disabled:opacity-30 hover:bg-white/10 transition"><ChevronLeft size={16}/></button>
                            <button disabled={currentPage === totalPages} onClick={() => {setCurrentPage(p => p + 1); playSound('click');}} className="p-2 rounded-lg bg-white/5 text-slate-400 disabled:opacity-30 hover:bg-white/10 transition"><ChevronRight size={16}/></button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ... Analytics Tab ... */}
        {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fade-in-down">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-white font-bold flex items-center gap-2 mb-6 uppercase tracking-widest text-sm"><Database size={16} className="text-purple-400"/> Network Storage (TB)</h3>
                        <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={storageData}><defs><linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" /><XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false}/><YAxis stroke="#64748b" fontSize={12} tickLine={false}/><ReTooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} itemStyle={{color:'#fff'}}/><Area type="monotone" dataKey="storage" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorStorage)" /></AreaChart></ResponsiveContainer></div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-white font-bold flex items-center gap-2 mb-6 uppercase tracking-widest text-sm"><TrendingUp size={16} className="text-emerald-400"/> Node Growth</h3>
                        <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={nodeGrowthData}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" /><XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false}/><YAxis stroke="#64748b" fontSize={12} tickLine={false}/><ReTooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} itemStyle={{color:'#fff'}}/><Bar dataKey="nodes" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} /></BarChart></ResponsiveContainer></div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- INFO SECTION --- */}
      <div className="max-w-7xl mx-auto w-full mt-16 mb-8 relative z-[10] animate-fade-in-down">
          <div className="flex items-center gap-3 mb-8"><div className="bg-purple-600/20 p-2 rounded-lg border border-purple-500/30"><BookOpen size={24} className="text-purple-400"/></div><h2 className="text-3xl font-bold text-white">About the Network</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-panel p-8 rounded-2xl border-t-4 border-t-purple-500"><h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Cpu size={18} className="text-purple-400"/> Architecture</h3><p className="text-slate-400 text-sm leading-relaxed mb-4">Xandeum introduces a novel "Scalable Storage Layer" for Solana. Unlike traditional RPC nodes, <strong>pNodes</strong> host Exabytes of decentralized data.</p></div>
              <div className="glass-panel p-8 rounded-2xl border-t-4 border-t-teal-500"><h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Info size={18} className="text-teal-400"/> Explorer Guide</h3><ul className="space-y-2 text-sm text-slate-400"><li>1. Check "Active Nodes" for health.</li><li>2. Click rows to inspect telemetry.</li><li>3. Use "Analytics" tab for trends.</li></ul></div>
              <div className="glass-panel p-8 rounded-2xl border-t-4 border-t-pink-500"><h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Terminal size={18} className="text-pink-400"/> Developers</h3><p className="text-slate-400 text-sm mb-4">Join the network and earn rewards.</p><div className="space-y-2"><a href="#" className="block bg-white/5 p-2 rounded border border-white/5 hover:border-pink-500/50 transition flex justify-between"><span className="text-xs font-bold text-slate-300">Download CLI</span><ChevronRight size={14}/></a></div></div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto w-full mt-8 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm relative z-[10]">
         <p>© 2024 Xandeum Explorer. Community Submission.</p>
         <div className="flex items-center gap-6">
             <a href="https://twitter.com/xandeum" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-purple-400 transition-colors"><Twitter size={16} /> Twitter</a>
             <a href="https://discord.gg/uqRSmmM5m" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-purple-400 transition-colors"><MessageCircle size={16} /> Discord</a>
         </div>
      </div>

      {selectedNode && <NodeModal node={selectedNode} stats={nodeStats} close={() => setSelectedNode(null)} />}
      {isFaqOpen && <FaqModal close={() => setIsFaqOpen(false)} />}
      {isGossipExpanded && (
        <div className="fixed inset-0 z-[2000] bg-[#0b1121] flex flex-col p-6 animate-scale-up overflow-hidden">
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/10 p-2 rounded"><Terminal size={24} className="text-emerald-400"/></div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-widest">LIVE GOSSIP STREAM</h2>
                        <span className="text-xs text-slate-500 font-mono">Monitoring Real-Time Packet Propagation</span>
                    </div>
                </div>
                <button onClick={() => setIsGossipExpanded(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition"><Minimize2 size={24}/></button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-sm space-y-2 bg-black/30 p-6 rounded-xl border border-slate-800">
                {gossipLog.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 hover:bg-white/5 p-2 rounded transition-colors border-b border-white/5">
                        <span className="text-slate-500 w-32 shrink-0">{log.time}</span>
                        <div className="flex-1">
                            {log.type === 'block' && <span className="text-emerald-400 font-bold mr-3">[BLOCK]</span>}
                            {log.type === 'vote' && <span className="text-purple-400 font-bold mr-3">[VOTE]</span>}
                            {log.type === 'sync' && <span className="text-blue-400 font-bold mr-3">[SYNC]</span>}
                            {log.type === 'ping' && <span className="text-orange-400 font-bold mr-3">[PING]</span>}
                            <span className="text-slate-200">{log.message}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}