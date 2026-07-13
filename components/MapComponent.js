"use client";
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon paths in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icon for hospitals
const hospitalIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapComponent({ patients, clinics, privacyShieldActive }) {
  // พิกัดเริ่มต้น: จังหวัดน่าน
  const defaultCenter = [18.783, 100.783];

  const getMarkerColor = (risk) => {
    switch (risk) {
      case 'red': return '#ff5252';
      case 'yellow': return '#ff9800';
      case 'green': return '#4caf50';
      default: return '#333333';
    }
  };

  return (
    <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Render Clinics */}
      {clinics.map((clinic, idx) => {
        const isHospital = clinic.type === 'hospital' || !clinic.type;
        const iconColor = isHospital ? '#0277bd' : '#00897b'; // Blue for Hospital, Teal for PCU
        const iconText = isHospital ? 'H' : '✚';
        
        const customIcon = L.divIcon({
          html: `<div style="background-color: ${iconColor}; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-weight: bold; font-size: 12px;">${iconText}</div>`,
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        // Calculate Stats for this clinic
        const clinicPatients = patients.filter(p => p.hospital_id === clinic.id || p.pcu_id === clinic.id || p.hospital === clinic.name || p.pcu === clinic.name);
        const totalCount = clinicPatients.length;
        const smiVCount = clinicPatients.filter(p => p.smiV && p.smiV.trim() !== '').length;
        const missedCount = clinicPatients.filter(p => p.missedAppointments > 0).length;

        // Breakdown by area (Amphoe for Hospitals, Tambon for PCUs)
        const areaCounts = {};
        clinicPatients.forEach(p => {
          if (isHospital) {
            const match = p.village?.match(/อ\.([ก-๙a-zA-Z]+)/);
            const area = match ? `อ.${match[1]}` : 'ไม่ระบุอำเภอ';
            areaCounts[area] = (areaCounts[area] || 0) + 1;
          } else {
            const match = p.village?.match(/ต\.([ก-๙a-zA-Z]+)/);
            const area = match ? `ต.${match[1]}` : 'ไม่ระบุตำบล';
            areaCounts[area] = (areaCounts[area] || 0) + 1;
          }
        });

        return (
          <Marker key={`clinic-${idx}`} position={[clinic.lat, clinic.lng]} icon={customIcon}>
            <Popup>
              <strong>{clinic.name}</strong><br />
              <span style={{color: '#666', fontSize: '0.85em'}}>{isHospital ? 'โรงพยาบาล' : 'รพ.สต.'}</span>
              <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #eee' }} />
              <div style={{ fontSize: '0.9em', lineHeight: '1.4' }}>
                ผู้ป่วยในความดูแล: <strong>{totalCount}</strong> คน<br />
                เคส SMI-V: <strong>{smiVCount}</strong> คน<br />
                ขาดนัด/ขาดยา: <strong style={{ color: missedCount > 0 ? '#d32f2f' : 'inherit' }}>{missedCount}</strong> คน
              </div>
              
              {totalCount > 0 && (
                <>
                  <div style={{ marginTop: '8px', marginBottom: '4px', fontSize: '0.85em', fontWeight: 'bold', color: '#0277bd' }}>
                    {isHospital ? 'แยกตามอำเภอ:' : 'แยกตามตำบล:'}
                  </div>
                  <div style={{ fontSize: '0.85em', lineHeight: '1.4', background: '#f5f5f5', padding: '6px', borderRadius: '4px' }}>
                    {Object.entries(areaCounts)
                      .sort((a, b) => b[1] - a[1]) // Sort by count descending
                      .map(([area, count]) => (
                        <div key={area} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{area}</span>
                          <strong>{count} คน</strong>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </Popup>
          </Marker>
        );
      })}

      {/* Render Patients */}
      {patients.map(p => {
        // Apply privacy shield jitter
        const jitter = privacyShieldActive ? (Math.random() - 0.5) * 0.01 : 0;
        const lat = p.lat + jitter;
        const lng = p.lng + jitter;

        return (
          <CircleMarker
            key={p.id}
            center={[lat, lng]}
            radius={8}
            pathOptions={{
              fillColor: getMarkerColor(p.risk),
              color: '#fff',
              weight: 2,
              fillOpacity: 0.9
            }}
          >
            <Popup>
              <strong>{privacyShieldActive ? "ผู้ป่วย (ปกปิดชื่อ)" : p.name}</strong><br />
              รหัส: {p.hn}<br />
              หมู่บ้าน: {p.village}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
