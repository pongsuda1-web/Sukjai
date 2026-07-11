"use client";
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export default function AlertCenterView({ isActive }) {
  if (!isActive) return null;

  return (
    <section className="dashboard-view active">
      <div className="view-header">
        <div className="view-title">
          <h2>ศูนย์การแจ้งเตือนความเสี่ยงและขาดนัด</h2>
          <p>แจ้งเตือนอัติโนมัติเมื่อคนไข้ขาดนัดสะสม ≥ 2 ครั้ง หรือขาดนัดนานเกิน 6 เดือน หรือมีการหยุดยาโดยพลการ</p>
        </div>
      </div>

      <div className="alert-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="kpi-card danger" style={{ background: '#fcebeb', border: '1px solid #f5c2c2', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="kpi-icon" style={{ color: '#a32d2d' }}><AlertTriangle size={32} /></div>
          <div className="kpi-details">
            <h3 style={{ fontSize: '1.5rem', color: '#a32d2d', margin: 0 }}>2</h3>
            <span style={{ fontSize: '0.85rem', color: '#5f5e5a' }}>แจ้งเตือนรอการติดตามการด่วน</span>
          </div>
        </div>
        <div className="kpi-card warning" style={{ background: '#faf0e0', border: '1px solid #f8dfb6', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="kpi-icon" style={{ color: '#b27318' }}><Clock size={32} /></div>
          <div className="kpi-details">
            <h3 style={{ fontSize: '1.5rem', color: '#b27318', margin: 0 }}>1</h3>
            <span style={{ fontSize: '0.85rem', color: '#5f5e5a' }}>ขาดนัดนานเกิน 6 เดือน</span>
          </div>
        </div>
        <div className="kpi-card info" style={{ background: '#eaf3de', border: '1px solid #cde4b3', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="kpi-icon" style={{ color: '#3b6d11' }}><CheckCircle size={32} /></div>
          <div className="kpi-details">
            <h3 style={{ fontSize: '1.5rem', color: '#3b6d11', margin: 0 }}>5</h3>
            <span style={{ fontSize: '0.85rem', color: '#5f5e5a' }}>ติดตามแล้ว (Acknowledged)</span>
          </div>
        </div>
      </div>

      <div className="alerts-stream-wrapper" style={{ background: '#fff', borderRadius: '8px', padding: '20px', border: '1px solid #cbd5e1' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>การกระทำที่รอดำเนินการ</h3>
        <div className="alerts-list">
          <p style={{ color: '#5f5e5a', fontSize: '0.9rem' }}>ยังไม่มีรายการแจ้งเตือนใหม่ในขณะนี้</p>
        </div>
      </div>
    </section>
  );
}
