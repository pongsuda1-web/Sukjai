"use client";
import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, CheckSquare } from 'lucide-react';

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

      <div className="alerts-stream-wrapper" style={{ background: '#fff', borderRadius: '8px', padding: '20px', border: '1px solid #cbd5e1' }}>
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
    </section>
  );
}
