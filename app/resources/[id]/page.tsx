'use client';
import { useParams, useRouter } from 'next/navigation';
import { articles } from '../../../data/mockData';
import { ArrowLeft } from 'lucide-react';
import { use } from 'react';

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const article = articles.find(a => a.id === unwrappedParams.id);

  if (!article) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h2>ไม่พบบทความ</h2>
        <button onClick={() => router.back()} className="btn btn-outline" style={{ marginTop: '1rem' }}>กลับ</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <button onClick={() => router.back()} className="btn btn-outline" style={{ marginBottom: '2rem', padding: '0.5rem 1rem' }}>
        <ArrowLeft size={18} /> กลับ
      </button>
      <article className="glass-panel" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>{article.title}</h1>
        <p className="text-muted" style={{ fontSize: '1.125rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
          {article.summary}
        </p>
        <div style={{ lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-line' }}>
          {article.content}
        </div>
      </article>
    </div>
  );
}
