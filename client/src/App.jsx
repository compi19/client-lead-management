import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Component Imports
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard'; 
import Login from './pages/Login';
import LeadTable from './components/LeadTable';
import LeadForm from './components/LeadForm';
import Settings from "./pages/Settings";

function App() {
  const [auth] = useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role')
  });

  const isAuthenticated = !!auth.token;

  return (
    <Router>
      <Routes>
        {/* 1. Login Route */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} 
        />

        {/* 2. Authenticated Routes wrapped in Layout */}
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  {/* Dashboard (Home) */}
                  <Route path="/" element={<AdminDashboard />} />

                  {/* Customer Registration Page (Leads) */}
                  <Route 
                    path="/leads" 
                    element={
                      <div className="p-8 flex justify-center items-start animate-in fade-in duration-500">
                        <div className="w-full max-w-xl">
                           <LeadForm />
                        </div>
                      </div>
                    } 
                  />
                  
                  {/* Admin Management Page */}
                  <Route 
                    path="/admin" 
                    element={
                      <div className="p-8 space-y-6 animate-in fade-in duration-500">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl">👤</div>
                          <div>
                            <h1 className="text-2xl font-black text-slate-800 italic">Admin Page</h1>
                            <p className="text-slate-500 text-sm font-medium">Detailed list of registered customers</p>
                          </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                          <LeadTable />
                        </div>
                      </div>
                    } 
                  />

                  {/* Settings Page */}
                  <Route path="/settings" element={<Settings />} />
                  
                  {/* Catch-all: Redirect to Home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;