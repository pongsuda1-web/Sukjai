"use client";
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../MapComponent'), { ssr: false });

export default function MapView({ patients, clinics, privacyShieldActive, isActive }) {
  if (!isActive) return null;

  return (
    <section className="dashboard-view active" style={{ height: '100%' }}>
      <div className="view-header" style={{ marginBottom: '1rem' }}>
        <div className="view-title">
          <h2>แผนที่ติดตามผู้ป่วยและสถานพยาบาลใกล้เคียง</h2>
          <p>แสดงพิกัดที่ตั้งระดับหมู่บ้าน/ตำบล (เปิดใช้งาน Privacy Shield เพื่อเยื้องพิกัดคุ้มครองความปลอดภัย)</p>
        </div>
      </div>
      <div className="map-wrapper" style={{ height: 'calc(100% - 80px)', borderRadius: '8px', overflow: 'hidden' }}>
        <MapComponent patients={patients} clinics={clinics} privacyShieldActive={privacyShieldActive} />
      </div>
    </section>
  );
}
