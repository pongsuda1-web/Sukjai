"use client";
import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, CheckSquare, Activity } from 'lucide-react';

export default function AlertCenterView({ isActive, patients = [] }) {
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Generate alerts based on patients
    const newAlerts = [];
    patients.forEach(p => {
      if (p.risk === 'red') {
        newAlerts.push({
          id: `alert-risk-${p.id}`,
          patientId: p.id,
          patientName: p.name,
          hn: p.hn,
          type: 'high_risk',
          message: `ผู้ป่วยมีความเสี่ยงระดับสูง (สีแดง) จำเป็นต้องเฝ้าระวังอย่างใกล้ชิด`,
          date: new Date().toISOString()
        });
      }
      if (p.missedAppointments > 0) {
        newAlerts.push({
          id: `alert-missed-${p.id}`,
          patientId: p.id,
          patientName: p.name,
          hn: p.hn,
          type: 'missed_appointment',
          message: `ผู้ป่วยขาดนัดสะสม ${p.missedAppointments} ครั้ง ควรติดตามเร่งด่วน`,
          date: new Date().toISOString()
        });
      }
    });
    setAlerts(newAlerts);
  }, [patients]);

  if (!isActive) return null;

  const handleAcknowledge = (alertId) => {
    setAcknowledgedAlerts([...acknowledgedAlerts, alertId]);
  };

  const activeAlerts = alerts.filter(a => !acknowledgedAlerts.includes(a.id));

  // Smart Scheduler Logic
  const today = new Date();
  const next7Days = new Date(today);
  next7Days.setDate(next7Days.getDate() + 7);

  const dueVisits = patients.filter(p => {
    if (!p.next_visit_date) return false;
    const nextDate = new Date(p.next_visit_date);
    return nextDate >= today && nextDate <= next7Days;
  });
  
  const highRiskCount = activeAlerts.filter(a => a.type === 'high_risk').length;
  const missedCount = activeAlerts.filter(a => a.type === 'missed_appointment').length;
  const ackCount = acknowledgedAlerts.length;

  return (
    <section className="dashboard-view active">
      <div className="view-header">
        <div className="view-title">
          <h2>ศูนย์การแจ้งเตือนความเสี่ยงและขาดนัด</h2>
          <p>แจ้งเตือนอัตโนมัติเมื่อคนไข้ขาดนัดสะสม หรือมีความเสี่ยงระดับสูง (สีแดง)</p>
        </div>
      </div>

      <div className="alert-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="kpi-card danger" style={{ background: '#fcebeb', border: '1px solid #f5c2c2', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="kpi-icon" style={{ color: '#a32d2d' }}><AlertTriangle size={32} /></div>
          <div className="kpi-details">
            <h3 style={{ fontSize: '1.5rem', color: '#a32d2d', margin: 0 }}>{highRiskCount}</h3>
            <span style={{ fontSize: '0.85rem', color: '#5f5e5a' }}>แจ้งเตือนเคสความเสี่ยงสูง (สีแดง)</span>
          </div>
        </div>
        <div className="kpi-card warning" style={{ background: '#faf0e0', border: '1px solid #f8dfb6', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="kpi-icon" style={{ color: '#b27318' }}><Clock size={32} /></div>
          <div className="kpi-details">
            <h3 style={{ fontSize: '1.5rem', color: '#b27318', margin: 0 }}>{missedCount}</h3>
            <span style={{ fontSize: '0.85rem', color: '#5f5e5a' }}>แจ้งเตือนผู้ป่วยขาดนัดสะสม</span>
          </div>
        </div>
        <div className="kpi-card info" style={{ background: '#eaf3de', border: '1px solid #cde4b3', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="kpi-icon" style={{ color: '#3b6d11' }}><CheckCircle size={32} /></div>
          <div className="kpi-details">
            <h3 style={{ fontSize: '1.5rem', color: '#3b6d11', margin: 0 }}>{ackCount}</h3>
            <span style={{ fontSize: '0.85rem', color: '#5f5e5a' }}>รับทราบ / ประสานงานแล้ว</span>
          </div>
        </div>
      </div>

      <div className="alerts-stream-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ background: '#fff', borderRadius: '8px', padding: '20px', border: '1px solid #cbd5e1' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>รายการแจ้งเตือนที่รอดำเนินการ</h3>
          <div className="alerts-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeAlerts.length === 0 ? (
              <p style={{ color: '#5f5e5a', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>ไม่มีรายการแจ้งเตือนใหม่ในขณะนี้ ยอดเยี่ยมมากครับ! 🎉</p>
            ) : (
              activeAlerts.map(alert => (
                <div key={alert.id} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '16px', borderRadius: '8px', 
                  background: alert.type === 'high_risk' ? '#fff5f5' : '#fffcf5',
                  borderLeft: `4px solid ${alert.type === 'high_risk' ? '#f44336' : '#ff9800'}`
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#0f2537' }}>
                      {alert.patientName} <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'normal' }}>({alert.hn})</span>
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#5f5e5a' }}>{alert.message}</p>
                  </div>
                  <button 
                    onClick={() => handleAcknowledge(alert.id)}
                    className="btn-secondary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', color: '#185fa5' }}
                  >
                    <CheckSquare size={16} /> รับทราบ
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Smart Appointment Scheduler Section */}
        <div className="alert-section" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px' }}>
            <Activity size={20} color="#185fa5" /> กำหนดการเยี่ยมบ้านใน 7 วันนี้ (Smart Scheduler)
          </h3>
          
          <div className="alert-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dueVisits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>ไม่มีกำหนดการเยี่ยมบ้านใน 7 วันนี้</div>
            ) : (
              dueVisits.map(p => (
                <div key={p.id} className="alert-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8fafc', borderLeft: '4px solid #185fa5', borderRadius: '6px' }}>
                  <div className="alert-content">
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#0f2537' }}>{p.name} (HN: {p.hn})</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#5f5e5a' }}>
                      กำหนดเยี่ยม: {new Date(p.next_visit_date).toLocaleDateString('th-TH')} | พิกัด: {p.village}
                    </p>
                  </div>
                  <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                    ใกล้ถึงกำหนดเยี่ยม
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
