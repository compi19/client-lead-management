import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, X, Languages } from 'lucide-react';

const translations = {
  am: {
    searchPlaceholder: "በስም፣ ስልክ ወይም ኢሜይል ይፈልጉ...",
    allStatus: "ሁሉም ደረጃዎች",
    fullName: "ሙሉ ስም",
    phone: "ስልክ",
    source: "ምንጭ",
    status: "ደረጃ",
    actions: "ድርጊቶች",
    edit: "አስተካክል",
    delete: "ሰርዝ",
    loading: "መረጃ በመጫን ላይ ነው...",
    editTitle: "መረጃ ማስተካከያ",
    email: "ኢሜይል",
    save: "አስቀምጥ",
    cancel: "ተው",
    confirmDelete: "ይህንን ሊድ ለመሰረዝ እርግጠኛ ነዎት?",
    errorUpdate: "ማስተካከል አልተቻለም! ❌",
    errorDelete: "መሰረዝ አልተቻለም!",
    toggle: "English", // Button shows English when UI is Amharic
    statuses: { New: "አዲስ", Contacted: "ተደውሏል", Qualified: "ብቁ", Won: "የተሳካ" }
  },
  en: {
    searchPlaceholder: "Search by name, phone or email...",
    allStatus: "All Statuses",
    fullName: "Full Name",
    phone: "Phone",
    source: "Source",
    status: "Status",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    loading: "Loading data...",
    editTitle: "Update Information",
    email: "Email",
    save: "Save",
    cancel: "Cancel",
    confirmDelete: "Are you sure you want to delete this lead?",
    errorUpdate: "Update failed! ❌",
    errorDelete: "Delete failed!",
    toggle: "አማርኛ", // Button shows Amharic when UI is English
    statuses: { New: "New", Contacted: "Contacted", Qualified: "Qualified", Won: "Won" }
  }
};

