"use client";
import { ShieldCheck, Settings, Send, MessageSquareWarning } from 'lucide-react';

export default function SettingsView({ privacyShieldActive, setPrivacyShieldActive, isActive, clinics = [], onUpdateClinic, currentUser }) {
  if (!isActive) return null;

  return (
    <section className="dashboard-view active">
      <div className="view-header">
        <div className="view-title">
          <h2>สิทธิ์ของผู้ป่วยและการตั้งค่าระบบความปลอดภัย</h2>
          <p>จัดการความยินยอม (Consent Management) และคำขอใช้สิทธิ์ของคนไข้ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)</p>
        </div>
      </div>

      <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* PDPA Rights Form */}
        <div className="settings-card pdpa-card" style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '8px', color: '#0f2537' }}>
            <ShieldCheck size={20} /> บันทึกสิทธิ์และรับคำร้องเรียนผู้ป่วย
          </h3>
          <p className="settings-card-desc" style={{ fontSize: '0.85rem', color: '#5f5e5a', marginBottom: '20px' }}>
            เมื่อผู้ป่วยยื่นความจำนงเกี่ยวกับการควบคุมข้อมูลส่วนบุคคล
          </p>
          
          <form id="pdpaRequestForm" className="settings-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={e => e.preventDefault()}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="pdpaPatientHn" style={{ fontSize: '0.85rem', fontWeight: 600 }}>เลขทะเบียนผู้ป่วย (HN) ที่ยื่นคำขอ</label>
              <input type="text" id="pdpaPatientHn" placeholder="ระบุ HN ผู้ป่วย เช่น HN-001" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="pdpaRightType" style={{ fontSize: '0.85rem', fontWeight: 600 }}>ประเภทสิทธิ์การใช้งานที่ต้องการร้องขอ</label>
              <select id="pdpaRightType" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                <option value="access">สิทธิ์ขอเข้าถึง/รับสำเนาข้อมูลสุขภาพ (มาตรา 30)</option>
                <option value="rectify">สิทธิ์ขอแก้ไขข้อมูลให้ถูกต้อง (มาตรา 35)</option>
                <option value="delete">สิทธิ์ขอให้ลบหรือทำลายข้อมูล (มาตรา 33)</option>
                <option value="restrict">สิทธิ์ขอให้ระงับการแชร์ข้อมูลกับ อสม./เยี่ยมบ้าน (มาตรา 34)</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="pdpaDetails" style={{ fontSize: '0.85rem', fontWeight: 600 }}>เหตุผลและรายละเอียดคำขอ</label>
              <textarea id="pdpaDetails" rows="3" placeholder="ระบุรายละเอียดเพิ่มเติม หรือเอกสารอ้างอิง..." required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'vertical' }}></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px', background: '#185fa5', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              <Send size={16} /> บันทึกคำร้องและแจ้งเตือน DPO
            </button>
          </form>
        </div>

        {/* System Security Configurations */}
        <div className="settings-card security-config-card" style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '20px', color: '#0f2537' }}>
            <Settings size={20} /> การตั้งค่าความปลอดภัยระบบ
          </h3>
          
          <div className="security-toggle-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="toggle-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <div className="toggle-label">
                <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>เข้ารหัสข้อมูลการวินิจฉัย (At-Rest)</h4>
                <p style={{ fontSize: '0.8rem', color: '#5f5e5a' }}>เข้ารหัสฐานข้อมูลฟิลด์ ICD-10 และอาการด้วยคีย์ AES-256</p>
              </div>
              <div className="toggle-switch-wrapper">
                <input type="checkbox" checked readOnly disabled />
              </div>
            </div>

            <div className="toggle-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <div className="toggle-label">
                <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>จำกัดพิกัดแผนที่ (Differential Privacy)</h4>
                <p style={{ fontSize: '0.8rem', color: '#5f5e5a' }}>บังคับเยื้องตำแหน่ง GPS สุ่มรัศมี 100-300 เมตร ทุกพิกัดคนไข้จิตเวช</p>
              </div>
              <div className="toggle-switch-wrapper">
                <input 
                  type="checkbox" 
                  checked={privacyShieldActive} 
                  onChange={(e) => setPrivacyShieldActive(e.target.checked)} 
                />
              </div>
            </div>

            <div className="toggle-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <div className="toggle-label">
                <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>จำกัดการส่งออกเอกสาร</h4>
                <p style={{ fontSize: '0.8rem', color: '#5f5e5a' }}>บล็อกการ Export ไฟล์สำหรับบทบาทที่ไม่ได้เป็น Clinical Staff</p>
              </div>
              <div className="toggle-switch-wrapper">
                <input type="checkbox" defaultChecked />
              </div>
            </div>

            <div className="toggle-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="toggle-label">
                <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>ระบบควบคุมประวัติแก้ไข (Anti-Tampering)</h4>
                <p style={{ fontSize: '0.8rem', color: '#5f5e5a' }}>เปิดใช้งานระบบตรวจสอบการแก้ไข Log ผ่าน Hash Chain</p>
              </div>
              <div className="toggle-switch-wrapper">
                <input type="checkbox" checked readOnly disabled />
              </div>
            </div>
          </div>
        </div>

        {/* Line Notify Config */}
        {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
          <div className="settings-card line-notify-card" style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #cbd5e1', gridColumn: '1 / -1' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '20px', color: '#0f2537' }}>
              <MessageSquareWarning size={20} /> ตั้งค่าการแจ้งเตือน Line Notify ประจำ รพ.สต.
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#5f5e5a', marginBottom: '15px' }}>
              ระบุ Line Token ของแต่ละโรงพยาบาล เพื่อให้ระบบแจ้งเตือนเข้ากลุ่ม Line อัตโนมัติเมื่อมีการเพิ่มเคสเฝ้าระวังใหม่
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {clinics.map(clinic => (
                <div key={clinic.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <div style={{ minWidth: '150px', fontWeight: 600, fontSize: '0.9rem' }}>{clinic.name}</div>
                  <input 
                    type="password" 
                    placeholder="วาง Line Notify Token (ปล่อยว่างเพื่อปิดแจ้งเตือน)" 
                    defaultValue={clinic.line_token || ''}
                    id={`token-${clinic.id}`}
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                  <button 
                    className="btn-secondary" 
                    onClick={() => onUpdateClinic(clinic.id, document.getElementById(`token-${clinic.id}`).value)}
                  >
                    บันทึก Token
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
