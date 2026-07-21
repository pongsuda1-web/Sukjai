'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResearchSurveyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    occupation: '',
    how_known: '',
    expectations: '',
    is_helpful: '',
    satisfaction_score: 5,
    feedback: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, we'd also pull assessment_scores from context/localStorage
    const payload = { ...formData, assessment_scores: { "dummy": 0 } };

    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>ขอบคุณสำหรับการร่วมงานวิจัย!</h2>
          <p className="text-muted" style={{ marginBottom: '2rem' }}>ข้อมูลของคุณจะเป็นประโยชน์อย่างยิ่งในการพัฒนาแพลตฟอร์มของเรา</p>
          <button className="btn btn-primary" onClick={() => router.push('/')}>กลับสู่หน้าหลัก</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '700px' }}>
      <h1 className="section-title">แบบสอบถามงานวิจัย</h1>
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>เพศ</label>
          <select 
            required 
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
          >
            <option value="">เลือกเพศ...</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
            <option value="ทางเลือก">เพศทางเลือก</option>
            <option value="ไม่ระบุ">ไม่ระบุ</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>อายุ</label>
          <input 
            type="number" 
            required 
            placeholder="เช่น 25"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>อาชีพ</label>
          <input 
            type="text" 
            required
            placeholder="เช่น นักศึกษา, พนักงานบริษัท"
            value={formData.occupation}
            onChange={(e) => setFormData({...formData, occupation: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>ความพึงพอใจต่อการใช้งานเว็บแอปพลิเคชัน (1-5)</label>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
            {[1,2,3,4,5].map(score => (
              <label key={score} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="satisfaction" 
                  value={score}
                  checked={formData.satisfaction_score === score}
                  onChange={() => setFormData({...formData, satisfaction_score: score})}
                  style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary)' }}
                />
                <span>{score}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>รู้จักแอปพลิเคชัน/เว็บไซต์นี้ได้อย่างไร?</label>
          <input 
            type="text" 
            placeholder="เช่น ค้นหาผ่าน Google, เพื่อนแนะนำ, โซเชียลมีเดีย"
            value={formData.how_known}
            onChange={(e) => setFormData({...formData, how_known: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>มีความคาดหวังอย่างไรก่อนเข้ามาใช้งาน?</label>
          <textarea 
            rows={2}
            placeholder="เช่น อยากหาคนรับฟัง, อยากทำแบบประเมินความเครียด..."
            value={formData.expectations}
            onChange={(e) => setFormData({...formData, expectations: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>ได้รับคำตอบหรือได้รับการช่วยเหลือตามที่คาดหวังหรือไม่?</label>
          <textarea 
            rows={2}
            placeholder="เช่น ได้รับข้อมูลที่ต้องการ, รู้สึกดีขึ้น..."
            value={formData.is_helpful}
            onChange={(e) => setFormData({...formData, is_helpful: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>ข้อเสนอแนะเพิ่มเติม (มีอะไรแนะนำหรือไม่?)</label>
          <textarea 
            rows={3}
            placeholder="ความเห็นหรือข้อเสนอแนะที่อยากให้ปรับปรุง..."
            value={formData.feedback}
            onChange={(e) => setFormData({...formData, feedback: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', resize: 'vertical' }}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={isSubmitting}>
          {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งคำตอบ'}
        </button>
      </form>
    </div>
  );
}
