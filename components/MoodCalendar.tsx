'use client';
import { useMemo } from 'react';
import { Calendar, Award, ChevronLeft, ChevronRight } from 'lucide-react';

interface DiaryEntry {
  id: number;
  mood: string;
  created_at: string;
}

interface MoodCalendarProps {
  entries: DiaryEntry[];
  moods: { id: string; emoji: string; label: string; color: string }[];
}

export default function MoodCalendar({ entries, moods }: MoodCalendarProps) {
  // Simple calendar logic for the current month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon

  // Map entries to days
  const moodByDay = useMemo(() => {
    const map = new Map<number, string>();
    entries.forEach(entry => {
      const entryDate = new Date(entry.created_at);
      if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
        // Just take the latest mood of the day if there are multiple
        map.set(entryDate.getDate(), entry.mood);
      }
    });
    return map;
  }, [entries, currentMonth, currentYear]);

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'var(--color-primary-dark)' }}>
          <Calendar size={20} />
          ปฏิทินอารมณ์เดือนนี้
        </h3>
        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          {new Intl.DateTimeFormat('th-TH', { month: 'long', year: 'numeric' }).format(today)}
        </span>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '0.5rem',
        textAlign: 'center',
        marginBottom: '0.5rem'
      }}>
        {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(day => (
          <div key={day} style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>{day}</div>
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '0.5rem'
      }}>
        {blanksArray.map(b => (
          <div key={`blank-${b}`} style={{ height: '40px' }} />
        ))}
        {daysArray.map(day => {
          const moodId = moodByDay.get(day);
          const moodObj = moods.find(m => m.id === moodId);
          const isToday = day === today.getDate();
          
          return (
            <div 
              key={day}
              style={{
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                background: moodObj ? moodObj.color : '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: isToday ? 'bold' : 'normal',
                border: isToday ? '2px solid var(--color-primary-dark)' : '1px solid transparent',
                opacity: moodObj ? 1 : 0.6,
                fontSize: '1rem'
              }}
              title={moodObj ? moodObj.label : 'ไม่มีบันทึก'}
            >
              {moodObj ? moodObj.emoji : <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{day}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
