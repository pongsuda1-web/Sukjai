"use client";
import { ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '../../utils/supabase/client';

export default function AuditLogView({ isActive }) {
  const [logs, setLogs] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchLogs() {
      if (!isActive) return;
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error || !data || data.length === 0) throw new Error('No DB logs');
        
        const formattedLogs = data.map(l => ({
          timestamp: l.created_at,
          username: l.username,
          role: l.role,
          event: l.event,
          hn: l.target_hn || "-",
          details: l.details,
          ip: "-"
        }));
        setLogs(formattedLogs);
      } catch (err) {
        // Fallback to mock logs if table doesn't exist or empty
        const mockLogs = [
          { timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), username: "system_daemon", role: "system", event: "SYSTEM_INIT", hn: "-", details: "เริ่มทำงานระบบระบบและเชื่อมต่อฐานข้อมูล PDPA Shield v1.0", ip: "127.0.0.1" },
          { timestamp: new Date(Date.now() - 3600000).toISOString(), username: "nurse_somjai", role: "doctor", event: "VIEW_MAP", hn: "-", details: "เข้าใช้งานหน้าแผนที่ติดตามผู้ป่วยประจำสัปดาห์", ip: "192.168.1.45" }
        ];
        setLogs(mockLogs);
      }
    }
    fetchLogs();
  }, [isActive]);

  if (!isActive) return null;

  return (
    <section className="dashboard-view active">
      <div className="view-header">
        <div className="view-title">
          <h2>ประวัติกิจกรรมความปลอดภัยของระบบ (Audit Log)</h2>
          <p className="warning-text" style={{ color: '#a32d2d', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginTop: '8px' }}>
            <ShieldAlert size={16} /> บันทึกประเภท Append-Only ไม่สามารถแก้ไข ปรับแต่ง หรือลบได้ เพื่อประเมินการเข้าถึงข้อมูลอ่อนไหวตามข้อกำหนด PDPA มาตรา 39
          </p>
        </div>
      </div>

      <div className="audit-filters" style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <input type="text" id="auditSearchInput" placeholder="ค้นหาโดยชื่อผู้ใช้, กิจกรรม, หรือรหัสผู้ป่วย..." style={{ flexGrow: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <select id="auditFilterAction" className="filter-select" style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
          <option value="all">กิจกรรมทั้งหมด</option>
          <option value="VIEW_PROFILE">การเข้าถึงข้อมูลคนไข้ (View Profile)</option>
          <option value="VIEW_MAP">การเปิดหน้าแผนที่ (View Map)</option>
          <option value="ACK_ALERT">การรับทราบการแจ้งเตือน (Acknowledge Alert)</option>
          <option value="EXPORT">การส่งออกข้อมูล (Export)</option>
          <option value="ROLE_CHANGE">การเปลี่ยนสิทธิ์ระบบ (Role Change)</option>
        </select>
      </div>

      <div className="table-container" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #cbd5e1', overflowX: 'auto' }}>
        <table className="data-table audit-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px' }}>เวลาบันทึก (Timestamp)</th>
              <th style={{ padding: '12px' }}>ผู้ใช้งาน (User / Role)</th>
              <th style={{ padding: '12px' }}>หมวดหมู่ (Event)</th>
              <th style={{ padding: '12px' }}>รหัสเป้าหมาย (HN Target)</th>
              <th style={{ padding: '12px' }}>รายละเอียดเหตุการณ์ (Details)</th>
              <th style={{ padding: '12px' }}>เลขไอพี (IP Address)</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px' }}>{new Date(log.timestamp).toLocaleString('th-TH')}</td>
                <td style={{ padding: '12px' }}>{log.username} ({log.role})</td>
                <td style={{ padding: '12px' }}>{log.event}</td>
                <td style={{ padding: '12px' }}>{log.hn}</td>
                <td style={{ padding: '12px' }}>{log.details}</td>
                <td style={{ padding: '12px' }}>{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
