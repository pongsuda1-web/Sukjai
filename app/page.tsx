import Link from 'next/link';
import { PhoneCall, HeartPulse, ShieldAlert, Navigation, AlertTriangle, Eye, MessageCircleWarning, Activity } from 'lucide-react';
import './home.css';
import { hotlines } from '../data/mockData';
import HotlineCard from '../components/HotlineCard';

export default function Home() {
  const mainHotlines = hotlines.slice(0, 3); // Show top 3 hotlines

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <img src="/images/hero_bear.jpg" alt="Mascot Bear" className="hero-image" />
          <h1 className="hero-title">NAN Sukjai (น่านสุขใจ)</h1>
          <p className="hero-description">
            พื้นที่ปลอดภัยสำหรับหัวใจของคุณ แหล่งรวบรวมข้อมูลสุขภาพจิต สถานพยาบาล สายด่วน และแบบประเมินเบื้องต้น
          </p>
        </div>
      </section>

      {/* Quick Services */}
      <section className="services-section container">
        <h2 className="section-title">บริการของเรา</h2>
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ background: 'var(--color-accent-light)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#0284c7' }}>
              <HeartPulse size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>สุขภาพจิตคือเรื่องของทุกคน</h3>
            <p className="text-muted" style={{ lineHeight: '1.6' }}>การดูแลจิตใจมีความสำคัญไม่แพ้ร่างกาย ไม่ใช่เรื่องผิดปกติที่จะขอความช่วยเหลือ</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <img src="/images/cat_mascot.jpg" alt="Cat Mascot" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary-light)' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>เริ่มต้นที่การสำรวจตัวเอง</h3>
            <p className="text-muted" style={{ lineHeight: '1.6' }}>ใช้แบบประเมินเบื้องต้นของเราเพื่อทำความเข้าใจสภาวะอารมณ์ของคุณในปัจจุบัน</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
             <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <img src="/images/dog_mascot.jpg" alt="Dog Mascot" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-secondary-light)' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>ไม่โดดเดี่ยว</h3>
            <p className="text-muted" style={{ lineHeight: '1.6' }}>เราได้รวบรวมสถานพยาบาลและสายด่วนที่พร้อมรับฟังและช่วยเหลือคุณในทุกภาค</p>
          </div>
        </div>
      </section>

      {/* Warning Signs Section */}
      <section className="warning-section container" style={{ padding: '4rem 1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '3rem', borderLeft: '5px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <AlertTriangle size={32} color="#ef4444" />
            <h2 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)', margin: 0 }}>สัญญาณเตือนที่ไม่ควรมองข้าม</h2>
          </div>
          <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            บางครั้งคนใกล้ตัวอาจไม่กล้าเอ่ยปากขอความช่วยเหลือ การสังเกตสัญญาณเหล่านี้อาจช่วยชีวิตพวกเขาได้ หากพบอาการเหล่านี้ติดต่อกันเกิน 2 สัปดาห์ ควรพาไปพบผู้เชี่ยวชาญ
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '50%', height: 'max-content' }}>
                <Eye size={24} color="#ef4444" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#b91c1c' }}>พฤติกรรมเปลี่ยนไปชัดเจน</h3>
                <p className="text-muted" style={{ lineHeight: '1.5' }}>เก็บตัว ไม่อยากเจอใคร เลิกทำกิจกรรมที่เคยชอบ หรือมีปัญหาเรื่องการกินและการนอนอย่างหนัก (กินน้อย/มากไป นอนไม่หลับ/หลับตลอดเวลา)</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '50%', height: 'max-content' }}>
                <MessageCircleWarning size={24} color="#ef4444" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#b91c1c' }}>คำพูดที่ส่งสัญญาณอันตราย</h3>
                <p className="text-muted" style={{ lineHeight: '1.5' }}>มักพูดว่า "ไม่อยากอยู่แล้ว", "รู้สึกไร้ค่า", "เป็นภาระของคนอื่น", หรือมีการโพสต์ข้อความเชิงสั่งเสียลงโซเชียลมีเดีย</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '50%', height: 'max-content' }}>
                <Activity size={24} color="#ef4444" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#b91c1c' }}>อารมณ์รุนแรงกวัดแกว่ง</h3>
                <p className="text-muted" style={{ lineHeight: '1.5' }}>หงุดหงิดก้าวร้าวผิดปกติ ร้องไห้โดยไม่มีเหตุผล หรือจากที่เศร้ามากๆ จู่ๆ ก็กลับมาอารมณ์ดีผิดปกติ (อาจเป็นสัญญาณว่าตัดสินใจบางอย่างได้แล้ว)</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '50%', height: 'max-content' }}>
                <ShieldAlert size={24} color="#ef4444" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#b91c1c' }}>แจกจ่ายของรัก / จัดการธุระ</h3>
                <p className="text-muted" style={{ lineHeight: '1.5' }}>เริ่มนำของสะสมหรือของที่มีค่าต่อจิตใจไปให้คนอื่น จัดการพินัยกรรม หรือฝากฝังให้ดูแลคน/สัตว์เลี้ยง</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlighted Hotlines */}
      <section className="highlight-hotlines container">
        <h2 className="section-title">สายด่วนแนะนำ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {mainHotlines.map(hotline => (
            <HotlineCard key={hotline.id} hotline={hotline} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/hotlines" className="btn btn-outline">
            ดูเบอร์สายด่วนทั้งหมด
          </Link>
        </div>
      </section>
    </div>
  );
}
