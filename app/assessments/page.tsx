import { assessments } from '../../data/mockData';
import AssessmentCard from '../../components/AssessmentCard';

export default function AssessmentsPage() {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h1 className="section-title">แบบประเมินสุขภาพจิต</h1>
      <p style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem' }} className="text-muted">
        แบบประเมินเหล่านี้เป็นเพียงการคัดกรองเบื้องต้นเพื่อสำรวจตัวเองเท่านั้น 
        ไม่ใช่การวินิจฉัยทางการแพทย์ หากผลประเมินอยู่ในเกณฑ์เสี่ยง 
        ควรปรึกษาแพทย์ผู้เชี่ยวชาญเพื่อความแม่นยำและการรักษาที่ถูกต้อง
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '2rem' }}>
        {assessments.map(assessment => (
          <AssessmentCard key={assessment.id} assessment={assessment} />
        ))}
      </div>
    </div>
  );
}
