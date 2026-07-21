'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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

// Component to recenter map when bounds change
function MapRecenter({ hospitals }: { hospitals: Hospital[] }) {
  const map = useMap();
  useEffect(() => {
    if (hospitals.length > 0) {
      const lats = hospitals.map(h => h.lat).filter(l => !isNaN(l));
      const lngs = hospitals.map(h => h.lng).filter(l => !isNaN(l));
      if (lats.length > 0 && lngs.length > 0) {
        const bounds = L.latLngBounds(
          L.latLng(Math.min(...lats), Math.min(...lngs)),
          L.latLng(Math.max(...lats), Math.max(...lngs))
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [hospitals, map]);
  return null;
}

export default function HospitalMap({ hospitals }: { hospitals: Hospital[] }) {
  return (
    <div style={{ height: '500px', width: '100%', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--color-primary-light)' }}>
      <MapContainer 
        center={[13.7563, 100.5018]} // Default to Bangkok
        zoom={6} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter hospitals={hospitals} />
        {hospitals.map(hospital => {
          if (!hospital.lat || !hospital.lng) return null;
          return (
            <Marker key={hospital.id} position={[hospital.lat, hospital.lng]}>
              <Popup>
                <div style={{ padding: '0.5rem', minWidth: '200px' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-primary-dark)' }}>{hospital.name}</h4>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{hospital.address}</p>
                  <a 
                    href={`tel:${hospital.phone}`} 
                    className="btn btn-primary" 
                    style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '0.4rem' }}
                  >
                    โทร {hospital.phone}
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
