import React, { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  X, 
  Languages 
} from 'lucide-react';

const translations = {
  am: {
    dashboard: "ዳሽቦርድ",
    leads: "ደንበኞች",
    admin: "አስተዳዳሪ",
    settings: "ቅንብር",
    welcome: "እንኳን ደህና መጡ",
    logout: "ውጣ",
    confirmLogout: "ለመውጣት እርግጠኛ ነዎት? 🚪",
    role: "አስተዳዳሪ",
    toggle: "English"
  },
  en: {
    dashboard: "Dashboard",
    leads: "Leads",
    admin: "Admin",
    settings: "Settings",
    welcome: "Welcome",
    logout: "Logout",
    confirmLogout: "Are you sure you want to logout? 🚪",
    role: "Administrator",
    toggle: "አማርኛ"
  }
};

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  // CHANGE: Initialized state to 'en' so the layout starts in English
  const [lang, setLang] = useState('en'); 
  
  const t = translations[lang];
  const location = useLocation();

  const [userName, setUserName] = useState(localStorage.getItem('user') || 'Admin User');
  const [userPhoto, setUserPhoto] = useState(localStorage.getItem('userPhoto') || null);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) {
        setUserName(e.detail.name);
        setUserPhoto(e.detail.photo);
      } else {
        setUserName(localStorage.getItem('user') || 'Admin User');
        setUserPhoto(localStorage.getItem('userPhoto') || null);
      }
    };

    window.addEventListener('profileUpdate', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('profileUpdate', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const menuItems = [
    { path: '/', label: t.dashboard, icon: <LayoutDashboard size={20}/> },
    { path: '/leads', label: t.leads, icon: <Users size={20}/> },
    { path: '/admin', label: t.admin, icon: <UserCog size={20}/> },
    { path: '/settings', label: t.settings, icon: <SettingsIcon size={20}/> },
  ];

  const toggleLanguage = () => setLang(prev => (prev === 'am' ? 'en' : 'am'));

  const handleLogout = () => {
    if (window.confirm(t.confirmLogout)) {
      localStorage.clear(); 
      window.location.href = '/login'; 
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-slate-50 text-slate-900">
      
      {/* Sidebar Section */}
      <aside 
        className={`${isOpen ? 'w-64' : 'w-20'} bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col shadow-2xl fixed h-full z-50`}
      >
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800 text-white">
          {isOpen && <span className="font-black tracking-wider text-blue-400 uppercase">Lead Pro</span>}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="hover:bg-slate-800 p-2 rounded-xl transition-colors"
          >
            {isOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
        
        {/* Language Toggle */}
        <div className="px-4 pt-6">
          <button 
            onClick={toggleLanguage}
            className={`flex items-center gap-4 p-4 w-full rounded-2xl bg-slate-800/40 hover:bg-slate-800 text-blue-400 transition-all border border-slate-800 shadow-inner group`}
          >
            <Languages size={20} className="group-hover:rotate-12 transition-transform" />
            {isOpen && <span className="font-bold text-sm tracking-wide">{t.toggle}</span>}
          </button>
        </div>

        {/* Sidebar Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 mt-2">
          {menuItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                    : 'hover:bg-slate-800 hover:text-white text-slate-400'
                }`
              }
            >
              <div className="flex items-center justify-center">{item.icon}</div>
              {isOpen && <span className="font-bold text-sm tracking-wide">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        
        {/* Logout Section */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 p-4 w-full rounded-2xl hover:bg-red-500/10 hover:text-red-400 transition-all text-slate-400 group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            {isOpen && <span className="font-bold text-sm">{t.logout}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'} min-h-screen`}
      >
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              {menuItems.find(i => i.path === location.pathname)?.label || t.welcome}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">{t.role}</p>
              <p className="text-sm font-bold text-slate-700">{userName}</p>
            </div>
            
            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-white shadow-lg shadow-blue-100 flex items-center justify-center bg-blue-600">
              {userPhoto ? (
                <img src={userPhoto} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <span className="font-bold text-white uppercase">{userName.charAt(0)}</span>
              )}
            </div>
          </div>
        </header>
        
        {/* Dynamic Page Content */}
        <div className="p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;