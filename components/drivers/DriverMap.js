'use client';

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

export default function DriverMap({ drivers, selectedDriver }) {
  const [map, setMap] = useState(null);
  const [L, setL] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Dynamically import Leaflet (client-side only)
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        const leaflet = await import('leaflet');
        await import('leaflet/dist/leaflet.css');
        
        // Fix default marker icon issue
        delete leaflet.Icon.Default.prototype._getIconUrl;
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        
        setL(leaflet);
      }
    };
    
    loadLeaflet();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!L || map) return;

    const mapInstance = L.map('driver-map', {
      center: [40.7505, -73.9934], // New York City center
      zoom: 12,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, [L]);

  // Add/update markers
  useEffect(() => {
    if (!map || !L || !drivers) return;

    // Clear existing markers
    markers.forEach(marker => marker.remove());

    // Create custom icon for drivers
    const createDriverIcon = (isSelected) => {
      return L.divIcon({
        className: 'custom-driver-marker',
        html: `
          <div style="
            width: ${isSelected ? '48px' : '36px'};
            height: ${isSelected ? '48px' : '36px'};
            background: ${isSelected ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'};
            border-radius: 50%;
            border: ${isSelected ? '4px' : '3px'} solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            animation: ${isSelected ? 'pulse 2s infinite' : 'none'};
          ">
            <svg width="${isSelected ? '24' : '18'}" height="${isSelected ? '24' : '18'}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `,
        iconSize: [isSelected ? 48 : 36, isSelected ? 48 : 36],
        iconAnchor: [isSelected ? 24 : 18, isSelected ? 48 : 36],
      });
    };

    // Add markers for all drivers
    const newMarkers = drivers.map((driver) => {
      const isSelected = selectedDriver?.driverId === driver.driverId;
      const marker = L.marker(
        [driver.liveLocation.lat, driver.liveLocation.lng],
        { icon: createDriverIcon(isSelected) }
      ).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 200px;">
          <div style="font-weight: bold; font-size: 14px; color: #1e293b; margin-bottom: 4px;">
            ${driver.name}
          </div>
          <div style="font-size: 11px; color: #64748b; font-family: monospace; margin-bottom: 8px;">
            ${driver.driverId}
          </div>
          <div style="display: inline-block; padding: 4px 8px; background: ${
            driver.status === 'busy' ? '#dbeafe' : 
            driver.status === 'idle' ? '#dcfce7' : 
            '#f1f5f9'
          }; color: ${
            driver.status === 'busy' ? '#1e40af' : 
            driver.status === 'idle' ? '#166534' : 
            '#475569'
          }; border-radius: 6px; font-size: 11px; font-weight: 600;">
            ${driver.status.replace(/_/g, ' ').toUpperCase()}
          </div>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
            <div style="font-size: 11px; color: #64748b; margin-bottom: 2px;">
              📍 ${driver.liveLocation.lat.toFixed(4)}, ${driver.liveLocation.lng.toFixed(4)}
            </div>
            <div style="font-size: 11px; color: #64748b;">
              🚗 ${driver.vehicleId}
            </div>
          </div>
        </div>
      `);

      return marker;
    });

    setMarkers(newMarkers);

    // If a driver is selected, zoom to their location
    if (selectedDriver) {
      map.flyTo(
        [selectedDriver.liveLocation.lat, selectedDriver.liveLocation.lng],
        15,
        {
          duration: 1.5,
          easeLinearity: 0.5
        }
      );
    }
  }, [map, L, drivers, selectedDriver]);

  return (
    <>
      <div 
        id="driver-map" 
        className="w-full h-[500px] rounded-xl shadow-lg border border-slate-200"
        style={{ 
          minHeight: '500px',
          zIndex: 1
        }}
      />
      <style jsx global>{`
        .custom-driver-marker {
          background: none !important;
          border: none !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        .leaflet-popup-content {
          margin: 12px 16px;
          line-height: 1.5;
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  );
}
