import React, { useState, useEffect } from 'react';
import { Languages, Settings as SettingsIcon, Camera, CheckCircle } from 'lucide-react';

const translations = {
  am: {
    title: "ቅንብር",
    subtitle: "የመገለጫ ማስተካከያ",
    fullName: "ሙሉ ስም",
    email: "ኢሜይል",
    saveBtn: "ለውጦችን አስቀምጥ",
    successMsg: "መረጃው ተቀምጧል! ✅",
    photoError: "የፎቶው መጠን በጣም ትልቅ ነው። እባክዎ ከ 1MB ያነሰ ፎቶ ይምረጡ።",
    saveError: "ስህተት፡ ፎቶው በጣም ትልቅ ስለሆነ ሊቀመጥ አልቻለም።",
    toggle: "English" // Button shows 'English' when UI is in Amharic
  },
  en: {
    title: "Settings",
    subtitle: "Profile Adjustment",
    fullName: "Full Name",
    email: "Email",
    saveBtn: "Save Changes",
    successMsg: "Information Saved! ✅",
    photoError: "Photo size is too large. Please select a photo under 1MB.",
    saveError: "Error: Photo is too large to be saved.",
    toggle: "አማርኛ" // Button shows 'አማርኛ' when UI is in English
  }
};

const Settings = () => {
  // CHANGE: Initial state set to 'en' so it starts in English
  const [lang, setLang] = useState('en'); 
  const t = translations[lang];

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    photo: null
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('user') || 'Admin User';
    const savedEmail = localStorage.getItem('email') || 'admin@example.com';
    const savedPhoto = localStorage.getItem('userPhoto') || null;

    setUserData({
      name: savedName,
      email: savedEmail,
      photo: savedPhoto
    });
  }, []);

  const toggleLanguage = () => setLang(prev => (prev === 'am' ? 'en' : 'am'));

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert(t.photoError);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('user', userData.name);
      localStorage.setItem('email', userData.email);
      if (userData.photo) {
        localStorage.setItem('userPhoto', userData.photo);
      }
      setMessage(t.successMsg);
      setTimeout(() => {
        window.location.reload(); 
      }, 1000);
    } catch (error) {
      alert(t.saveError);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 bg-sky-400 min-h-screen relative">
      
      {/* Language Toggle Button */}
      <button 
        onClick={toggleLanguage}
        className="absolute top-6 right-8 bg-white/90 hover:bg-white px-5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 font-black text-sky-600 transition-all active:scale-95 z-10"
      >
        <Languages size={18} /> {t.toggle}
      </button>

      {/* Header Section */}
      <div className="bg-white/95 backdrop-blur-sm p-6 rounded-[2rem] shadow-xl border border-white/20 flex items-center gap-4">
        <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 shadow-inner">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase">{t.title}</h1>
          <p className="text-slate-500 text-sm font-medium">{t.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-white/95 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-2xl border border-white/20 text-center space-y-6 flex flex-col items-center justify-center">
          <div className="relative inline-block">
            {userData.photo ? (
              <img src={userData.photo} alt="Profile" className="w-40 h-40 rounded-full object-cover border-8 border-white shadow-2xl transition-transform hover:scale-105" />
            ) : (
              <div className="w-40 h-40 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-5xl font-black border-8 border-white shadow-2xl">
                {userData.name ? userData.name.charAt(0).toUpperCase() : 'A'}
              </div>
            )}
            <label className="absolute bottom-2 right-2 bg-sky-500 w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-sky-600 border-4 border-white transition-all hover:rotate-12">
              <Camera size={20} className="text-white" />
              <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
            </label>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{userData.name}</h2>
            <p className="text-sky-600 font-bold text-sm uppercase tracking-widest">{userData.email}</p>
          </div>
        </div>
        
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-2xl border border-white/20">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">{t.fullName}</label>
                <input 
                  type="text" 
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 font-bold text-slate-700 transition-all" 
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">{t.email}</label>
                <input 
                  type="email" 
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 font-bold text-slate-700 transition-all" 
                  required
                />
              </div>
            </div>
            
            {message && (
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-center font-black animate-bounce border border-emerald-100 flex items-center justify-center gap-2">
                <CheckCircle size={18} /> {message}
              </div>
            )}
            
            <button 
              type="submit" 
              className="w-full md:w-auto px-16 py-5 bg-sky-500 text-white rounded-2xl font-black shadow-lg shadow-sky-500/40 hover:bg-sky-600 hover:-translate-y-1 transition-all uppercase text-sm tracking-widest active:scale-95"
            >
              {t.saveBtn}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;