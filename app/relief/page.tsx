'use client';
import { useState, useEffect, useRef } from 'react';
import { Wind, Flame, Music, Trash2, HeartHandshake } from 'lucide-react';
import './relief.css';

export default function ReliefPage() {
  const [activeTab, setActiveTab] = useState<'breathe' | 'destroy' | 'music'>('breathe');
  
  // Breathing State
  const [breathePhase, setBreathePhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breatheText, setBreatheText] = useState('พร้อมไหม?');
  const [breatheTimer, setBreatheTimer] = useState(0);
  
  // Destroyer State
  const [thought, setThought] = useState('');
  const [isShattering, setIsShattering] = useState(false);

  // Breathing Logic (4-7-8 Technique)
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    if (breathePhase === 'inhale') {
      setBreatheText('หายใจเข้า...');
      setBreatheTimer(4);
      timerId = setTimeout(() => setBreathePhase('hold'), 4000);
    } else if (breathePhase === 'hold') {
      setBreatheText('กลั้นไว้...');
      setBreatheTimer(7);
      timerId = setTimeout(() => setBreathePhase('exhale'), 7000);
    } else if (breathePhase === 'exhale') {
      setBreatheText('หายใจออก...');
      setBreatheTimer(8);
      timerId = setTimeout(() => setBreathePhase('inhale'), 8000);
    } else {
      setBreatheText('พร้อมไหม?');
    }
    
    return () => clearTimeout(timerId);
  }, [breathePhase]);

  // Countdown for breathing text
  useEffect(() => {
    if (breathePhase === 'idle' || breatheTimer <= 0) return;
    const interval = setInterval(() => {
      setBreatheTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [breatheTimer, breathePhase]);

  const handleDestroy = () => {
    if (!thought.trim()) return;
    setIsShattering(true);
    setTimeout(() => {
      setThought('');
      setIsShattering(false);
    }, 1200); // Wait for animation to finish
  };

  return (
    <div className="relief-container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <HeartHandshake size={48} className="text-primary" style={{ margin: '0 auto 1rem' }} />
        <h1 className="section-title" style={{ margin: 0 }}>เครื่องมือฮีลใจด่วน</h1>
        <p className="text-muted" style={{ marginTop: '0.5rem' }}>พื้นที่สำหรับพักผ่อนจิตใจและจัดการกับความเครียดฉับพลัน</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button 
          className={`btn ${activeTab === 'breathe' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('breathe')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Wind size={18} /> ฝึกลมหายใจ
        </button>
        <button 
          className={`btn ${activeTab === 'destroy' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('destroy')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Trash2 size={18} /> ทิ้งความเครียด
        </button>
        <button 
          className={`btn ${activeTab === 'music' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('music')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Music size={18} /> เพลงผ่อนคลาย
        </button>
      </div>

      {/* Breathing Section */}
      {activeTab === 'breathe' && (
        <div className="glass-panel" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>เทคนิคหายใจ 4-7-8</h2>
          <p className="text-muted">ช่วยลดอัตราการเต้นของหัวใจ บรรเทาความวิตกกังวล และช่วยให้นอนหลับง่ายขึ้น</p>
          
          <div className="breathing-circle-container">
            <div 
              className={`breathing-circle ${breathePhase}`}
              style={{ transitionDuration: breathePhase === 'inhale' ? '4s' : breathePhase === 'exhale' ? '8s' : '0.2s' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>{breatheText}</span>
                {breathePhase !== 'idle' && <span style={{ fontSize: '2rem' }}>{breatheTimer > 0 ? breatheTimer : ''}</span>}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            {breathePhase === 'idle' ? (
              <button className="btn btn-primary" onClick={() => setBreathePhase('inhale')} style={{ fontSize: '1.2rem', padding: '0.75rem 2rem' }}>
                เริ่มฝึกหายใจ
              </button>
            ) : (
              <button className="btn btn-outline" onClick={() => setBreathePhase('idle')}>
                หยุดพัก
              </button>
            )}
          </div>
        </div>
      )}

      {/* Destroy Section */}
      {activeTab === 'destroy' && (
        <div className="glass-panel thought-destroyer" style={{ padding: '3rem 1.5rem', position: 'relative' }}>
          <h2 style={{ color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Trash2 size={28} /> ถังขยะอารมณ์
          </h2>
          <p className="text-muted" style={{ marginBottom: '2rem' }}>
            พิมพ์ความรู้สึกแย่ๆ ความโกรธ หรือความกังวลลงไป แล้วกดปุ่มเพื่อ <strong>ขยำมันทิ้งลงถังขยะ</strong><br/>
            (ข้อความจะไม่ถูกบันทึกหรือส่งไปที่ใดทั้งสิ้น)
          </p>

          <div style={{ position: 'relative' }}>
            <textarea 
              className={`thought-textarea ${isShattering ? 'crumple-animation' : ''}`}
              placeholder="พิมพ์สิ่งที่ทำให้คุณรู้สึกแย่ตรงนี้..."
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            ></textarea>
            {isShattering && (
              <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', color: '#64748b', animation: 'fade-in-out 1.2s forwards' }}>
                <Trash2 size={64} />
              </div>
            )}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button 
              className="btn btn-primary" 
              onClick={handleDestroy} 
              disabled={isShattering || !thought.trim()}
              style={{ background: '#334155', borderColor: '#334155', fontSize: '1.2rem', padding: '0.75rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Trash2 size={24} /> ขยำทิ้งเลย!
            </button>
          </div>
        </div>
      )}

      {/* Music Section */}
      {activeTab === 'music' && (
        <div className="glass-panel" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>เพลง Lo-Fi ฮีลใจ</h2>
          <p className="text-muted" style={{ marginBottom: '2rem' }}>เปิดคลอเบาๆ เพื่อให้จิตใจสงบ หรือช่วยให้มีสมาธิขณะอ่านหนังสือ</p>
          
          <div className="music-player">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/lTRiuFIWV54?autoplay=0" 
              title="1 A.M Study Session - lofi hip hop/chill beats" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
