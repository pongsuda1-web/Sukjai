'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Plus } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  author: string;
  created_at: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        if (data.posts) setPosts(data.posts);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ margin: 0 }}>เว็บบอร์ด (Community)</h1>
        <Link href="/community/create" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} />
          ตั้งกระทู้ใหม่
        </Link>
      </div>
      
      <p className="text-muted" style={{ marginBottom: '2rem' }}>
        พื้นที่ปลอดภัยสำหรับแบ่งปันเรื่องราวและพูดคุย ทุกการพูดคุยที่นี่ไม่มีการระบุตัวตน (Anonymous)
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>กำลังโหลดข้อมูล...</div>
      ) : posts.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <MessageSquare size={48} className="text-muted" style={{ margin: '0 auto 1rem' }} />
          <p>ยังไม่มีกระทู้ในขณะนี้ เป็นคนแรกที่เริ่มการสนทนาสิครับ!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map(post => (
            <Link key={post.id} href={`/community/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-panel hover-lift" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>{post.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }} className="text-muted">
                    <span>โดย: {post.author}</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleString('th-TH')}</span>
                  </div>
                </div>
                <MessageSquare className="text-primary" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
