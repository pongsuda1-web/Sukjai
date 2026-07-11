"use client";
import { Printer, UsersRound, Gauge, Percent, HeartPulse } from 'lucide-react';

export default function StatsView({ isActive }) {
  if (!isActive) return null;

  return (
    <section className="dashboard-view active">
      <div className="view-header">
        <div className="view-title">
          <h2>รายงานความก้าวหน้าสุขภาพจิตระดับพื้นที่ (สำหรับผู้บริหาร)</h2>
          <p>สถิติมิติด้านผลลัพธ์และความเสี่ยงโดยรวมในพื้นที่ โดยไม่มีข้อมูลส่วนบุคคลหรือรายละเอียดการระบุตัวตน (PDPA Compliant)</p>
        </div>
        <button className="btn-secondary" id="btnStatsExport"><Printer size={16} /> พิมพ์รายงานสรุป</button>
      </div>

      <div className="kpi-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="kpi-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="kpi-icon" style={{ color: '#185fa5' }}><UsersRound size={32} /></div>
          <div className="kpi-details">
            <h3 id="statsTotal" style={{ fontSize: '1.5rem', margin: 0, color: '#0f2537' }}>10</h3>
            <span style={{ fontSize: '0.8rem', color: '#5f5e5a' }}>ผู้ป่วยจิตเวชในชุมชนทั้งหมด</span>
          </div>
        </div>
        <div className="kpi-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="kpi-icon" style={{ color: '#a32d2d' }}><Gauge size={32} /></div>
          <div className="kpi-details">
            <h3 id="statsRedPct" style={{ fontSize: '1.5rem', margin: 0, color: '#0f2537' }}>40%</h3>
            <span style={{ fontSize: '0.8rem', color: '#5f5e5a' }}>สัดส่วนเคสเฝ้าระวังระดับสูง (แดง)</span>
          </div>
        </div>
        <div className="kpi-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="kpi-icon" style={{ color: '#b27318' }}><Percent size={32} /></div>
          <div className="kpi-details">
            <h3 id="statsMissedPct" style={{ fontSize: '1.5rem', margin: 0, color: '#0f2537' }}>15%</h3>
            <span style={{ fontSize: '0.8rem', color: '#5f5e5a' }}>อัตราการขาดนัดสะสมในชุมชน</span>
          </div>
        </div>
        <div className="kpi-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="kpi-icon" style={{ color: '#3b6d11' }}><HeartPulse size={32} /></div>
          <div className="kpi-details">
            <h3 id="statsMedPct" style={{ fontSize: '1.5rem', margin: 0, color: '#0f2537' }}>60%</h3>
            <span style={{ fontSize: '0.8rem', color: '#5f5e5a' }}>ความสม่ำเสมอในการรับประทานยา</span>
          </div>
        </div>
      </div>

      <div className="charts-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="chart-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px' }}>สัดส่วนระดับความเสี่ยงการเฝ้าระวัง</h3>
          <div className="chart-container" style={{ height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8' }}>
            {/* Chart.js Canvas would go here */}
            [รอการเชื่อมต่อ Chart.js]
          </div>
        </div>
        <div className="chart-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px' }}>อัตราความสม่ำเสมอการรับประทานยาจำแนกตามประเภทผู้ป่วย</h3>
          <div className="chart-container" style={{ height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8' }}>
            {/* Chart.js Canvas would go here */}
            [รอการเชื่อมต่อ Chart.js]
          </div>
        </div>
      </div>
    </section>
  );
}
