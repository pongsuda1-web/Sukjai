'use client';
import { Award, Star, Zap } from 'lucide-react';

interface BadgesProps {
  entryCount: number;
}

export default function Badges({ entryCount }: BadgesProps) {
  // Gamification logic
  const hasStarted = entryCount >= 1;
  const isExplorer = entryCount >= 3;
  const isMaster = entryCount >= 7;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0', color: '#d97706' }}>
        <Award size={20} />
        เหรียญตราแห่งความสำเร็จ
      </h3>
      
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        
        {/* Badge 1 */}
        <div style={{ 
          minWidth: '100px', 
          textAlign: 'center', 
          opacity: hasStarted ? 1 : 0.4,
          filter: hasStarted ? 'none' : 'grayscale(100%)'
        }}>
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '50%', 
            background: hasStarted ? 'linear-gradient(135deg, #fde68a, #d97706)' : '#e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem',
            boxShadow: hasStarted ? '0 4px 6px rgba(217, 119, 6, 0.2)' : 'none'
          }}>
            <Star size={30} color={hasStarted ? 'white' : '#94a3b8'} fill={hasStarted ? 'white' : 'none'} />
          </div>
          <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: 0, color: 'var(--color-text)' }}>เริ่มต้นฮีลใจ</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>บันทึก 1 ครั้ง</p>
        </div>

        {/* Badge 2 */}
        <div style={{ 
          minWidth: '100px', 
          textAlign: 'center', 
          opacity: isExplorer ? 1 : 0.4,
          filter: isExplorer ? 'none' : 'grayscale(100%)'
        }}>
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '50%', 
            background: isExplorer ? 'linear-gradient(135deg, #a7f3d0, #059669)' : '#e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem',
            boxShadow: isExplorer ? '0 4px 6px rgba(5, 150, 105, 0.2)' : 'none'
          }}>
            <Award size={30} color={isExplorer ? 'white' : '#94a3b8'} />
          </div>
          <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: 0, color: 'var(--color-text)' }}>นักสำรวจใจ</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>บันทึก 3 ครั้ง</p>
        </div>

        {/* Badge 3 */}
        <div style={{ 
          minWidth: '100px', 
          textAlign: 'center', 
          opacity: isMaster ? 1 : 0.4,
          filter: isMaster ? 'none' : 'grayscale(100%)'
        }}>
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '50%', 
            background: isMaster ? 'linear-gradient(135deg, #c7d2fe, #4f46e5)' : '#e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem',
            boxShadow: isMaster ? '0 4px 6px rgba(79, 70, 229, 0.2)' : 'none'
          }}>
            <Zap size={30} color={isMaster ? 'white' : '#94a3b8'} fill={isMaster ? 'white' : 'none'} />
          </div>
          <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: 0, color: 'var(--color-text)' }}>มาสเตอร์!</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>บันทึก 7 ครั้ง</p>
        </div>

      </div>
    </div>
  );
}
