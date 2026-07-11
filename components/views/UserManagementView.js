"use client";
import { Users, CheckCircle, Shield, XCircle } from 'lucide-react';

export default function UserManagementView({ users, onUpdateUser, currentUser, isActive }) {
  if (!isActive) return null;

  const isAdmin = currentUser?.role === 'admin';

  return (
    <section className="dashboard-view active">
      <div className="view-header">
        <div className="view-title">
          <h2>จัดการสิทธิ์ผู้ใช้งาน (User Management)</h2>
          <p>ตรวจสอบรายชื่อเจ้าหน้าที่และปรับเปลี่ยนสิทธิ์การเข้าถึงระบบ</p>
        </div>
      </div>

      <div className="table-container" style={{ marginTop: '1rem', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ชื่อ-นามสกุล</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>อีเมล / Username</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>สถานะการอนุมัติ</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>สิทธิ์การใช้งาน (Role)</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{u.full_name || '-'} {u.id === currentUser?.id && <span style={{fontSize:'0.8rem', color:'#888'}}>(คุณ)</span>}</td>
                <td style={{ padding: '12px' }}>{u.username}</td>
                <td style={{ padding: '12px' }}>
                  <button 
                    disabled={!isAdmin}
                    onClick={() => onUpdateUser(u.id, { is_approved: !u.is_approved })}
                    style={{
                      padding: '6px 12px', borderRadius: '4px', cursor: isAdmin ? 'pointer' : 'not-allowed',
                      border: 'none', background: u.is_approved ? '#e8f5e9' : '#ffebee',
                      color: u.is_approved ? '#2e7d32' : '#c62828',
                      display: 'flex', alignItems: 'center', gap: '5px'
                    }}
                  >
                    {u.is_approved ? <><CheckCircle size={14}/> อนุมัติแล้ว</> : <><XCircle size={14}/> รออนุมัติ</>}
                  </button>
                </td>
                <td style={{ padding: '12px' }}>
                  <select 
                    disabled={!isAdmin}
                    value={u.role}
                    onChange={(e) => onUpdateUser(u.id, { role: e.target.value })}
                    style={{ 
                      padding: '8px', borderRadius: '4px', border: '1px solid #ddd', 
                      background: isAdmin ? '#fff' : '#f5f5f5', cursor: isAdmin ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                    <option value="manager">ผู้บริหาร (Manager)</option>
                    <option value="doctor">แพทย์ (Doctor)</option>
                    <option value="social_worker">นักสังคมสงเคราะห์ (Social Worker)</option>
                    <option value="jhw">อสม. (JHW)</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isAdmin && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#fff3e0', color: '#e65100', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={20} />
            <span>บัญชีของคุณไม่ใช่ "ผู้ดูแลระบบ (Admin)" จึงสามารถดูรายชื่อได้อย่างเดียว แต่ไม่สามารถแก้ไขสิทธิ์ได้</span>
          </div>
        )}
      </div>
    </section>
  );
}
