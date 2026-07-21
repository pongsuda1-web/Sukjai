import { Article } from '../data/mockData';
import { BookOpen } from 'lucide-react';
import './Cards.css';

interface ArticleCardProps {
  article: Article;
  onClick: (id: string) => void;
}

export default function ArticleCard({ article, onClick }: ArticleCardProps) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'psychiatric': return 'cat-psychiatric';
      case 'family': return 'cat-family';
      case 'finance': return 'cat-finance';
      default: return 'cat-general';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'psychiatric': return 'โรคจิตเวช';
      case 'family': return 'ครอบครัว & ความสัมพันธ์';
      case 'finance': return 'ปัญหาการเงิน';
      default: return 'ทั่วไป';
    }
  };

  return (
    <div className="card glass-panel hover-lift article-card" onClick={() => onClick(article.id)}>
      <div className={`card-badge ${getCategoryColor(article.category)}`}>
        {getCategoryLabel(article.category)}
      </div>
      <h3 className="card-title">{article.title}</h3>
      <p className="card-summary">{article.summary}</p>
      <div className="card-footer">
        <span className="read-more">อ่านเพิ่มเติม <BookOpen size={16} /></span>
      </div>
    </div>
  );
}
