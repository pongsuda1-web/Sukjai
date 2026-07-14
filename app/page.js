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
      const { data, error } = await supabase
        .from('patients')
        .select(`*, hospital:hospital_id(name), pcu:pcu_id(name)`)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Map database schema to UI format
      let formattedPatients = (data || []).map(p => ({
        id: p.id,
        hn: p.hn,
        name: p.full_name,
        dx: p.dx,
        risk: p.risk,
        smiV: p.smi_v,
        followup: p.followup_frequency,
        village: p.village,
        hospital: p.hospital?.name || '-',
        pcu: p.pcu?.name || '-',
        lat: p.latitude,
        lng: p.longitude,
        missedAppointments: p.missed_appointments,
        notes: p.notes,
        medicationStatus: p.medication_status,
        last_visit_date: p.last_visit_date || new Date().toISOString().split('T')[0],
        hospital_id: p.hospital_id,
        pcu_id: p.pcu_id
      }));

      // Role and Affiliation-based visibility logic
      if (currentUser?.role === 'jhw') {
        formattedPatients = formattedPatients.filter(p => p.risk !== 'green');
      }

      // If user has a hospital_id and is not admin/manager, restrict to their hospital/PCU only
      if (currentUser?.hospital_id && currentUser?.role !== 'admin' && currentUser?.role !== 'manager') {
        formattedPatients = formattedPatients.filter(p => 
          p.hospital_id === currentUser.hospital_id || p.pcu_id === currentUser.hospital_id
        );
      }
      
      const finalPatients = formattedPatients.map(p => {
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
      
      setPatients(finalPatients);

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
            { hn: "HN-001", full_name: "นาย สมชาย รักดี", dx: "F20.0 Schizophrenia", risk: "red", smi_v: "SMI-V 1", followup_frequency: "รายสัปดาห์", village: "หมู่ 3 ต.ตะเคียนเตี้ย อ.บางละมุง จ.ชลบุรี", house_no: "12/3", moo: "3", tambon: "ตะเคียนเตี้ย", amphoe: "บางละมุง", province: "ชลบุรี", hospital_id: cData[0].id, latitude: 13.0185, longitude: 100.9632, missed_appointments: 3, notes: "คนไข้อาศัยอยู่กับมารดาสูงอายุ มีพฤติกรรมก้าวร้าวเมื่อขาดยา", medication_status: false },
            { hn: "HN-002", full_name: "นางสาว วิภา ใจงาม", dx: "F31.1 Bipolar Affective Disorder", risk: "yellow", smi_v: "SMI-V 4", followup_frequency: "รายเดือน", village: "หมู่ 1 ต.ตะเคียนเตี้ย อ.บางละมุง จ.ชลบุรี", house_no: "45", moo: "1", tambon: "ตะเคียนเตี้ย", amphoe: "บางละมุง", province: "ชลบุรี", hospital_id: cData[1].id, latitude: 13.0241, longitude: 100.9514, missed_appointments: 0, notes: "สามารถเข้าสังคมและทำงานได้ปกติ มีญาติช่วยดูแลจัดการยา", medication_status: true },
            { hn: "HN-003", full_name: "นาย เกรียงไกร มุ่งมั่น", dx: "F32.2 Major Depressive Disorder", risk: "green", smi_v: "นัยยะซับซ้อน", followup_frequency: "ราย 3 เดือน", village: "หมู่ 4 ต.ตะเคียนเตี้ย อ.บางละมุง จ.ชลบุรี", house_no: "89/1", moo: "4", tambon: "ตะเคียนเตี้ย", amphoe: "บางละมุง", province: "ชลบุรี", hospital_id: null, latitude: 13.0092, longitude: 100.9745, missed_appointments: 1, notes: "", medication_status: true }
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
          'โรงพยาบาล', 'hospital', 'รพ.สต.', 'pcu', 'หมู่บ้าน', 'village', 'ระดับความเสี่ยง', 
          'SMI-V', 'smi_v', 'ความถี่การติดตาม', 'followup_frequency', 
          'ขาดนัด (ครั้ง)', 'missed_appointments', 'หมายเหตุ', 'notes',
          'บ้านเลขที่', 'ตำบล', 'อำเภอ', 'จังหวัด', 'ละติจูด', 'ลองจิจูด', 'latitude', 'longitude',
          'ลำดับ', 'สถานบริการที่', 'ชื่อสถานบริการที่บันทึก', 'เขตสุขภาพ', 'บัตรประชาชน', 'ชื่อ - นามสกุล',
          'หมู่ที่', 'รหัส รพ.สต.', 'ชื่อ รพ.สต.', 'รหัส รพ.พี่เลี้ยง', 'ชื่อรพ.พี่เลี้ยง', 'ชื่อ รพ.พี่เลี้ยง',
          'รหัส รพช./CUP', 'ชื่อ รพช./CUP', 'การวินิจฉัย', 'SMI-V 1', 'SMI-V 2', 'SMI-V 3', 'SMI-V 4',
          'pname', 'ชื่อ', 'นามสกุล', 'age', 'visit date', 'doctor', 'หมู่', 'mobile_pho', 'icd10'
        ];

        // Gather any extra columns into an array
        let extraNotes = [];
        Object.keys(row).forEach(key => {
          if (!knownKeys.includes(key) && row[key] !== undefined && row[key] !== null && row[key] !== '') {
            extraNotes.push(`${key}: ${row[key]}`);
          }
        });

        // Name Builder
        let title = row['pname'] || '';
        let firstName = row['ชื่อ'] || '';
        let lastName = row['นามสกุล'] || '';
        let combinedName = `${title}${firstName} ${lastName}`.trim();
        if (combinedName === '') combinedName = null;

        let clinicName = (row['ชื่อ รพช./CUP'] || row['ชื่อ รพ.พี่เลี้ยง'] || row['ชื่อรพ.พี่เลี้ยง'] || row['โรงพยาบาล'] || row['hospital'] || '').trim();
        if (clinicName === 'รพ.น่าน') clinicName = 'โรงพยาบาลน่าน';
        
        const clinic = clinics.find(c => 
          (c.name === clinicName || c.name.replace('โรงพยาบาล', 'รพ.') === clinicName || c.name.replace('รพ.', 'โรงพยาบาล') === clinicName) 
          && (!c.type || c.type === 'hospital')
        );
        
        let pcuName = (row['ชื่อ รพ.สต.'] || row['รพ.สต.'] || row['pcu'] || '').trim();
        const pcu = clinics.find(c => c.name === pcuName && c.type === 'pcu');
        
        let riskVal = 'green';
        const riskStr = (row['ระดับความเสี่ยง'] || '').toString();
        if (riskStr.includes('แดง') || riskStr === 'red') riskVal = 'red';
        else if (riskStr.includes('เหลือง') || riskStr === 'yellow') riskVal = 'yellow';

        // Check SMI-V from multiple columns
        let smiVArr = [];
        if (row['SMI-V 1']) smiVArr.push('SMI-V 1');
        if (row['SMI-V 2']) smiVArr.push('SMI-V 2');
        if (row['SMI-V 3']) smiVArr.push('SMI-V 3');
        if (row['SMI-V 4']) smiVArr.push('SMI-V 4');
        const smiVFinal = row['SMI-V'] || row['smi_v'] || smiVArr.join(', ');

        const originalNotes = row['หมายเหตุ'] || row['notes'] || '';
        const finalNotes = [originalNotes, ...extraNotes].filter(Boolean).join(' | ');

        // Address Builder
        let fullVillage = row['หมู่บ้าน'] || row['village'] || '';
        const houseNo = row['บ้านเลขที่'];
        const moo = row['หมู่ที่'] || row['หมู่'];
        const subdistrict = row['ตำบล'];
        const district = row['อำเภอ'];
        const province = row['จังหวัด'];
        
        if (houseNo || subdistrict || district || moo) {
          fullVillage = `${houseNo ? houseNo + ' ' : ''}${moo ? 'ม.' + moo + ' ' : ''}${fullVillage ? fullVillage + ' ' : ''}${subdistrict ? 'ต.' + subdistrict + ' ' : ''}${district ? 'อ.' + district + ' ' : ''}${province ? 'จ.' + province : ''}`.trim();
        }

        // Coordinates
        const lat = row['ละติจูด'] || row['latitude'];
        const lng = row['ลองจิจูด'] || row['longitude'];
        const finalLat = lat ? parseFloat(lat) : 18.7 + (Math.random() * 0.2);
        const finalLng = lng ? parseFloat(lng) : 100.7 + (Math.random() * 0.2);

        return {
          hn: row['HN'] || row['hn'] || row['บัตรประชาชน'] || `HN-${Math.floor(Math.random()*10000)}`,
          full_name: combinedName || row['ชื่อ - นามสกุล'] || row['ชื่อ-นามสกุล'] || row['name'] || 'ไม่ระบุชื่อ',
          dx: row['icd10'] || row['การวินิจฉัย'] || row['การวินิจฉัย (ICD-10)'] || row['dx'] || '',
          hospital_id: clinic ? clinic.id : null,
          pcu_id: pcu ? pcu.id : null,
          village: fullVillage,
          house_no: houseNo || '',
          moo: moo || '',
          tambon: subdistrict || '',
          amphoe: district || '',
          province: province || '',
          risk: riskVal,
          smi_v: smiVFinal,
          followup_frequency: row['ความถี่การติดตาม'] || row['followup_frequency'] || 'รายเดือน',
          missed_appointments: parseInt(row['ขาดนัด (ครั้ง)'] || row['missed_appointments'] || 0),
          notes: finalNotes,
          latitude: finalLat,
          longitude: finalLng
        };
      });

      const { error } = await supabase
        .from('patients')
        .upsert(formattedData, { onConflict: 'hn' });

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

  const highRiskCount = patients.filter(p => p.risk === 'red').length;
  const missedCount = patients.filter(p => p.missedAppointments > 0).length;

  return (
    <div className="app-layout">
      <Header 
        privacyShieldActive={privacyShieldActive} 
        setPrivacyShieldActive={setPrivacyShieldActive} 
      />

      <div className="app-body">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        <main className="app-content">
          {(highRiskCount > 0 || missedCount > 0) && (
            <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', padding: '15px', borderRadius: '8px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: '#c62828' }}>
              <div style={{ fontSize: '1.2rem' }}>🚨</div>
              <div>
                <strong>แจ้งเตือนด่วน:</strong> คุณมีคนไข้ในความดูแลที่ 
                {highRiskCount > 0 && <span> มีความเสี่ยงสูง (สีแดง) {highRiskCount} ราย</span>}
                {highRiskCount > 0 && missedCount > 0 && <span> และ </span>}
                {missedCount > 0 && <span> ขาดนัด/ขาดยา {missedCount} ราย</span>}
                {' '}กรุณาตรวจสอบในศูนย์การแจ้งเตือน
              </div>
            </div>
          )}
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
