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
  // Center of Map (Takhian Tia roughly)
  const defaultCenter = [13.02, 100.95];

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
      {clinics.map((clinic, idx) => (
        <Marker key={`clinic-${idx}`} position={[clinic.lat, clinic.lng]} icon={hospitalIcon}>
          <Popup>
            <strong>{clinic.name}</strong><br />สถานพยาบาลชุมชน
          </Popup>
        </Marker>
      ))}

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
