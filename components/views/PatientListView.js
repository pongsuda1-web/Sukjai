"use client";
import { useState, useRef } from 'react';
import { UserPlus, Download, Search, Edit2, Trash2, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import PatientForm from '../PatientForm';

export default function PatientListView({ patients, clinics, onAddPatient, onEditPatient, onDeletePatient, onImportPatients, privacyShieldActive, currentUser, isActive }) {
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const fileInputRef = useRef(null);

  if (!isActive) return null;

  const isRestrictedRole = currentUser?.role === 'jhw' || currentUser?.role === 'social_worker';
  const forcePrivacy = isRestrictedRole ? true : privacyShieldActive;

  const exportToExcel = () => {
    // Format data for export
    const exportData = patients.map(p => {
      // If restricted role, hide sensitive info in export too
      const nameToExport = forcePrivacy ? (p.name ? p.name.substring(0, 3) + '*** ****' : '***') : p.name;
      const dxToExport = isRestrictedRole ? '---' : (p.dx || '');
      const notesToExport = isRestrictedRole ? '---' : (p.notes || '');

      return {
        'HN': p.hn,
        'ชื่อ-นามสกุล': nameToExport,
        'การวินิจฉัย (ICD-10)': dxToExport,
        'โรงพยาบาล': p.hospital,
        'หมู่บ้าน': p.village,
        'ระดับความเสี่ยง': p.risk === 'red' ? 'เฝ้าระวังสูง (แดง)' : p.risk === 'yellow' ? 'เฝ้าระวังปานกลาง (เหลือง)' : 'เฝ้าระวังต่ำ (เขียว)',
        'SMI-V': p.smiV,
        'ความถี่การติดตาม': p.followup,
        'ขาดนัด (ครั้ง)': p.missedAppointments,
        'หมายเหตุ': notesToExport
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
    
    // Auto-fit columns
    const colWidths = [
      { wch: 10 }, // HN
      { wch: 25 }, // Name
      { wch: 20 }, // DX
      { wch: 25 }, // Hospital
      { wch: 20 }, // Village
      { wch: 20 }, // Risk
      { wch: 15 }, // SMI-V
      { wch: 15 }, // Followup
      { wch: 15 }, // Missed
      { wch: 30 }  // Notes
    ];
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, "Sukjai_Patient_Registry.xlsx");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      
      if (data.length > 0 && onImportPatients) {
        onImportPatients(data);
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsBinaryString(file);
  };

  return (
    <section className="dashboard-view active">
      {showModal && (
        <PatientForm 
          clinics={clinics}
          initialData={editingPatient}
          currentUser={currentUser}
          onClose={() => {
            setShowModal(false);
            setEditingPatient(null);
          }}
          onSave={(data) => {
            if (editingPatient) {
              onEditPatient(editingPatient.id, data);
            } else {
              onAddPatient(data);
            }
            setShowModal(false);
            setEditingPatient(null);
          }}
        />
      )}
      <div className="view-header">
        <div className="view-title">
          <h2>ทะเบียนคนไข้ในการกำกับติดตาม</h2>
          <p>รายชื่อผู้ป่วยในพื้นที่รับผิดชอบและข้อมูลการประสานติดตาม</p>
        </div>
        <div className="action-buttons-wrapper" style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={() => {
            setEditingPatient(null);
            setShowModal(true);
          }} id="btnAddNewPatient"><UserPlus size={16} /> เพิ่มทะเบียนคนไข้ใหม่</button>
          
          {(currentUser?.role === 'admin' || currentUser?.role === 'manager' || currentUser?.role === 'doctor') && (
            <>
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileUpload}
              />
              <button 
                className="btn-secondary" 
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} /> นำเข้าข้อมูล (Excel)
              </button>
            </>
          )}

          <button className="btn-secondary" id="btnExportPatients" onClick={exportToExcel}><Download size={16} /> พิมพ์/ส่งออกรายงาน</button>
        </div>
      </div>
      
      <div className="search-filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input type="text" id="patientSearchInput" placeholder="ค้นหาตามชื่อ, HN, หรือตำบล..." />
        </div>
        <div className="filters">
          <select id="filterRiskLevel" className="filter-select">
            <option value="all">ทุกความเสี่ยง</option>
            <option value="red">เฝ้าระวังสูง (แดง)</option>
            <option value="yellow">เฝ้าระวังปานกลาง (เหลือง)</option>
            <option value="green">เฝ้าระวังต่ำ (เขียว)</option>
          </select>
          <select id="filterFollowUp" className="filter-select">
            <option value="all">ทุกระดับติดตาม</option>
            <option value="weekly">รายสัปดาห์</option>
            <option value="monthly">รายเดือน</option>
            <option value="quarterly">ราย 3 เดือน</option>
            <option value="semi-annual">ราย 6 เดือน</option>
          </select>
        </div>
      </div>

      <div className="table-container" style={{ marginTop: '1rem' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.5)' }}>
              <th>HN</th>
              <th>ชื่อ - นามสกุล</th>
              {!isRestrictedRole && <th>การวินิจฉัย (ICD-10)</th>}
              <th>โรงพยาบาล</th>
              <th>รพ.สต.</th>
              <th>หมู่บ้าน</th>
              <th>SMI-V</th>
              <th>ระดับติดตาม</th>
              <th>ขาดนัด</th>
              {!isRestrictedRole && <th>NOTE</th>}
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{p.hn}</td>
                <td>{forcePrivacy ? (p.name ? p.name.substring(0, 3) + '*** ****' : '***') : p.name}</td>
                {!isRestrictedRole && <td>{p.dx}</td>}
                  <td style={{ fontSize: '0.9rem' }}>{p.hospital}</td>
                  <td style={{ fontSize: '0.9rem', color: '#0277bd' }}>{p.pcu}</td>
                  <td style={{ fontSize: '0.9rem' }}>{p.village}</td>
                <td>
                  <span className="badge" style={{background: p.risk === 'red' ? '#ffebee' : '#e8f5e9', color: p.risk === 'red' ? '#c62828' : '#2e7d32'}}>
                    {p.smiV}
                  </span>
                </td>
                <td>{p.followup}</td>
                <td>{p.missedAppointments}</td>
                {!isRestrictedRole && <td>{p.notes || '-'}</td>}
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button 
                    onClick={() => {
                      setEditingPatient(p);
                      setShowModal(true);
                    }} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#185fa5', marginRight: '10px' }}
                    title="แก้ไขข้อมูล"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(`คุณต้องการลบข้อมูลผู้ป่วย ${p.name} ใช่หรือไม่?\n(การลบข้อมูลจะไม่สามารถกู้คืนได้)`)) {
                        onDeletePatient(p.id);
                      }
                    }} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53935' }}
                    title="ลบข้อมูล"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
