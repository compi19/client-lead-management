import React, { useState } from 'react';
import { createLead } from '../api/leadApi'; 
import { Languages, Phone } from 'lucide-react'; 

const translations = {
  am: {
    title: "አዲስ ሊድ መመዝገቢያ",
    subtitle: "የደንበኛውን መረጃ በጥንቃቄ ይሙሉ",
    fullName: "ሙሉ ስም",
    fullNamePlaceholder: "ለምሳሌ፦ አበበ ካሳ",
    phone: "ስልክ ቁጥር",
    status: "ደረጃ (Status)",
    source: "የመረጃ ምንጭ (Source)",
    email: "ኢሜይል (ካለ)",
    note: "ተጨማሪ ማስታወሻ",
    notePlaceholder: "ስለ ደንበኛው ተጨማሪ መረጃ...",
    submit: "መረጃውን መዝግብ",
    submitting: "በመመዝገብ ላይ...",
    successMsg: "ሊዱ በተሳካ ሁኔታ ተመዝግቧል! ✅",
    errorMsg: "ስህተት ተከስቷል! ሰርቨሩ መነሳቱን ያረጋግጡ። ❌",
    toggle: "English", // In Amharic mode, show 'English'
    statuses: { New: "አዲስ", Contacted: "ተደውሎለታል", Qualified: "ብቁ", Won: "የተሳካ" },
    sources: { Facebook: "Facebook", TikTok: "TikTok", Telegram: "Telegram", Google: "Google", Referral: "በሰው የመጣ", Other: "ሌላ" },
    countries: [
      { code: "+251", name: "ኢትዮጵያ" },
      { code: "+1", name: "USA" },
      { code: "+44", name: "UK" },
      { code: "+971", name: "UAE" }
    ]
  },
  en: {
    title: "New Lead Registration",
    subtitle: "Please fill in the client information carefully",
    fullName: "Full Name",
    fullNamePlaceholder: "e.g. Abebe Kassa",
    phone: "Phone Number",
    status: "Status",
    source: "Lead Source",
    email: "Email (Optional)",
    note: "Additional Note",
    notePlaceholder: "Extra information about the client...",
    submit: "Register Information",
    submitting: "Registering...",
    successMsg: "Lead registered successfully! ✅",
    errorMsg: "An error occurred! Check if the server is running. ❌",
    toggle: "አማርኛ", // In English mode, show 'አማርኛ'
    statuses: { New: "New", Contacted: "Contacted", Qualified: "Qualified", Won: "Won" },
    sources: { Facebook: "Facebook", TikTok: "TikTok", Telegram: "Telegram", Google: "Google", Referral: "Referral", Other: "Other" },
    countries: [
      { code: "+251", name: "Ethiopia" },
      { code: "+1", name: "USA" },
      { code: "+44", name: "UK" },
      { code: "+971", name: "UAE" }
    ]
  }
};

const LeadForm = ({ onLeadAdded }) => {
  // CHANGE: Defaulted to 'en' so the form starts in English
  const [lang, setLang] = useState('en'); 
  const t = translations[lang];

  const [leadData, setLeadData] = useState({
    fullName: '', 
    countryCode: '+251', 
    phone: '', 
    email: '', 
    source: 'Facebook', 
    note: '', 
    status: 'New'
  });

  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleLanguage = () => setLang(prev => (prev === 'am' ? 'en' : 'am'));

  const handleChange = (e) => {
    setLeadData({ ...leadData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    const fullPhoneNumber = `${leadData.countryCode}${leadData.phone}`;
    const dataToSend = { ...leadData, phone: fullPhoneNumber };

    try {
      await createLead(dataToSend);
      setMessage({ text: t.successMsg, type: 'success' });
      if (onLeadAdded) onLeadAdded(); 
      
      setLeadData({ 
        fullName: '', countryCode: '+251', phone: '', email: '', 
        source: 'Facebook', note: '', status: 'New' 
      });
      
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    } catch (error) {
      setMessage({ text: t.errorMsg, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.topBar}>
        <button onClick={toggleLanguage} style={styles.langToggle}>
          <Languages size={18} /> {t.toggle}
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>{t.title}</h2>
          <p style={styles.subtitle}>{t.subtitle}</p>
        </div>

        {message.text && (
          <div style={{ 
            ...styles.alert, 
            backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2', 
            color: message.type === 'success' ? '#166534' : '#991b1b' 
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t.fullName}</label>
            <input 
              type="text" name="fullName" placeholder={t.fullNamePlaceholder}
              value={leadData.fullName} onChange={handleChange} required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>{t.phone}</label>
            <div style={styles.phoneWrapper}>
              <select 
                name="countryCode" 
                value={leadData.countryCode} 
                onChange={handleChange} 
                style={styles.countryDropdown}
              >
                {t.countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.name})
                  </option>
                ))}
              </select>
              <input 
                type="tel" name="phone" placeholder="912345678" 
                value={leadData.phone} onChange={handleChange} required 
                style={styles.phoneInput}
              />
            </div>
          </div>

          <div style={styles.grid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t.status}</label>
              <select name="status" value={leadData.status} onChange={handleChange} style={styles.input}>
                <option value="New">{t.statuses.New}</option>
                <option value="Contacted">{t.statuses.Contacted}</option>
                <option value="Qualified">{t.statuses.Qualified}</option>
                <option value="Won">{t.statuses.Won}</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{t.source}</label>
              <select name="source" value={leadData.source} onChange={handleChange} style={styles.input}>
                <option value="Facebook">{t.sources.Facebook}</option>
                <option value="TikTok">{t.sources.TikTok}</option>
                <option value="Telegram">{t.sources.Telegram}</option>
                <option value="Google">{t.sources.Google}</option>
                <option value="Referral">{t.sources.Referral}</option>
                <option value="Other">{t.sources.Other}</option>
              </select>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>{t.email}</label>
            <input 
              type="email" name="email" placeholder="example@mail.com"
              value={leadData.email} onChange={handleChange} 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>{t.note}</label>
            <textarea 
              name="note" placeholder={t.notePlaceholder} 
              value={leadData.note} onChange={handleChange} 
              style={{ ...styles.input, height: '80px', resize: 'none' }}
            />
          </div>

          <button 
            type="submit" 
            style={{...styles.button, opacity: isSubmitting ? 0.7 : 1}} 
            disabled={isSubmitting}
          >
            {isSubmitting ? t.submitting : t.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#38bdf8', minHeight: '100vh' },
  topBar: { width: '100%', maxWidth: '550px', display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' },
  langToggle: { padding: '10px 18px', backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  card: { backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '550px', backdropFilter: 'blur(10px)' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '24px', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }, 
  subtitle: { fontSize: '14px', color: '#64748b', fontWeight: '500' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#334155', marginLeft: '4px' },
  input: { padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc', fontWeight: '500' },
  phoneWrapper: { display: 'flex', gap: '0', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', backgroundColor: '#f8fafc' },
  countryDropdown: { padding: '12px', border: 'none', backgroundColor: '#f1f5f9', borderRight: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  phoneInput: { flex: 1, padding: '12px 16px', border: 'none', outline: 'none', fontSize: '14px', fontWeight: '500', backgroundColor: 'transparent' },
  button: { marginTop: '15px', padding: '14px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.4)', textTransform: 'uppercase' },
  alert: { padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', fontWeight: '600' }
};

export default LeadForm;