'use client';
import { useState, useEffect } from 'react';

interface DiaryEntry {
  id: number;
  mood: string;
  note: string;
  system_reply: string | null;
  created_at: string;
}

const moods = [
  { id: 'overjoyed', emoji: '🥰', label: 'ฟิน / ดีใจสุดๆ', color: '#fbcfe8' },
  { id: 'inlove', emoji: '😍', label: 'อินเลิฟ / คลั่งรัก', color: '#f9a8d4' },
  { id: 'excited', emoji: '🤩', label: 'ตื่นเต้น', color: '#fef08a' },
  { id: 'happy', emoji: '😊', label: 'มีความสุข', color: 'var(--color-primary-light)' },
  { id: 'grateful', emoji: '💖', label: 'รู้สึกขอบคุณ', color: '#f472b6' },
  { id: 'proud', emoji: '😎', label: 'ภูมิใจ', color: '#fde047' },
  { id: 'calm', emoji: '😌', label: 'ผ่อนคลาย', color: 'var(--color-secondary-light)' },
  { id: 'relieved', emoji: '😮‍💨', label: 'โล่งใจ', color: '#bfdbfe' },
  { id: 'neutral', emoji: '😐', label: 'เฉยๆ', color: '#e2e8f0' },
  { id: 'bored', emoji: '🙄', label: 'เบื่อหน่าย', color: '#d1d5db' },
  { id: 'shy', emoji: '😳', label: 'เขินอาย', color: '#fecdd3' },
  { id: 'confused', emoji: '😵‍💫', label: 'สับสน', color: '#e5e7eb' },
  { id: 'surprised', emoji: '😱', label: 'ตกใจ', color: '#fef08a' },
  { id: 'sleepy', emoji: '😴', label: 'ง่วงนอน', color: '#c7d2fe' },
  { id: 'tired', emoji: '😩', label: 'เหนื่อยล้า', color: '#e2cfc4' },
  { id: 'burnout', emoji: '🫠', label: 'หมดไฟ', color: '#fed7aa' },
  { id: 'empty', emoji: '😶', label: 'ว่างเปล่า', color: '#e5e5e5' },
  { id: 'anxious', emoji: '😰', label: 'กังวล', color: '#fcd5ce' },
  { id: 'annoyed', emoji: '😒', label: 'รำคาญ', color: '#f87171' },
  { id: 'hurt', emoji: '🤕', label: 'เจ็บปวด', color: '#fca5a5' },
  { id: 'lonely', emoji: '🥺', label: 'เหงา', color: '#e9d5ff' },
  { id: 'disappointed', emoji: '😔', label: 'ผิดหวัง', color: '#cbd5e1' },
  { id: 'guilty', emoji: '😞', label: 'รู้สึกผิด', color: '#9ca3af' },
  { id: 'despair', emoji: '😫', label: 'ท้อแท้', color: '#d6d3d1' },
  { id: 'sad', emoji: '😢', label: 'เศร้า', color: 'var(--color-accent-light)' },
  { id: 'angry', emoji: '😡', label: 'โกรธ', color: 'var(--color-error)' },
];

export default function DiaryPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check or create anonymous user id
    let id = 'guest_' + Math.random().toString(36).substr(2, 9);
    try {
      const storedId = localStorage.getItem('nansukjai_user_id');
      if (storedId) {
        id = storedId;
      } else {
        localStorage.setItem('nansukjai_user_id', id);
      }
    } catch (e) {
      console.warn('localStorage is not available, using temporary session id');
    }
    setUserId(id);
    fetchEntries(id);
  }, []);

  const fetchEntries = async (id: string) => {
    try {
      const res = await fetch(`/api/diary?userId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.logs);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood || !userId) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, mood: selectedMood, note })
      });

      if (res.ok) {
        setNote('');
        setSelectedMood(null);
        fetchEntries(userId); // refresh
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      
      <div className="glass-panel" style={{ 
        padding: '2rem', 
        marginBottom: '2.5rem', 
        background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-secondary-light) 100%)',
        borderLeft: '6px solid var(--color-primary-dark)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '0.75rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📖 บันทึกอารมณ์และไดอารี่ประจำวัน
        </h1>
        <p style={{ textAlign: 'left', margin: 0, fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: '1.6' }}>
          พื้นที่ส่วนตัวของคุณสำหรับสำรวจความรู้สึกและระบายสิ่งที่เจอมาในวันนี้
          <br/>
          <span style={{ fontSize: '0.9rem', opacity: 0.75 }}>(ข้อมูลถูกจัดเก็บแบบไม่ระบุตัวตนและผูกกับอุปกรณ์นี้เท่านั้น)</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary-dark)', textAlign: 'left', fontSize: '1.5rem' }}>วันนี้คุณรู้สึกอย่างไร?</h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'flex-start', marginBottom: '2.5rem' }}>
          {moods.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMood(m.id)}
              style={{
                background: selectedMood === m.id ? m.color : 'white',
                border: selectedMood === m.id ? '2px solid var(--color-primary-dark)' : '1px solid #cbd5e1',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                transform: selectedMood === m.id ? 'scale(1.05)' : 'scale(1)',
                minWidth: '100px'
              }}
            >
              <span style={{ fontSize: '3.2rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))', marginBottom: '0.25rem' }}>{m.emoji}</span>
              <span style={{ fontWeight: '600', color: 'var(--color-text)', fontSize: '0.95rem' }}>{m.label}</span>
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>เล่าเรื่องราวหรือระบายสิ่งที่คุณเจอในวันนี้ (ไม่บังคับ)</label>
          <textarea
            rows={4}
            placeholder="วันนี้มีเรื่องอะไรทำให้คุณรู้สึกแบบนี้? เขียนระบายได้เลย..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', resize: 'vertical' }}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
          disabled={!selectedMood || isSubmitting}
        >
          {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกอารมณ์'}
        </button>
      </form>

      <h2 className="section-title" style={{ fontSize: '1.8rem', textAlign: 'left', marginBottom: '1.5rem' }}>ประวัติไดอารี่ของคุณ</h2>
      {entries.length === 0 ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>ยังไม่มีบันทึกไดอารี่ ลองบันทึกอารมณ์แรกของคุณดูสิครับ</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {entries.map(entry => {
            const moodObj = moods.find(m => m.id === entry.mood);
            const dateObj = new Date(entry.created_at);
            const dateStr = new Intl.DateTimeFormat('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(dateObj) + ' น.';
            
            return (
              <div key={entry.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ 
                  background: moodObj?.color || 'var(--color-background)', 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '2rem',
                  flexShrink: 0
                }}>
                  {moodObj?.emoji || '❔'}
                </div>
                <div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{dateStr}</div>
                  {entry.note ? (
                    <p style={{ color: 'var(--color-text)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{entry.note}</p>
                  ) : (
                    <p className="text-muted" style={{ fontStyle: 'italic' }}>ไม่ได้เขียนข้อความบันทึกไว้</p>
                  )}

                  {entry.system_reply && (
                    <div style={{
                      marginTop: '1.5rem',
                      background: 'rgba(233, 213, 255, 0.3)', // Soft purple background for reply
                      borderLeft: '4px solid #d8b4fe',
                      padding: '1rem',
                      borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                    }}>
                      <p style={{ margin: 0, color: 'var(--color-text-dark)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                        {entry.system_reply}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
