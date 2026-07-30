import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import LeadTable from '../components/LeadTable';
import { Users, UserPlus, CheckCircle, TrendingUp, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalLeads: 0, newLeads: 0, wonLeads: 0 });
  const [loading, setLoading] = useState(true);

  // Wrap function in useCallback to prevent infinite re-render loops
  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leads');
      const data = response.data;
      setStats({
        totalLeads: data.length,
        newLeads: data.filter(l => l.status === 'New').length,
        wonLeads: data.filter(l => l.status === 'Won').length
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]); // Ensure fetchStats is in the dependency array for stability

  if (loading) return <div className="flex justify-center p-20 font-bold">Loading...</div>;

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 italic">Welcome Back! 👋</h2>
          <p className="text-slate-500 font-medium">Monitor today's business activity</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <Calendar size={16} className="text-blue-600" />
          <span className="text-sm font-bold text-slate-600">
             {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
      </header>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<Users size={24} />} label="Total Leads" value={stats.totalLeads} color="blue" />
        <StatCard icon={<UserPlus size={24} />} label="New Leads" value={stats.newLeads} color="amber" />
        <StatCard icon={<CheckCircle size={24} />} label="Won Leads" value={stats.wonLeads} color="emerald" />
      </div>

      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp size={20} className="text-slate-400" />
          <h3 className="font-black text-slate-800">Recent Activities</h3>
        </div>
        <LeadTable />
      </section>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200"
  };

  return (
    <div className={`bg-white p-6 rounded-[2rem] border-b-4 ${colors[color]} shadow-sm hover:-translate-y-1 transition-all`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-4 rounded-2xl ${colors[color].split(' ')[0]} ${colors[color].split(' ')[1]}`}>
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{label}</span>
      </div>
      <div className="text-4xl font-black text-slate-800">{value}</div>
    </div>
  );
};

export default Dashboard;