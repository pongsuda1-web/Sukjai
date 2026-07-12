"use client";
import { useState } from 'react';
import { ClipboardList, Send, CheckCircle } from 'lucide-react';

export default function SurveyView({ isActive, onSubmitSurvey }) {
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    role: '',
    experience_years: '',
    tech_familiarity: '',
    sus_1: '', sus_2: '', sus_3: '', sus_4: '', sus_5: '', sus_6: '', sus_7: '', sus_8: '',
    tam_9: '', tam_10: '', tam_11: '', tam_12: '', tam_13: '', tam_14: '', tam_15: '',
    sec_16: '', sec_17: '', sec_18: '',
    feedback_features: '',
    feedback_improvements: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isActive) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitSurvey) {
      onSubmitSurvey(formData);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <section className="dashboard-view active" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <CheckCircle size={64} color="#22c55e" style={{ marginBottom: '20px' }} />
        <h2>ขอบคุณที่ร่วมตอบแบบสอบถาม!</h2>
        <p style={{ color: '#5f5e5a', maxWidth: '500px', marginTop: '10px' }}>
          ข้อมูลของคุณมีค่าอย่างยิ่งต่องานวิจัยและการพัฒนาระบบ Sukjai ต่อไป เพื่อให้ระบบช่วยเหลือผู้ป่วยจิตเวชในชุมชนได้อย่างมีประสิทธิภาพสูงสุด
        </p>
      </section>
    );
  }

  const renderRadioGroup = (name, label) => (
    <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <p style={{ margin: '0 0 10px 0', fontWeight: 500, fontSize: '0.95rem' }}>{label}</p>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5].map(val => (
          <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="radio" name={name} value={val} required onChange={handleChange} />
            {val === 1 && '1 (น้อยที่สุด)'}
            {val === 2 && '2'}
            {val === 3 && '3 (ปานกลาง)'}
            {val === 4 && '4'}
            {val === 5 && '5 (มากที่สุด)'}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <section className="dashboard-view active">
      <div className="view-header">
        <div className="view-title">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClipboardList size={24} color="#185fa5" /> แบบสอบถามเพื่องานวิจัย
          </h2>
          <p>การประเมินคุณภาพและประสิทธิผลการใช้งานระบบ Sukjai (SUS & TAM Model)</p>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Section 1: Demographics */}
          <div>
            <h3 style={{ borderBottom: '2px solid #185fa5', paddingBottom: '8px', marginBottom: '16px', color: '#0f2537' }}>ส่วนที่ 1: ข้อมูลทั่วไป</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>บทบาท/ตำแหน่งหน้าที่ *</label>
                <select name="role" required onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                  <option value="">-- เลือก --</option>
                  <option value="doctor">แพทย์</option>
                  <option value="nurse">พยาบาลวิชาชีพ</option>
                  <option value="psychologist">นักจิตวิทยา</option>
                  <option value="jhw">อสม. / นักสังคมสงเคราะห์</option>
                  <option value="admin">ผู้บริหาร / สสอ.</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>ประสบการณ์การทำงาน (ปี) *</label>
                <input type="number" name="experience_years" required onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>ความคุ้นเคยกับการใช้เทคโนโลยี *</label>
                <select name="tech_familiarity" required onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                  <option value="">-- เลือก --</option>
                  <option value="low">น้อยมาก</option>
                  <option value="medium">ปานกลาง</option>
                  <option value="high">คล่องแคล่ว</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: SUS */}
          <div>
            <h3 style={{ borderBottom: '2px solid #185fa5', paddingBottom: '8px', marginBottom: '16px', color: '#0f2537' }}>ส่วนที่ 2: คุณภาพการใช้งานระบบ (System Usability)</h3>
            {renderRadioGroup('sus_1', '1. ฉันคิดว่าฉันอยากใช้ระบบ Sukjai นี้บ่อยๆ ในการทำงาน')}
            {renderRadioGroup('sus_2', '2. ฉันพบว่าระบบนี้มีความซับซ้อนเกินความจำเป็น')}
            {renderRadioGroup('sus_3', '3. ฉันคิดว่าระบบนี้ใช้งานง่ายและเรียนรู้ได้เร็ว')}
            {renderRadioGroup('sus_4', '4. ฉันต้องขอความช่วยเหลือจากผู้เชี่ยวชาญเสมอเมื่อต้องใช้งานระบบนี้')}
            {renderRadioGroup('sus_5', '5. ฉันพบว่าฟังก์ชันต่างๆ ของระบบนี้มีการทำงานที่สอดคล้องกันเป็นอย่างดี')}
            {renderRadioGroup('sus_6', '6. ฉันคิดว่าระบบนี้มีความยุ่งยากและไม่เป็นเหตุเป็นผล')}
            {renderRadioGroup('sus_7', '7. ฉันรู้สึกมั่นใจในการใช้งานระบบ Sukjai ด้วยตนเอง')}
            {renderRadioGroup('sus_8', '8. ฉันต้องเรียนรู้สิ่งใหม่ๆ มากมายก่อนที่จะสามารถใช้งานระบบนี้ได้')}
          </div>

          {/* Section 3: TAM */}
          <div>
            <h3 style={{ borderBottom: '2px solid #185fa5', paddingBottom: '8px', marginBottom: '16px', color: '#0f2537' }}>ส่วนที่ 3: ประโยชน์ที่ได้รับ (Technology Acceptance)</h3>
            {renderRadioGroup('tam_9', '9. การบันทึกและค้นหาข้อมูลผู้ป่วยทำได้รวดเร็วกว่าระบบเดิม')}
            {renderRadioGroup('tam_10', '10. ระบบแผนที่ (GIS) ช่วยให้มองเห็นภาพรวมคนไข้ได้ชัดเจน')}
            {renderRadioGroup('tam_11', '11. การแสดงผลสถิติและกราฟ (Dashboard) เข้าใจง่ายและเป็นประโยชน์')}
            {renderRadioGroup('tam_12', '12. ระบบแจ้งเตือน (Alert) ช่วยให้ไม่พลาดการติดตามผู้ป่วยกลุ่มเสี่ยง')}
            {renderRadioGroup('tam_13', '13. ระบบนัดหมายอัจฉริยะช่วยลดภาระการจำและวางแผนงานได้ดีขึ้น')}
            {renderRadioGroup('tam_14', '14. ระบบ Sukjai ช่วยเพิ่มประสิทธิภาพและลดเวลาในการทำงานโดยรวม')}
            {renderRadioGroup('tam_15', '15. ระบบนี้ช่วยยกระดับคุณภาพการดูแลผู้ป่วยจิตเวชในชุมชนให้ดีขึ้นกว่าเดิม')}
          </div>

          {/* Section 4: Privacy */}
          <div>
            <h3 style={{ borderBottom: '2px solid #185fa5', paddingBottom: '8px', marginBottom: '16px', color: '#0f2537' }}>ส่วนที่ 4: ความปลอดภัยและความเป็นส่วนตัว (PDPA)</h3>
            {renderRadioGroup('sec_16', '16. ฉันรู้สึกมั่นใจว่าข้อมูลความลับของผู้ป่วยถูกจัดเก็บอย่างปลอดภัย')}
            {renderRadioGroup('sec_17', '17. ฟีเจอร์ซ่อนชื่อ/โรคสำหรับเจ้าหน้าที่บางระดับ มีความเหมาะสมและรัดกุม')}
            {renderRadioGroup('sec_18', '18. การมีระบบ Audit Log ทำให้ฉันรู้สึกว่าระบบมีความโปร่งใส')}
          </div>

          {/* Section 5: Feedback */}
          <div>
            <h3 style={{ borderBottom: '2px solid #185fa5', paddingBottom: '8px', marginBottom: '16px', color: '#0f2537' }}>ส่วนที่ 5: ข้อเสนอแนะปลายเปิด</h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>ฟีเจอร์ใดที่คุณชื่นชอบหรือมีประโยชน์ที่สุด?</label>
              <textarea name="feedback_features" rows="3" onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}></textarea>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>พบปัญหาใดบ้าง หรือมีข้อเสนอแนะในการปรับปรุงระบบนี้อย่างไร?</label>
              <textarea name="feedback_improvements" rows="3" onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}></textarea>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '14px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <Send size={20} /> ส่งแบบประเมินงานวิจัย
          </button>
        </form>
      </div>
    </section>
  );
}
