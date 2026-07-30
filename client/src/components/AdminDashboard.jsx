import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';
import { 
  Users, UserPlus, CheckCircle, LayoutDashboard, BarChart3, Languages 
} from 'lucide-react';

// List of language translations
const translations = {
  am: {
    dashboardTitle: "የአስተዳዳሪ ዳሽቦርድ",
    subTitle: "የሊዶችን አጠቃላይ እንቅስቃሴ በግራፍ ይከታተሉ",
    totalLeads: "ጠቅላላ ሊዶች",
    new: "አዳዲስ",
    won: "የተሳኩ (Won)",
    contacted: "ተደውሎላቸዋል",
    barTitle: "የሊዶች ሁኔታ (Bar Chart)",
    pieTitle: "የመቶኛ ድርሻ (Pie Chart)",
    loading: "መረጃ በመጫን ላይ...",
    toggle: "English"
  },
  en: {
    dashboardTitle: "Admin Dashboard",
    subTitle: "Track lead activities through graphs and analytics",
    totalLeads: "Total Leads",
    new: "New",
    won: "Won",
    contacted: "Contacted",
    barTitle: "Leads Status (Bar Chart)",
    pieTitle: "Percentage Distribution (Pie Chart)",
    loading: "Loading data...",
    toggle: "አማርኛ"
  }
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalLeads: 0, newLeads: 0, wonLeads: 0 });
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // CHANGE: Initialized state to 'en' for English default
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leads');
      const data = response.data;
      
      const newCount = data.filter(l => l.status === 'New').length;
      const wonCount = data.filter(l => l.status === 'Won').length;
      const contactedCount = data.filter(l => l.status === 'Contacted' || l.status === 'Qualified').length;

      setStats({
        totalLeads: data.length,
        newLeads: newCount,
        wonLeads: wonCount
      });

      // Map graph data using current translation
      setGraphData([
        { name: t.new, value: newCount, color: '#f59e0b' },
        { name: t.contacted, value: contactedCount, color: '#0ea5e9' },
        { name: t.won, value: wonCount, color: '#10b981' },
      ]);

    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, [t.new, t.contacted, t.won]); // Re-run when labels change

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'am' ? 'en' : 'am'));
  };

  if (loading) return <div className="p-8 text-white text-center font-bold">{t.loading}</div>;

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 bg-sky-400 min-h-screen">
      
      {/* Header Section */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white/30 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="text-sky-500" /> {t.dashboardTitle}
          </h1>
          <p className="text-slate-500 text-sm font-medium">{t.subTitle}</p>
        </div>
        
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-xl font-bold transition-all shadow-lg active:scale-95"
        >
          <Languages size={18} />
          {t.toggle}
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users />} label={t.totalLeads} value={stats.totalLeads} color="sky" />
        <StatCard icon={<UserPlus />} label={t.new} value={stats.newLeads} color="amber" />
        <StatCard icon={<CheckCircle />} label={t.won} value={stats.wonLeads} color="emerald" />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-sky-500" />
            <h3 className="text-lg font-black text-slate-800 uppercase">{t.barTitle}</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                  {graphData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-white/20 flex flex-col items-center">
             <h3 className="text-lg font-black text-slate-800 uppercase self-start mb-6">{t.pieTitle}</h3>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={graphData}
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {graphData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
             </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    sky: "border-sky-300 text-sky-600 bg-sky-50 shadow-sky-200/50",
    amber: "border-amber-400 text-amber-600 bg-amber-50 shadow-amber-200/50",
    emerald: "border-emerald-400 text-emerald-600 bg-emerald-50 shadow-emerald-200/50"
  };
  return (
    <div className={`bg-white/95 backdrop-blur-sm p-6 rounded-[2rem] border-b-8 shadow-xl transition-all hover:-translate-y-2 ${colors[color].split(' ')[0]}`}>
      <div className="flex items-center gap-4 mb-3">
        <div className={`p-4 rounded-2xl ${colors[color].split(' ')[2]} ${colors[color].split(' ')[1]}`}>{icon}</div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-4xl font-black text-slate-800 ml-1">{value}</div>
    </div>
  );
};

export default AdminDashboard;