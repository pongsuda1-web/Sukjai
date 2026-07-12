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
import UserManagementView from '../components/views/UserManagementView';
import { createClient } from '../utils/supabase/client';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [privacyShieldActive, setPrivacyShieldActive] = useState(true);
  const [activeView, setActiveView] = useState('statsView');
  
  const [patients, setPatients] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [users, setUsers] = useState([]);
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
      
      const formattedClinics = (clinicsData || []).map(c => ({
        ...c,
        lat: c.latitude,
        lng: c.longitude
      }));
      setClinics(formattedClinics);

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
        notes: p.notes,
        medicationStatus: p.medication_status
      }));
      
      setPatients(formattedPatients);

      // Fetch users (profiles)
      const { data: usersData, error: usersErr } = await supabase
        .from('profiles')
        .select('*');
      
      if (!usersErr) {
        setUsers(usersData || []);
      }
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
            { hn: "HN-001", full_name: "นาย สมชาย รักดี", dx: "F20.0 Schizophrenia", risk: "red", smi_v: "SMI-V 1", followup_frequency: "รายสัปดาห์", village: "หมู่ 3 ต.ตะเคียนเตี้ย", hospital_id: cData[0].id, latitude: 13.0185, longitude: 100.9632, missed_appointments: 3, notes: "คนไข้อาศัยอยู่กับมารดาสูงอายุ มีพฤติกรรมก้าวร้าวเมื่อขาดยา", medication_status: false },
            { hn: "HN-002", full_name: "นางสาว วิภา ใจงาม", dx: "F31.1 Bipolar Affective Disorder", risk: "yellow", smi_v: "SMI-V 4", followup_frequency: "รายเดือน", village: "หมู่ 1 ต.ตะเคียนเตี้ย", hospital_id: cData[1].id, latitude: 13.0241, longitude: 100.9514, missed_appointments: 0, notes: "สามารถเข้าสังคมและทำงานได้ปกติ มีญาติช่วยดูแลจัดการยา", medication_status: true },
            { hn: "HN-003", full_name: "นาย เกรียงไกร มุ่งมั่น", dx: "F32.2 Major Depressive Disorder", risk: "green", smi_v: "นัยยะซับซ้อน", followup_frequency: "ราย 3 เดือน", village: "หมู่ 4 ต.ตะเคียนเตี้ย", hospital_id: null, latitude: 13.0092, longitude: 100.9745, missed_appointments: 1, notes: "", medication_status: true }
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

  const handleAddPatient = async (patientData) => {
    try {
      const { error, data } = await supabase
        .from('patients')
        .insert([patientData])
        .select();

      if (error) throw error;
      
      // Line Notify logic
      if (patientData.risk === 'red' || patientData.missed_appointments > 0) {
        const clinic = clinics.find(c => c.id === patientData.hospital_id);
        if (clinic && clinic.line_token) {
          const riskStr = patientData.risk === 'red' ? '🔴 เฝ้าระวังสูง (แดง)' : 'เฝ้าระวัง (ขาดนัด)';
          const message = `\n🚨 แจ้งเตือนเคสใหม่ (${clinic.name})\nระดับความเสี่ยง: ${riskStr}\nพิกัด: ${patientData.village}\n*กรุณาล็อกอินเข้าสู่ระบบ Sukjai เพื่อดูชื่อและรายละเอียด*`;
          
          await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: clinic.line_token, message })
          }).catch(console.error); // Do not block if notify fails
        }
      }

      alert('บันทึกข้อมูลผู้ป่วยสำเร็จ!');
      fetchData(); // refresh data
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + err.message);
    }
  };

  const handleEditPatient = async (id, patientData) => {
    try {
      // Map back to schema if needed, but form should already submit schema keys if mapped correctly,
      // wait, PatientForm returns formData directly. We should map medicationStatus to medication_status.
      if (patientData.medicationStatus !== undefined) {
        patientData.medication_status = patientData.medicationStatus;
        delete patientData.medicationStatus;
      }

      const { error } = await supabase
        .from('patients')
        .update(patientData)
        .eq('id', id);

      if (error) throw error;
      alert('อัปเดตข้อมูลผู้ป่วยสำเร็จ!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล: ' + err.message);
    }
  };

  const handleDeletePatient = async (id) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('ลบข้อมูลผู้ป่วยสำเร็จ!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล: ' + err.message);
    }
  };

  const handleUpdateUser = async (id, updateData) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      alert('อัปเดตข้อมูลบัญชีผู้ใช้สำเร็จ!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการอัปเดตสิทธิ์: ' + err.message);
    }
  };

  const handleUpdateClinicLineToken = async (clinicId, token) => {
    try {
      const { error } = await supabase
        .from('clinics')
        .update({ line_token: token })
        .eq('id', clinicId);

      if (error) throw error;
      alert('อัปเดต Line Token สำเร็จ!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการอัปเดต Token: ' + err.message);
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
                clinics={clinics}
                onAddPatient={handleAddPatient}
                onEditPatient={handleEditPatient}
                onDeletePatient={handleDeletePatient}
                privacyShieldActive={privacyShieldActive}
                currentUser={currentUser}
              />
              <AlertCenterView isActive={activeView === 'alertCenterView'} patients={patients} />
              <StatsView 
                isActive={activeView === 'statsView'} 
                patients={patients} 
                clinics={clinics}
                currentUser={currentUser}
              />
              <AuditLogView isActive={activeView === 'auditLogView'} />
              <UserManagementView 
                isActive={activeView === 'userManagementView'}
                users={users}
                currentUser={currentUser}
                onUpdateUser={handleUpdateUser}
              />
              <SettingsView 
                isActive={activeView === 'settingsView'} 
                privacyShieldActive={privacyShieldActive}
                setPrivacyShieldActive={setPrivacyShieldActive}
                clinics={clinics}
                currentUser={currentUser}
                onUpdateClinic={handleUpdateClinicLineToken}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
