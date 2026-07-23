'use client';
import { useState } from 'react';
import { articles } from '../../data/mockData';
import ArticleCard from '../../components/ArticleCard';
import { useRouter } from 'next/navigation';

export default function ResourcesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');

  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(a => a.category === filter);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h1 className="section-title">คลังความรู้สุขภาพใจ</h1>
      
      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
        <button 
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('all')}
        >ทั้งหมด</button>
        <button 
          className={`btn ${filter === 'psychiatric' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('psychiatric')}
        >โรคจิตเวช</button>
        <button 
          className={`btn ${filter === 'family' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('family')}
        >ครอบครัว & ความสัมพันธ์</button>
        <button 
          className={`btn ${filter === 'teen' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('teen')}
        >วัยรุ่น & วัยเรียน</button>
        <button 
          className={`btn ${filter === 'general' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('general')}
        >การปรับตัว & ทั่วไป</button>
        <button 
          className={`btn ${filter === 'finance' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('finance')}
        >การเงิน</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '2rem' }}>
        {filteredArticles.map(article => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            onClick={(id) => router.push(`/resources/${id}`)}
          />
        ))}
      </div>
    </div>
  );
}
