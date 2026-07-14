"use client";
import { Map, Users, Bell, BarChart3, FileKey, ShieldCheck, UserCog, ClipboardList, Database } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ activeView, setActiveView }) {
  const { currentUser } = useAuth();
  
  const getRoleDesc = (role) => {
    switch(role) {
      case 'doctor': return 'เข้าถึงข้อมูลทางคลินิก (วินิจฉัย ICD-10) และประวัติการรักษาทั้งหมด แผนที่เป็นพิกัดหมู่บ้าน';
      case 'social_worker': return 'เข้าถึงข้อมูลทางสังคมสงเคราะห์เบื้องต้น และแผนที่การกำกับติดตาม';
      case 'jhw': return 'เห็นเฉพาะรายชื่อคนไข้ที่รับผิดชอบ ไม่เห็นข้อมูลวินิจฉัย ICD-10';
      case 'admin': return 'ผู้ดูแลระบบ';
      default: return '';
    }
  };

  return (
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
            <a href="#" className={`nav-item ${activeView === 'alertCenterView' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('alertCenterView'); }}>
              <Bell size={18}/> <span>รายการแจ้งเตือน</span>
              <span className="badge-alert-count">0</span>
            </a>
          </li>
          <li>
            <a href="#" className={`nav-item ${activeView === 'statsView' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('statsView'); }}>
              <BarChart3 size={18}/> <span>รายงานสถิติรวม</span>
            </a>
          </li>
          <li>
            <a href="#" className={`nav-item ${activeView === 'auditLogView' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('auditLogView'); }}>
              <FileKey size={18}/> <span>ประวัติระบบ (Audit)</span>
            </a>
          </li>
          <li>
            <a href="#" className={`nav-item ${activeView === 'userManagementView' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('userManagementView'); }}>
              <UserCog size={18}/> <span>จัดการผู้ใช้งาน</span>
            </a>
          </li>
          <li>
            <a href="#" className={`nav-item ${activeView === 'settingsView' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('settingsView'); }}>
              <ShieldCheck size={18}/> <span>สิทธิ์คนไข้ & ตั้งค่า</span>
            </a>
          </li>
          <li style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <a href="#" className={`nav-item ${activeView === 'surveyView' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('surveyView'); }} style={{ color: '#bae6fd' }}>
              <ClipboardList size={18}/> <span>ทำแบบประเมิน (วิจัย)</span>
            </a>
          </li>
          {currentUser?.role === 'admin' && (
            <li>
              <a href="#" className={`nav-item ${activeView === 'researchDataView' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('researchDataView'); }} style={{ color: '#fde047' }}>
                <Database size={18}/> <span>ข้อมูลงานวิจัย (Admin)</span>
              </a>
            </li>
          )}
        </ul>
      </nav>

      {/* Copyright Notice */}
      <div style={{ marginTop: 'auto', padding: '15px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        &copy; {new Date().getFullYear()} ระบบสานใจ (Sukjai).<br/>
        สงวนลิขสิทธิ์
      </div>
      
      {currentUser && (
        <div className="role-info-card" id="roleInfoCard">
          <h3 id="roleInfoTitle">{currentUser.role.toUpperCase()}</h3>
          <p id="roleInfoDesc">{getRoleDesc(currentUser.role)}</p>
        </div>
      )}

      <div className="session-timer-card">
        <div className="timer-details">
          <i data-lucide="clock"></i>
          <span>ตัดเซสชันอัตโนมัติใน:</span>
        </div>
        <div className="timer-countdown" id="sessionTimer">15:00</div>
      </div>
    </aside>
  );
}
