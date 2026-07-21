import Link from 'next/link';
import { PhoneCall, HeartPulse, ShieldAlert, Navigation } from 'lucide-react';
import './home.css';
import { hotlines } from '../data/mockData';
import HotlineCard from '../components/HotlineCard';

export default function Home() {
  const mainHotlines = hotlines.slice(0, 3); // Show top 3 hotlines

  return (
    <div className="home-page">
        {/* Hero Section */}
        <section style={{ 
          textAlign: 'center', 
          padding: '4rem 1.5rem', 
          background: 'linear-gradient(135deg, var(--color-accent-light) 0%, var(--color-secondary-light) 100%)', 
          borderRadius: 'var(--radius-lg)',
          marginBottom: '4rem',
          boxShadow: 'var(--shadow-soft)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src="/images/hero_bear.jpg" alt="Mascot Bear" style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '50%', marginBottom: '1.5rem', border: '4px solid white', boxShadow: 'var(--shadow-soft)' }} />
            <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>NAN Sukjai (น่านสุขใจ)</h1>
            <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
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
