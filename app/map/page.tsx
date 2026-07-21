'use client';
import { useState, useMemo, useEffect } from 'react';
import { MapPin, Phone, Building2, Stethoscope, HeartPulse } from 'lucide-react';
import dynamic from 'next/dynamic';

const HospitalMap = dynamic(() => import('@/components/views/HospitalMap'), { 
  ssr: false,
  loading: () => <div style={{ height: '500px', background: '#f1f5f9', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>กำลังโหลดแผนที่...</div>
});

interface Hospital {
  id: string;
  name: string;
  province: string;
  region: string;
  type: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
}

const regionLabels = {
  central: 'ภาคกลาง และกรุงเทพมหานคร',
  north: 'ภาคเหนือ',
  northeast: 'ภาคตะวันออกเฉียงเหนือ',
  south: 'ภาคใต้'
};

const typeLabels = {
  provincial: { label: 'โรงพยาบาลศูนย์ / โรงพยาบาลทั่วไป (รพ.จังหวัด)', icon: Building2 },
  community: { label: 'โรงพยาบาลชุมชน (รพช.)', icon: MapPin },
  private: { label: 'คลินิกจิตเวชเฉพาะทาง / โรงพยาบาลเอกชน', icon: Stethoscope },
  wellness: { label: 'ศูนย์สุขภาพจิตและสุขภาวะ', icon: HeartPulse }
};

export default function MapPage() {
  const [allHospitals, setAllHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('north');
  const [selectedProvince, setSelectedProvince] = useState<string>('น่าน');

  useEffect(() => {
    fetch('/api/hospitals')
      .then(res => res.json())
      .then(data => {
        setAllHospitals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load hospitals:', err);
        setLoading(false);
      });
  }, []);

  // When region changes, reset province to the first available in that region
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    const provincesInRegion = [...new Set(allHospitals.filter(h => h.region === region).map(h => h.province))].sort();
    if (provincesInRegion.length > 0) {
      if (provincesInRegion.includes('น่าน')) {
        setSelectedProvince('น่าน');
      } else {
        setSelectedProvince(provincesInRegion[0]);
      }
    } else {
      setSelectedProvince('');
    }
  };

  const availableProvinces = useMemo(() => {
    return [...new Set(allHospitals.filter(h => h.region === selectedRegion).map(h => h.province))].sort();
  }, [selectedRegion, allHospitals]);

  const filteredHospitals = useMemo(() => {
    return allHospitals.filter(h => h.region === selectedRegion && h.province === selectedProvince);
  }, [selectedRegion, selectedProvince, allHospitals]);

  // Group by type
  const groupedByType = filteredHospitals.reduce((acc, h) => {
    if (!acc[h.type]) acc[h.type] = [];
    acc[h.type].push(h);
    return acc;
  }, {} as Record<string, Hospital[]>);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '80vh' }}>
      <h1 className="section-title">สถานพยาบาลและคลินิกจิตเวช</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }} className="text-muted">
        ค้นหาสถานพยาบาลใกล้คุณ แยกตามจังหวัดและประเภท
      </p>

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p className="text-muted">กำลังโหลดข้อมูลสถานพยาบาลทั่วประเทศ...</p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>เลือกภาค</label>
            <select 
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="form-control"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '1rem', border: '1px solid var(--color-primary-light)' }}
            >
              {Object.entries(regionLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>เลือกจังหวัด</label>
            <select 
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="form-control"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '1rem', border: '1px solid var(--color-primary-light)' }}
              disabled={availableProvinces.length === 0}
            >
              {availableProvinces.length === 0 && <option value="">ไม่มีข้อมูลจังหวัดในภาคนี้</option>}
              {availableProvinces.map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div style={{ marginBottom: '3rem' }}>
        <HospitalMap hospitals={filteredHospitals} />
      </div>

      {/* Results */}
      {availableProvinces.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '1rem' }}>
          <p className="text-muted">ยังไม่มีข้อมูลสถานพยาบาลในภาคนี้</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {(['provincial', 'community', 'private', 'wellness'] as const).map(typeKey => {
            const list = groupedByType[typeKey];
            if (!list || list.length === 0) return null;
            
            const typeInfo = typeLabels[typeKey];
            const Icon = typeInfo.icon;
            
            return (
              <div key={typeKey}>
                <h3 style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-primary-dark)',
                  borderBottom: '2px solid var(--color-primary-light)', paddingBottom: '0.5rem'
                }}>
                  <Icon size={24} /> {typeInfo.label}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.5rem' }}>
                  {list.map(hospital => (
                    <div key={hospital.id} className="glass-panel hover-lift" style={{ display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        {hospital.name}
                      </h4>
                      <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem', flexGrow: 1 }}>
                        <MapPin size={16} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'text-bottom' }} />
                        {hospital.address}
                      </p>
                      <div>
                        <a href={`tel:${hospital.phone}`} className="btn btn-primary" style={{ display: 'inline-flex', width: '100%', justifyContent: 'center', padding: '0.5rem', fontSize: '0.95rem' }}>
                          <Phone size={16} /> โทร {hospital.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      )}
    </div>
  );
}
