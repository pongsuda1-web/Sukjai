"use client";
import { useState } from 'react';
import { UserPlus, Download, Search } from 'lucide-react';
import PatientForm from '../PatientForm';

export default function PatientListView({ patients, clinics, onAddPatient, privacyShieldActive, isActive }) {
  const [showModal, setShowModal] = useState(false);

  if (!isActive) return null;

  return (
    <section className="dashboard-view active">
      {showModal && (
        <PatientForm 
          clinics={clinics}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            onAddPatient(data);
            setShowModal(false);
          }}
        />
      )}
      <div className="view-header">
        <div className="view-title">
          <h2>ทะเบียนคนไข้ในการกำกับติดตาม</h2>
          <p>รายชื่อผู้ป่วยในพื้นที่รับผิดชอบและข้อมูลการประสานติดตาม</p>
        </div>
        <div className="action-buttons-wrapper" style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={() => setShowModal(true)} id="btnAddNewPatient"><UserPlus size={16} /> เพิ่มทะเบียนคนไข้ใหม่</button>
          <button className="btn-secondary" id="btnExportPatients"><Download size={16} /> พิมพ์/ส่งออกรายงาน</button>
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
                <td>{privacyShieldActive ? (p.name ? p.name.substring(0, 3) + '*** ****' : '***') : p.name}</td>
                <td>{p.dx}</td>
                <td>{p.hospital}</td>
                <td>{p.village}</td>
                <td>
                  <span className="badge" style={{background: p.risk === 'red' ? '#ffebee' : '#e8f5e9', color: p.risk === 'red' ? '#c62828' : '#2e7d32'}}>
                    {p.smiV}
                  </span>
                </td>
                <td>{p.followup}</td>
                <td>{p.missedAppointments}</td>
                <td>{p.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
