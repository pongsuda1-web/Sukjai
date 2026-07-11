"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MapView from '../components/views/MapView';
import PatientListView from '../components/views/PatientListView';
import AlertCenterView from '../components/views/AlertCenterView';
import StatsView from '../components/views/StatsView';
import AuditLogView from '../components/views/AuditLogView';
import SettingsView from '../components/views/SettingsView';
import { createClient } from '../utils/supabase/client';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [privacyShieldActive, setPrivacyShieldActive] = useState(true);
  const [activeView, setActiveView] = useState('mapView');
  
  const [patients, setPatients] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch clinics
      const { data: clinicsData, error: clinicsError } = await supabase
        .from('clinics')
        .select('*');
      
      if (clinicsError) throw clinicsError;
      setClinics(clinicsData || []);

      // Fetch patients
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select(`*, clinics(name)`);
        
      if (patientsError) throw patientsError;
      
      // Map database schema to UI format
      const formattedPatients = (patientsData || []).map(p => ({
        id: p.id,
        hn: p.hn,
        name: p.full_name,
        dx: p.dx,
        risk: p.risk,
        smiV: p.smi_v,
        followup: p.followup_frequency,
        village: p.village,
        hospital: p.clinics?.name || '-',
        lat: p.latitude,
        lng: p.longitude,
        missedAppointments: p.missed_appointments,
        notes: p.notes
      }));
      
      setPatients(formattedPatients);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const seedMockData = async () => {
    try {
      const { data: cData, error: cError } = await supabase
        .from('clinics')
        .insert([
          { name: "รพ.สต. ตะเคียนเตี้ย", latitude: 13.0162, longitude: 100.9610 },
          { name: "รพ.สต. บางละมุง", latitude: 13.0385, longitude: 100.9312 }
        ])
        .select();

      if (cError) throw cError;

      if (cData && cData.length > 0) {
        const { error: pError } = await supabase
          .from('patients')
          .insert([
            { hn: "HN-001", full_name: "นาย สมชาย รักดี", dx: "F20.0 Schizophrenia", risk: "red", smi_v: "SMI-V 1", followup_frequency: "รายสัปดาห์", village: "หมู่ 3 ต.ตะเคียนเตี้ย", hospital_id: cData[0].id, latitude: 13.0185, longitude: 100.9632, missed_appointments: 3, notes: "คนไข้อาศัยอยู่กับมารดาสูงอายุ มีพฤติกรรมก้าวร้าวเมื่อขาดยา" },
            { hn: "HN-002", full_name: "นางสาว วิภา ใจงาม", dx: "F31.1 Bipolar Affective Disorder", risk: "yellow", smi_v: "SMI-V 4", followup_frequency: "รายเดือน", village: "หมู่ 1 ต.ตะเคียนเตี้ย", hospital_id: cData[1].id, latitude: 13.0241, longitude: 100.9514, missed_appointments: 0, notes: "สามารถเข้าสังคมและทำงานได้ปกติ มีญาติช่วยดูแลจัดการยา" },
            { hn: "HN-003", full_name: "นาย เกรียงไกร มุ่งมั่น", dx: "F32.2 Major Depressive Disorder", risk: "green", smi_v: "นัยยะซับซ้อน", followup_frequency: "ราย 3 เดือน", village: "หมู่ 4 ต.ตะเคียนเตี้ย", hospital_id: null, latitude: 13.0092, longitude: 100.9745, missed_appointments: 1, notes: "" }
          ]);
        if (pError) throw pError;
      }
      alert('สร้างข้อมูลทดสอบสำเร็จ!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการสร้างข้อมูล');
    }
  };

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
          {patients.length === 0 && !loading && (
            <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>ยังไม่มีข้อมูลคนไข้ในระบบฐานข้อมูล Supabase ของคุณเลยครับ!</span>
              <button onClick={seedMockData} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>สร้างข้อมูลทดสอบ (Seed Data)</button>
            </div>
          )}

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>กำลังโหลดข้อมูลจากฐานข้อมูล...</div>
          ) : (
            <>
              <MapView 
                isActive={activeView === 'mapView'}
                patients={patients}
                clinics={clinics}
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
