'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function CreatePostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: '', content: '', author: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<{ message: string, type?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        setError({ message: data.error, type: data.type });
      } else {
        router.push(`/community/${data.id}`);
      }
    } catch (err) {
      setError({ message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '700px' }}>
      <button onClick={() => router.back()} className="btn btn-outline" style={{ marginBottom: '2rem', padding: '0.5rem 1rem' }}>
        <ArrowLeft size={18} /> กลับ
      </button>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem' }}>ตั้งกระทู้ใหม่</h1>
        
        {error && (
          <div style={{ 
            background: error.type === 'self_harm' ? '#fee2e2' : '#fef3c7', 
            color: error.type === 'self_harm' ? '#991b1b' : '#92400e', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <AlertTriangle size={24} style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>ไม่สามารถโพสต์ได้</strong>
              {error.message}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>นามแฝง (Nickname)</label>
            <input 
              type="text" 
              required 
              placeholder="ไม่ต้องใช้ชื่อจริง..."
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>หัวข้อกระทู้</label>
            <input 
              type="text" 
              required 
              placeholder="เรื่องที่อยากพูดคุย..."
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>รายละเอียด</label>
            <textarea 
              required
              rows={6}
              placeholder="ระบายความรู้สึก หรือสอบถามสิ่งที่คุณสงสัย (โปรดใช้ถ้อยคำสุภาพ)..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', resize: 'vertical' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'กำลังโพสต์...' : 'ตั้งกระทู้'}
          </button>
        </form>
      </div>
    </div>
  );
}
