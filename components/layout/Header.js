"use client";
import { BrainCircuit, ShieldAlert, Lock, UserCog, EyeOff, Eye, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ privacyShieldActive, setPrivacyShieldActive }) {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon"><BrainCircuit /></div>
        <div className="brand-text">
          <h1>MindMap</h1>
          <span>ระบบติดตามและแผนที่คนไข้จิตเวชชุมชน</span>
        </div>
      </div>

      <div className="header-greeting" id="userGreeting" style={{ color: '#fff', fontWeight: 500, marginLeft: '1rem' }}>
        สวัสดีคุณ {currentUser.name}
      </div>

      <div className="security-badge-container">
        <span className="security-badge confidential"><ShieldAlert size={14} /> CONFIDENTIAL - PDPA COMPLIANT</span>
        <span className="security-badge encryption"><Lock size={14} /> AES-256 ENCRYPTED</span>
      </div>

      <div className="header-controls">
        <div className="role-selector-wrapper" style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#fff'}}>
          <UserCog size={16}/> สิทธิ์: <strong>{currentUser.role.toUpperCase()}</strong>
        </div>
        
        <button 
          className="btn-secondary" 
          onClick={logout}
          style={{ marginRight: '10px', padding: '0.4rem 0.8rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <LogOut size={16} /> Logout
        </button>
        
        <div className="privacy-shield-container">
          <button 
            className={`btn-privacy-shield ${privacyShieldActive ? 'active' : ''}`}
            onClick={() => setPrivacyShieldActive(!privacyShieldActive)}
          >
            {privacyShieldActive ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>Privacy Shield: {privacyShieldActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
