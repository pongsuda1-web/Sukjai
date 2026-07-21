import { hotlines } from '../../data/mockData';
import HotlineCard from '../../components/HotlineCard';

export default function HotlinesPage() {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h1 className="section-title">สายด่วนสุขภาพจิตและฉุกเฉิน</h1>
      <p style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }} className="text-muted">
        หากคุณรู้สึกไม่ไหว หรือต้องการความช่วยเหลือเร่งด่วน 
        โปรดอย่าลังเลที่จะติดต่อหน่วยงานเหล่านี้ พวกเขาพร้อมรับฟังและช่วยเหลือคุณ
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '2rem' }}>
        {hotlines.map(hotline => (
          <HotlineCard key={hotline.id} hotline={hotline} />
        ))}
      </div>
    </div>
  );
}
