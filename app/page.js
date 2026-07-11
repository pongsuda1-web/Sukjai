"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, ShieldAlert, Lock, UserCog, EyeOff, Eye, Map, Users, Bell, BarChart3, FileKey, ShieldCheck, LogOut } from 'lucide-react';

const MapComponent = dynamic(() => import('../components/MapComponent'), { ssr: false });

// Mock Data
const INITIAL_PATIENTS = [
  { id: 1, hn: "HN-001", name: "นาย สมชาย รักดี", dx: "F20.0 Schizophrenia", risk: "red", smiV: "SMI-V 1", followup: "รายสัปดาห์", village: "หมู่ 3 ต.ตะเคียนเตี้ย", hospital: "รพช. บางละมุง", lat: 13.0185, lng: 100.9632, missedAppointments: 3, notes: "คนไข้อาศัยอยู่กับมารดาสูงอายุ มีพฤติกรรมก้าวร้าวเมื่อขาดยา" },
  { id: 2, hn: "HN-002", name: "นางสาว วิภา ใจงาม", dx: "F31.1 Bipolar Affective Disorder", risk: "yellow", smiV: "SMI-V 4", followup: "รายเดือน", village: "หมู่ 1 ต.ตะเคียนเตี้ย", hospital: "รพช. บางละมุง", lat: 13.0241, lng: 100.9514, missedAppointments: 0, notes: "สามารถเข้าสังคมและทำงานได้ปกติ มีญาติช่วยดูแลจัดการยา" },
  { id: 3, hn: "HN-003", name: "นาย เกรียงไกร มุ่งมั่น", dx: "F32.2 Major Depressive Disorder", risk: "green", smiV: "นัยยะซับซ้อน", followup: "ราย 3 เดือน", village: "หมู่ 4 ต.ตะเคียนเตี้ย", hospital: "รพช. ศรีราชา", lat: 13.0092, lng: 100.9745, missedAppointments: 1, notes: "" }
];

const CLINICS = [
  { name: "รพ.สต. ตะเคียนเตี้ย", lat: 13.0162, lng: 100.9610 },
  { name: "รพ.สต. บางละมุง", lat: 13.0385, lng: 100.9312 }
];

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const [privacyShieldActive, setPrivacyShieldActive] = useState(true);
  const [activeView, setActiveView] = useState('mapView');
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  
  if (!currentUser) return null;

  return (
    <div className="app-layout">
      {/* Header */}
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

      {/* Main Body */}
      <div className="app-body">
        {/* Sidebar */}
        <aside className="app-sidebar">
          <nav className="sidebar-nav">
            <ul>
              <li>
                <a href="#" className={`nav-item ${activeView === 'mapView' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('mapView'); }}>
                  <Map size={18}/> <span>แผนที่กำกับติดตาม</span>
                </a>
              </li>
              <li>
                <a href="#" className={`nav-item ${activeView === 'patientListView' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('patientListView'); }}>
                  <Users size={18}/> <span>ทะเบียนผู้ป่วย</span>
                </a>
              </li>
              <li>
                <a href="#" className="nav-item">
                  <Bell size={18}/> <span>รายการแจ้งเตือน</span>
                  <span className="badge-alert-count">0</span>
                </a>
              </li>
              <li><a href="#" className="nav-item"><BarChart3 size={18}/> <span>รายงานสถิติรวม</span></a></li>
              <li><a href="#" className="nav-item"><FileKey size={18}/> <span>ประวัติระบบ (Audit)</span></a></li>
              <li><a href="#" className="nav-item"><ShieldCheck size={18}/> <span>สิทธิ์คนไข้ & ตั้งค่า</span></a></li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="app-content">
          {/* Map View */}
          <section className="dashboard-view" style={{ display: activeView === 'mapView' ? 'block' : 'none', height: '100%' }}>
            <div className="view-header" style={{ marginBottom: '1rem' }}>
              <div className="view-title">
                <h2>แผนที่ติดตามผู้ป่วยและสถานพยาบาลใกล้เคียง</h2>
                <p>แสดงพิกัดที่ตั้งระดับหมู่บ้าน/ตำบล (เปิดใช้งาน Privacy Shield เพื่อเยื้องพิกัดคุ้มครองความปลอดภัย)</p>
              </div>
            </div>
            <div className="map-wrapper" style={{ height: 'calc(100% - 80px)', borderRadius: '8px', overflow: 'hidden' }}>
              <MapComponent patients={patients} clinics={CLINICS} privacyShieldActive={privacyShieldActive} />
            </div>
          </section>

          {/* Patient Registry View */}
          <section className="dashboard-view" style={{ display: activeView === 'patientListView' ? 'block' : 'none' }}>
            <div className="view-header">
              <div className="view-title">
                <h2>ทะเบียนคนไข้ในการกำกับติดตาม</h2>
                <p>รายชื่อผู้ป่วยในพื้นที่รับผิดชอบและข้อมูลการประสานติดตาม</p>
              </div>
            </div>
            
            <div className="table-container" style={{ marginTop: '1rem' }}>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.5)' }}>
                    <th>HN</th>
                    <th>ชื่อ - นามสกุล</th>
                    <th>การวินิจฉัย</th>
                    <th>โรงพยาบาล</th>
                    <th>หมู่บ้าน</th>
                    <th>SMI-V</th>
                    <th>ระดับติดตาม</th>
                    <th>ขาดนัด</th>
                    <th>NOTE</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td>{p.hn}</td>
                      <td>{privacyShieldActive ? p.name.substring(0, 3) + '*** ****' : p.name}</td>
                      <td>{p.dx}</td>
                      <td>{p.hospital}</td>
                      <td>{p.village}</td>
                      <td><span className="badge" style={{background: p.risk === 'red' ? '#ffebee' : '#e8f5e9', color: p.risk === 'red' ? '#c62828' : '#2e7d32'}}>{p.smiV}</span></td>
                      <td>{p.followup}</td>
                      <td>{p.missedAppointments}</td>
                      <td>{p.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
