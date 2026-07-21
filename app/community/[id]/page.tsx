'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const postId = unwrappedParams.id;

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Comment form
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<{ message: string, type?: string } | null>(null);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = () => {
    fetch(`/api/posts/${postId}`)
      .then(res => res.json())
      .then(data => {
        if (data.post) {
          setPost(data.post);
          setComments(data.comments || []);
        }
        setLoading(false);
      });
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Simple hack to detect if admin is replying for demo purposes
    const isAdmin = replyAuthor.toLowerCase().includes('admin') || replyAuthor.includes('แอดมิน');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          content: replyContent,
          author: isAdmin ? 'Admin ผู้เชี่ยวชาญ' : replyAuthor,
          is_admin: isAdmin
        })
      });
      const data = await res.json();

      if (!res.ok) {
        setError({ message: data.error, type: data.type });
      } else {
        setReplyContent('');
        setReplyAuthor('');
        fetchPost(); // Refresh comments
      }
    } catch (err) {
      setError({ message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>กำลังโหลด...</div>;
  if (!post) return <div style={{ textAlign: 'center', padding: '3rem' }}>ไม่พบกระทู้นี้</div>;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <button onClick={() => router.push('/community')} className="btn btn-outline" style={{ marginBottom: '2rem', padding: '0.5rem 1rem' }}>
        <ArrowLeft size={18} /> กลับไปหน้าเว็บบอร์ด
      </button>

      {/* Main Post */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>{post.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          <User size={16} />
          <span>{post.author}</span>
          <span>•</span>
          <span>{new Date(post.created_at).toLocaleString('th-TH')}</span>
        </div>
        <div style={{ whiteSpace: 'pre-line', fontSize: '1.1rem', lineHeight: '1.8' }}>
          {post.content}
        </div>
      </div>

      {/* Comments */}
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>ความคิดเห็น ({comments.length})</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        {comments.map(comment => (
          <div key={comment.id} style={{ 
            background: comment.is_admin ? '#f0fdf4' : 'white', 
            padding: '1.5rem', 
            borderRadius: 'var(--radius-md)', 
            border: comment.is_admin ? '1px solid #86efac' : '1px solid #e2e8f0' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '500', color: comment.is_admin ? '#166534' : 'var(--color-primary-dark)' }}>
              {comment.is_admin ? <ShieldCheck size={18} /> : <User size={18} />}
              {comment.author}
              {comment.is_admin && <span style={{ background: '#22c55e', color: 'white', fontSize: '0.75rem', padding: '0.1rem 0.5rem', borderRadius: '1rem', marginLeft: '0.5rem' }}>Admin</span>}
              <span style={{ fontWeight: 'normal', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                {new Date(comment.created_at).toLocaleString('th-TH')}
              </span>
            </div>
            <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
              {comment.content}
            </div>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>แสดงความคิดเห็น</h3>
        
        {error && (
          <div style={{ background: error.type === 'self_harm' ? '#fee2e2' : '#fef3c7', color: error.type === 'self_harm' ? '#991b1b' : '#92400e', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <AlertTriangle size={24} style={{ flexShrink: 0 }} />
            <div><strong>ไม่สามารถโพสต์ได้:</strong> {error.message}</div>
          </div>
        )}

        <form onSubmit={handleReply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            required 
            placeholder="นามแฝง (พิมพ์ 'admin' เพื่อทดสอบโหมดแอดมิน)"
            value={replyAuthor}
            onChange={(e) => setReplyAuthor(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
          />
          <textarea 
            required
            rows={4}
            placeholder="พิมพ์ความคิดเห็นของคุณที่นี่ (ใช้ถ้อยคำสุภาพ)..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', resize: 'vertical' }}
          />
          <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>
            {isSubmitting ? 'กำลังส่ง...' : 'ส่งความคิดเห็น'}
          </button>
        </form>
      </div>
    </div>
  );
}
