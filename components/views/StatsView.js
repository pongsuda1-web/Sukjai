import { useState } from 'react';
import { Printer, UsersRound, Gauge, Percent, HeartPulse, Filter } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler);

export default function StatsView({ isActive, patients = [], clinics = [], currentUser }) {
  const [selectedHospital, setSelectedHospital] = useState('all');

  if (!isActive) return null;

  const isRestrictedRole = currentUser?.role === 'jhw';
  
  // Filter patients based on selected hospital
  const filteredPatients = patients.filter(p => {
    if (selectedHospital === 'all') return true;
    return p.hospital_id === selectedHospital || p.hospital === selectedHospital; 
    // using hospital name string since patient schema maps hospital to clinic name
  });

  const totalPatients = filteredPatients.length;
  const redCount = filteredPatients.filter(p => p.risk === 'red').length;
  const yellowCount = filteredPatients.filter(p => p.risk === 'yellow').length;
  const greenCount = filteredPatients.filter(p => p.risk === 'green').length;

  const redPct = totalPatients ? Math.round((redCount / totalPatients) * 100) : 0;
  
  const missedCount = filteredPatients.filter(p => p.missedAppointments > 0).length;
  const missedPct = totalPatients ? Math.round((missedCount / totalPatients) * 100) : 0;

  const medCount = filteredPatients.filter(p => p.medicationStatus === true).length;
  const medPct = totalPatients ? Math.round((medCount / totalPatients) * 100) : 0; 

  const pieData = {
    labels: ['ความเสี่ยงสูง (แดง)', 'ความเสี่ยงปานกลาง (เหลือง)', 'ความเสี่ยงต่ำ (เขียว)'],
    datasets: [
      {
        data: [redCount, yellowCount, greenCount],
        backgroundColor: ['#ff5252', '#ff9800', '#4caf50'],
        borderWidth: 1,
      },
    ],
  };

  // Process DX (ICD-10) groupings for the Bar Chart
  const dxCounts = {};
  filteredPatients.forEach(p => {
    // Basic grouping by finding the first word/code (e.g., "F20.0 Schizophrenia" -> "F20.0")
    // Or just group by the entire string if they are consistent.
    let dx = p.dx || 'ไม่ระบุ';
    if (dxCounts[dx]) {
      dxCounts[dx]++;
    } else {
      dxCounts[dx] = 1;
    }
  });

  // Sort by highest count
  const sortedDx = Object.keys(dxCounts).sort((a, b) => dxCounts[b] - dxCounts[a]);
  const topDxLabels = sortedDx.slice(0, 5); // Show top 5 diseases
  const topDxData = topDxLabels.map(label => dxCounts[label]);

  const barData = {
    labels: topDxLabels.length > 0 ? topDxLabels : ['ไม่มีข้อมูล'],
    datasets: [
      {
        label: 'จำนวนผู้ป่วย (คน)',
        data: topDxData.length > 0 ? topDxData : [0],
        backgroundColor: '#185fa5',
      },
    ],
  };

  // Trend Data Logic (Mocked history + Current data)
  const currentRedCount = redCount || 0;
  
  const trendData = {
    labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'เดือนนี้'],
    datasets: [
      {
        label: 'จำนวนผู้ป่วยกลุ่มเสี่ยงสูง (สีแดง)',
        data: [currentRedCount + 10, currentRedCount + 12, currentRedCount + 8, currentRedCount + 5, currentRedCount + 2, currentRedCount],
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      }
    ]
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    }
  };

  return (
    <section className="dashboard-view active">
      <div className="view-header">
        <div className="view-title">
          <h2>รายงานความก้าวหน้าสุขภาพจิตระดับพื้นที่</h2>
          <p>สถิติมิติด้านผลลัพธ์และความเสี่ยงโดยรวมในพื้นที่ โดยไม่มีข้อมูลส่วนบุคคลหรือรายละเอียดการระบุตัวตน</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {!isRestrictedRole && (
            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0 10px' }}>
              <Filter size={16} color="#5f5e5a" style={{ marginRight: '5px' }} />
              <select 
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                style={{ border: 'none', background: 'none', padding: '8px', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <option value="all">ดูภาพรวมทั้งหมด (ทุก รพ.)</option>
                {clinics.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
          <button className="btn-secondary" id="btnStatsExport" onClick={() => window.print()}><Printer size={16} /> พิมพ์รายงานสรุป</button>
        </div>
      </div>

      <div className="kpi-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="kpi-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="kpi-icon" style={{ color: '#185fa5' }}><UsersRound size={32} /></div>
          <div className="kpi-details">
            <h3 id="statsTotal" style={{ fontSize: '1.5rem', margin: 0, color: '#0f2537' }}>{totalPatients}</h3>
            <span style={{ fontSize: '0.8rem', color: '#5f5e5a' }}>ผู้ป่วยจิตเวชในชุมชนทั้งหมด</span>
          </div>
        </div>
        <div className="kpi-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="kpi-icon" style={{ color: '#a32d2d' }}><Gauge size={32} /></div>
          <div className="kpi-details">
            <h3 id="statsRedPct" style={{ fontSize: '1.5rem', margin: 0, color: '#0f2537' }}>{redPct}%</h3>
            <span style={{ fontSize: '0.8rem', color: '#5f5e5a' }}>สัดส่วนเคสเฝ้าระวังระดับสูง (แดง)</span>
          </div>
        </div>
        <div className="kpi-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="kpi-icon" style={{ color: '#b27318' }}><Percent size={32} /></div>
          <div className="kpi-details">
            <h3 id="statsMissedPct" style={{ fontSize: '1.5rem', margin: 0, color: '#0f2537' }}>{missedPct}%</h3>
            <span style={{ fontSize: '0.8rem', color: '#5f5e5a' }}>อัตราการขาดนัดสะสมในชุมชน</span>
          </div>
        </div>
        <div className="kpi-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="kpi-icon" style={{ color: '#3b6d11' }}><HeartPulse size={32} /></div>
          <div className="kpi-details">
            <h3 id="statsMedPct" style={{ fontSize: '1.5rem', margin: 0, color: '#0f2537' }}>{medPct}%</h3>
            <span style={{ fontSize: '0.8rem', color: '#5f5e5a' }}>ความสม่ำเสมอในการรับประทานยา</span>
          </div>
        </div>
      </div>

      <div className="charts-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="chart-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px' }}>สัดส่วนระดับความเสี่ยงการเฝ้าระวัง</h3>
          <div className="chart-container" style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="chart-card" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px' }}>จำนวนผู้ป่วยจำแนกตามโรค (ICD-10)</h3>
          <div className="chart-container" style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        {/* Trend Line Chart */}
        <div className="stats-card" style={{ gridColumn: '1 / -1', background: '#fff', borderRadius: '8px', padding: '20px', border: '1px solid #cbd5e1' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#0f2537' }}>แนวโน้มผู้ป่วยเสี่ยงสูง (สีแดง) ย้อนหลัง 6 เดือน</h3>
          <div className="chart-wrapper" style={{ height: '300px' }}>
            <Line data={trendData} options={trendOptions} />
          </div>
        </div>

      </div>
    </section>
  );
}
