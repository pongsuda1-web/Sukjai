import { Hotline } from '../data/mockData';
import { PhoneCall, ShieldAlert, Heart, Building2 } from 'lucide-react';
import './Cards.css';

export default function HotlineCard({ hotline }: { hotline: Hotline }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'mental': return <Heart size={24} className="icon-mental" />;
      case 'violence': return <ShieldAlert size={24} className="icon-violence" />;
      case 'finance': return <Building2 size={24} className="icon-finance" />;
      default: return <PhoneCall size={24} className="icon-general" />;
    }
  };

  return (
    <div className="card glass-panel hover-lift hotline-card">
      <div className="hotline-header">
        <div className="hotline-icon-wrapper">{getIcon(hotline.iconType)}</div>
        <h3 className="card-title">{hotline.name}</h3>
      </div>
      <p className="card-summary">{hotline.description}</p>
      <a href={`tel:${hotline.number}`} className="btn btn-primary hotline-btn">
        <PhoneCall size={18} />
        โทร {hotline.number}
      </a>
    </div>
  );
}
