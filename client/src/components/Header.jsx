import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Languages } from 'lucide-react';

const translations = {
  am: {
    dashboard: "ዳሽቦርድ",
    leads: "ደንበኞች",
    admin: "አስተዳዳሪ",
    logout: "ውጣ",
    toggle: "English"
  },
  en: {
    dashboard: "Dashboard",
    leads: "Leads",
    admin: "Admin",
    logout: "Logout",
    toggle: "አማርኛ"
  }
};

const Header = () => {
  // Set default language to English
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  const toggleLanguage = () => setLang(prev => (prev === 'am' ? 'en' : 'am'));

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <h2 style={styles.logoText}>LeadManager <span style={{ color: '#00d1b2' }}>Pro</span></h2>
      </div>
      
      <nav style={styles.nav}>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/" style={styles.link}>{t.dashboard}</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/leads" style={styles.link}>{t.leads}</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/admin" style={styles.link}>{t.admin}</Link>
          </li>
        </ul>
      </nav>

      <div style={styles.userSection}>
        <button onClick={toggleLanguage} style={styles.langBtn}>
          <Languages size={14} /> {t.toggle}
        </button>
        <button style={styles.logoutBtn}>{t.logout}</button>
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 5%',
    backgroundColor: '#2c3e50',
    color: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  logo: {
    cursor: 'pointer'
  },
  logoText: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '800'
  },
  nav: {
    flex: 1,
    marginLeft: '50px'
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  navItem: {
    marginRight: '20px'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    transition: '0.3s'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  langBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#00d1b2',
    border: '1px solid #00d1b2',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '13px'
  }
};

export default Header;