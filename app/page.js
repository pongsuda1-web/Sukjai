"use client";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MapView from '../components/views/MapView';
import PatientListView from '../components/views/PatientListView';
import AlertCenterView from '../components/views/AlertCenterView';
import StatsView from '../components/views/StatsView';
import AuditLogView from '../components/views/AuditLogView';
import SettingsView from '../components/views/SettingsView';

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
  const { currentUser } = useAuth();
  const [privacyShieldActive, setPrivacyShieldActive] = useState(true);
  const [activeView, setActiveView] = useState('mapView');
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  
  if (!currentUser) return null;

  return (
    <div className="app-layout">
      <Header 
        privacyShieldActive={privacyShieldActive} 
        setPrivacyShieldActive={setPrivacyShieldActive} 
      />

      <div className="app-body">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        <main className="app-content">
          <MapView 
            isActive={activeView === 'mapView'}
            patients={patients}
            clinics={CLINICS}
            privacyShieldActive={privacyShieldActive}
          />
          <PatientListView 
            isActive={activeView === 'patientListView'}
            patients={patients}
            privacyShieldActive={privacyShieldActive}
          />
          <AlertCenterView isActive={activeView === 'alertCenterView'} />
          <StatsView isActive={activeView === 'statsView'} />
          <AuditLogView isActive={activeView === 'auditLogView'} />
          <SettingsView 
            isActive={activeView === 'settingsView'} 
            privacyShieldActive={privacyShieldActive}
            setPrivacyShieldActive={setPrivacyShieldActive}
          />
        </main>
      </div>
    </div>
  );
}