const LeadTable = () => {
  // CHANGE: Changed default state to 'en'
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [currentLead, setCurrentLead] = useState({ 
    fullName: '', phone: '', email: '', source: '', status: '', _id: '' 
  });

  const fetchLeads = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leads');
      setLeads(response.data);
      setFilteredLeads(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const toggleLanguage = () => setLang(prev => (prev === 'am' ? 'en' : 'am'));

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/leads/${id}`, { status: newStatus });
      fetchLeads();
    } catch (error) {
      alert(t.errorUpdate);
    }
  };

  const openEditModal = (lead) => {
    setCurrentLead({
      fullName: lead.fullName || '',
      phone: lead.phone || lead.phoneNumber || '',
      email: lead.email || '',
      source: lead.source || 'Facebook',
      status: lead.status || 'New',
      _id: lead._id
    });
    setIsEditing(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/leads/${currentLead._id}`, currentLead);
      setIsEditing(false);
      fetchLeads();
    } catch (error) {
      alert(t.errorUpdate);
    }
  };

  useEffect(() => {
    let result = leads;
    if (searchTerm) {
      result = result.filter(lead => 
        (lead.fullName && lead.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.phone && lead.phone.includes(searchTerm)) ||
        (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (statusFilter !== 'All') {
      result = result.filter(lead => lead.status === statusFilter);
    }
    setFilteredLeads(result);
  }, [searchTerm, statusFilter, leads]);

  const handleDelete = async (id) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await axios.delete(`http://localhost:5000/api/leads/${id}`);
        fetchLeads();
      } catch (error) {
        alert(t.errorDelete);
      }
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '20px', color: 'white' }}>{t.loading}</p>;

  return (
    <div style={styles.pageContainer}>
      <button onClick={toggleLanguage} style={styles.langToggle}>
        <Languages size={16} /> {t.toggle}
      </button>

      <div style={styles.card}>
        <div style={styles.controls}>
          <div style={styles.searchBox}>
            <Search size={18} color="#64748b" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={styles.filterBox}>
            <Filter size={18} color="#64748b" />
            <select style={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">{t.allStatus}</option>
              <option value="New">{t.statuses.New}</option>
              <option value="Contacted">{t.statuses.Contacted}</option>
              <option value="Qualified">{t.statuses.Qualified}</option>
              <option value="Won">{t.statuses.Won}</option>
            </select>
          </div>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>{t.fullName}</th>
                <th style={styles.th}>{t.phone}</th>
                <th style={styles.th}>{t.source}</th>
                <th style={styles.th}>{t.status}</th>
                <th style={styles.th}>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead._id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={{fontWeight: '700', color: '#1e293b'}}>{lead.fullName}</div>
                    <div style={{fontSize: '11px', color: '#64748b'}}>{lead.email || '-'}</div>
                  </td>
                  <td style={styles.td}>{lead.phone || lead.phoneNumber}</td>
                  <td style={styles.td}>
                    <span style={styles.sourceBadge}>{lead.source || 'Facebook'}</span>
                  </td>
                  <td style={styles.td}>
                    <select 
                      value={lead.status} 
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      style={{...styles.statusBadge, 
                        backgroundColor: lead.status === 'Won' ? '#dcfce7' : lead.status === 'New' ? '#e0f2fe' : '#fef3c7',
                        color: lead.status === 'Won' ? '#166534' : lead.status === 'New' ? '#0369a1' : '#92400e'}}
                    >
                      <option value="New">{t.statuses.New}</option>
                      <option value="Contacted">{t.statuses.Contacted}</option>
                      <option value="Qualified">{t.statuses.Qualified}</option>
                      <option value="Won">{t.statuses.Won}</option>
                    </select>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionContainer}>
                      <button onClick={() => openEditModal(lead)} style={styles.editBtn}>{t.edit}</button>
                      <button onClick={() => handleDelete(lead._id)} style={styles.deleteBtn}>{t.delete}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditing && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{fontWeight: '900', textTransform: 'uppercase'}}>{t.editTitle}</h3>
              <X size={20} style={{cursor: 'pointer'}} onClick={() => setIsEditing(false)} />
            </div>
            <form onSubmit={handleUpdateSubmit} style={styles.modalForm}>
              <label style={styles.label}>{t.fullName}</label>
              <input style={styles.modalInput} value={currentLead.fullName} onChange={(e) => setCurrentLead({...currentLead, fullName: e.target.value})} />
              
              <label style={styles.label}>{t.phone}</label>
              <input style={styles.modalInput} value={currentLead.phone} onChange={(e) => setCurrentLead({...currentLead, phone: e.target.value})} />
              
              <label style={styles.label}>{t.email}</label>
              <input style={styles.modalInput} type="email" value={currentLead.email} onChange={(e) => setCurrentLead({...currentLead, email: e.target.value})} />
              
              <label style={styles.label}>{t.source}</label>
              <select 
                style={styles.modalInput} 
                value={currentLead.source} 
                onChange={(e) => setCurrentLead({...currentLead, source: e.target.value})}
              >
                <option value="Facebook">Facebook</option>
                <option value="Telegram">Telegram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Website">Website</option>
                <option value="TikTok">TikTok</option>
                <option value="Other">Other</option>
              </select>

              <div style={styles.modalActions}>
                <button type="submit" style={styles.saveBtn}>{t.save}</button>
                <button type="button" onClick={() => setIsEditing(false)} style={styles.cancelBtn}>{t.cancel}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: { backgroundColor: '#38bdf8', padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' },
  langToggle: { position: 'absolute', top: '20px', right: '20px', padding: '10px 18px', backgroundColor: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 50 },
  card: { backgroundColor: '#ffffff', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '1000px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', marginTop: '60px' },
  controls: { display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' },
  searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '14px', flex: '2', border: '1px solid #e2e8f0' },
  filterBox: { display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '14px', flex: '1', border: '1px solid #e2e8f0' },
  searchInput: { border: 'none', background: 'transparent', outline: 'none', marginLeft: '10px', width: '100%', fontWeight: '500' },
  select: { border: 'none', background: 'transparent', outline: 'none', width: '100%', fontWeight: '600', color: '#475569' },
  tableContainer: { overflowX: 'auto', borderRadius: '16px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f1f5f9' },
  th: { textAlign: 'left', padding: '16px', fontSize: '13px', fontWeight: '800', color: '#475569', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' },
  td: { padding: '16px', fontSize: '14px', color: '#334155' },
  statusBadge: { padding: '6px 12px', borderRadius: '10px', fontSize: '12px', border: 'none', cursor: 'pointer', fontWeight: '700' },
  sourceBadge: { padding: '4px 10px', backgroundColor: '#f1f5f9', borderRadius: '8px', fontSize: '11px', fontWeight: '600', color: '#64748b' },
  actionContainer: { display: 'flex', gap: '12px' },
  editBtn: { backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' },
  deleteBtn: { backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', padding: '35px', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  modalForm: { display: 'flex', flexDirection: 'column', gap: '12px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#475569' },
  modalInput: { padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' },
  modalActions: { display: 'flex', gap: '12px', marginTop: '20px' },
  saveBtn: { flex: 1, padding: '12px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' },
  cancelBtn: { flex: 1, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }
};

export default LeadTable;