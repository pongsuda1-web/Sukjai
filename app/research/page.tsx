'use client';
import { useRouter } from 'next/navigation';

export default function ResearchConsentPage() {
  const router = useRouter();

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <div className="glass-panel" style={{ padding: '3rem' }}>
        <h1 className="section-title" style={{ marginBottom: '2rem' }}>เอกสารแสดงความยินยอมเข้าร่วมการวิจัย</h1>
        <div style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '3rem', color: 'var(--color-text)' }}>
          <p><strong>ชื่อโครงการ:</strong> การศึกษาความพึงพอใจและพฤติกรรมการใช้งานแพลตฟอร์มแหล่งรวบรวมข้อมูลสุขภาพจิต (NAN Sukjai)</p>
          <br/>
          <p>เรียน ผู้เข้าร่วมการวิจัย,</p>
          <p>ผู้วิจัยขอเชิญท่านเข้าร่วมโครงการวิจัยนี้ โดยมีวัตถุประสงค์เพื่อศึกษาพฤติกรรมการค้นหาข้อมูลสุขภาพจิตและความพึงพอใจต่อการใช้งานเว็บแอปพลิเคชัน ข้อมูลที่ได้จะเป็นประโยชน์ในการพัฒนาบริการให้ดียิ่งขึ้น</p>
          <br/>
          <p><strong>สิทธิของผู้เข้าร่วมวิจัย:</strong> ข้อมูลของท่านจะถูกเก็บรักษาเป็นความลับ และจะนำเสนอผลการวิจัยในภาพรวมเท่านั้น ไม่มีการระบุตัวตน ท่านมีสิทธิปฏิเสธหรือถอนตัวจากการวิจัยได้ตลอดเวลาโดยไม่มีผลกระทบใดๆ</p>
          <br/>
          <p>หากท่านเข้าใจและยินยอมเข้าร่วมการวิจัย กรุณากดปุ่ม <strong>"ยินยอมและทำแบบสอบถาม"</strong> ด้านล่าง</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            className="btn btn-outline" 
            onClick={() => router.push('/')}
          >
            ไม่ยินยอม (กลับสู่หน้าหลัก)
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => router.push('/research/survey')}
          >
            ยินยอมและทำแบบสอบถาม
          </button>
        </div>
      </div>
    </div>
  );
}
