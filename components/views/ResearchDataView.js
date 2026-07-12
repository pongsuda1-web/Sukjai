"use client";
import { useState, useEffect } from 'react';
import { Download, Database } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';
import * as XLSX from 'xlsx';

export default function ResearchDataView({ isActive, currentUser }) {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchSurveys() {
      if (!isActive || currentUser?.role !== 'admin') return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('research_surveys')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setSurveys(data || []);
      } catch (err) {
        console.error('Failed to fetch surveys:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSurveys();
  }, [isActive, currentUser]);

  if (!isActive) return null;

  if (currentUser?.role !== 'admin') {
    return (
      <section className="dashboard-view active" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>ไม่มีสิทธิ์เข้าถึงข้อมูล</h2>
        <p>เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถดูผลการวิจัยได้</p>
      </section>
    );
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(surveys);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Survey_Data");
    XLSX.writeFile(workbook, "Sukjai_Research_Data.xlsx");
  };

  return (
    <section className="dashboard-view active">
      <div className="view-header">
        <div className="view-title">
          <h2>ฐานข้อมูลแบบประเมิน (Research Data)</h2>
          <p>ข้อมูลดิบจากผู้ใช้งานที่ตอบแบบสอบถาม เพื่อใช้สำหรับงานวิจัย (Export to SPSS/Excel)</p>
        </div>
        <button className="btn-primary" onClick={exportToExcel} disabled={surveys.length === 0}>
          <Download size={16} /> ส่งออกข้อมูลเป็น Excel (.xlsx)
        </button>
      </div>

      <div className="table-container" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #cbd5e1', overflowX: 'auto', marginTop: '20px' }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>กำลังโหลดข้อมูล...</div>
        ) : surveys.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>ยังไม่มีข้อมูลผู้ตอบแบบประเมิน</div>
        ) : (
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px' }}>วันที่ตอบ</th>
                <th style={{ padding: '12px' }}>SUS-1</th>
                <th style={{ padding: '12px' }}>SUS-2</th>
                <th style={{ padding: '12px' }}>SUS-3</th>
                <th style={{ padding: '12px' }}>TAM-1</th>
                <th style={{ padding: '12px' }}>TAM-2</th>
                <th style={{ padding: '12px' }}>TAM-3</th>
                <th style={{ padding: '12px' }}>ข้อเสนอแนะฟีเจอร์</th>
                <th style={{ padding: '12px' }}>ข้อเสนอแนะภาพรวม</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px' }}>{new Date(s.created_at).toLocaleString('th-TH')}</td>
                  <td style={{ padding: '12px' }}>{s.sus_1}</td>
                  <td style={{ padding: '12px' }}>{s.sus_2}</td>
                  <td style={{ padding: '12px' }}>{s.sus_3}</td>
                  <td style={{ padding: '12px' }}>{s.tam_1}</td>
                  <td style={{ padding: '12px' }}>{s.tam_2}</td>
                  <td style={{ padding: '12px' }}>{s.tam_3}</td>
                  <td style={{ padding: '12px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={s.feedback_features}>{s.feedback_features || '-'}</td>
                  <td style={{ padding: '12px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={s.feedback_overall}>{s.feedback_overall || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
