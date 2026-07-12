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
import SurveyView from '../components/views/SurveyView';
import ResearchDataView from '../components/views/ResearchDataView';
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
        medicationStatus: p.medication_status,
        last_visit_date: p.last_visit_date || new Date().toISOString().split('T')[0]
      })).map(p => {
        // Calculate next_visit_date
        const lastVisit = new Date(p.last_visit_date);
        let daysToAdd = 30; // default to monthly
        if (p.followup === 'รายสัปดาห์') daysToAdd = 7;
        else if (p.followup === 'รายเดือน') daysToAdd = 30;
        else if (p.followup === 'ราย 3 เดือน') daysToAdd = 90;
        else if (p.followup === 'ราย 6 เดือน') daysToAdd = 180;
        
        const nextVisit = new Date(lastVisit);
        nextVisit.setDate(nextVisit.getDate() + daysToAdd);
        return { ...p, next_visit_date: nextVisit.toISOString().split('T')[0] };
      });
      
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

  const handleImportPatients = async (importedData) => {
    try {
      const formattedData = importedData.map(row => {
        // Define known keys to filter out
        const knownKeys = [
          'HN', 'hn', 'ชื่อ-นามสกุล', 'name', 'การวินิจฉัย (ICD-10)', 'dx', 
          'โรงพยาบาล', 'hospital', 'หมู่บ้าน', 'village', 'ระดับความเสี่ยง', 
          'SMI-V', 'smi_v', 'ความถี่การติดตาม', 'followup_frequency', 
          'ขาดนัด (ครั้ง)', 'missed_appointments', 'หมายเหตุ', 'notes',
          'บ้านเลขที่', 'ตำบล', 'อำเภอ', 'จังหวัด', 'ละติจูด', 'ลองจิจูด', 'latitude', 'longitude'
        ];

        // Gather any extra columns into an array
        let extraNotes = [];
        Object.keys(row).forEach(key => {
          if (!knownKeys.includes(key) && row[key] !== undefined && row[key] !== null) {
            extraNotes.push(`${key}: ${row[key]}`);
          }
        });

        // Find hospital ID
        const clinicName = row['โรงพยาบาล'] || row['hospital'];
        const clinic = clinics.find(c => c.name === clinicName);
        
        let riskVal = 'green';
        const riskStr = (row['ระดับความเสี่ยง'] || '').toString();
        if (riskStr.includes('แดง') || riskStr === 'red') riskVal = 'red';
        else if (riskStr.includes('เหลือง') || riskStr === 'yellow') riskVal = 'yellow';

        const originalNotes = row['หมายเหตุ'] || row['notes'] || '';
        const finalNotes = [originalNotes, ...extraNotes].filter(Boolean).join(' | ');

        // Address Builder
        let fullVillage = row['หมู่บ้าน'] || row['village'] || '';
        const houseNo = row['บ้านเลขที่'];
        const subdistrict = row['ตำบล'];
        const district = row['อำเภอ'];
        const province = row['จังหวัด'];
        
        if (houseNo || subdistrict || district) {
          fullVillage = `${houseNo ? houseNo + ' ' : ''}${fullVillage ? 'ม.' + fullVillage + ' ' : ''}${subdistrict ? 'ต.' + subdistrict + ' ' : ''}${district ? 'อ.' + district + ' ' : ''}${province ? 'จ.' + province : ''}`.trim();
        }

        // Coordinates
        const lat = row['ละติจูด'] || row['latitude'];
        const lng = row['ลองจิจูด'] || row['longitude'];
        const finalLat = lat ? parseFloat(lat) : 18.7 + (Math.random() * 0.2);
        const finalLng = lng ? parseFloat(lng) : 100.7 + (Math.random() * 0.2);

        return {
          hn: row['HN'] || row['hn'] || `HN-${Math.floor(Math.random()*10000)}`,
          full_name: row['ชื่อ-นามสกุล'] || row['name'] || 'ไม่ระบุชื่อ',
          dx: row['การวินิจฉัย (ICD-10)'] || row['dx'] || '',
          hospital_id: clinic ? clinic.id : null,
          village: fullVillage,
          risk: riskVal,
          smi_v: row['SMI-V'] || row['smi_v'] || '',
          followup_frequency: row['ความถี่การติดตาม'] || row['followup_frequency'] || 'รายเดือน',
          missed_appointments: parseInt(row['ขาดนัด (ครั้ง)'] || row['missed_appointments'] || 0),
          notes: finalNotes,
          medication_status: true,
          latitude: finalLat,
          longitude: finalLng
        };
      });

      const { error } = await supabase
        .from('patients')
        .insert(formattedData);

      if (error) throw error;
      alert(`นำเข้าข้อมูลผู้ป่วยสำเร็จ ${formattedData.length} รายการ!`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการนำเข้าข้อมูล: ' + err.message);
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

  const handleSaveSurvey = async (surveyData) => {
    try {
      const { error } = await supabase
        .from('research_surveys')
        .insert([surveyData]);
        
      if (error) throw error;
      console.log('Survey saved successfully');
    } catch (err) {
      console.error('Failed to save survey:', err);
      alert('เกิดข้อผิดพลาดในการส่งแบบประเมิน โปรดลองอีกครั้ง');
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
                onImportPatients={handleImportPatients}
                privacyShieldActive={privacyShieldActive}
                currentUser={currentUser}
                isActive={activeView === 'patientListView'} 
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
              <SurveyView 
                isActive={activeView === 'surveyView'}
                onSubmitSurvey={handleSaveSurvey}
              />
              <ResearchDataView
                isActive={activeView === 'researchDataView'}
                currentUser={currentUser}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
