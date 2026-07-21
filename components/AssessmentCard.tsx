import { Assessment } from '../data/mockData';
import { ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import './Cards.css';

export default function AssessmentCard({ assessment }: { assessment: Assessment }) {
  return (
    <div className="card glass-panel hover-lift assessment-card">
      <div className="assessment-header">
        <ClipboardCheck size={28} className="icon-assessment" />
      </div>
      <h3 className="card-title">{assessment.title}</h3>
      <p className="card-summary">{assessment.description}</p>
      <div className="card-footer" style={{ marginTop: 'auto' }}>
        <Link href={`/assessments/${assessment.id}`} className="btn btn-outline" style={{ width: '100%' }}>
          เริ่มทำแบบประเมิน
        </Link>
      </div>
    </div>
  );
}
