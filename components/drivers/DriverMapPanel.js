'use client';

import { useEffect, useState } from 'react';

export default function DriverMapPanel({ drivers, selectedDriver }) {
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

    const mapInstance = L.map('logistics-map', {
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

    // Define color palette for drivers
    const driverColors = [
      '#2563eb', // Blue
      '#ef4444', // Red
      '#10b981', // Green
      '#f59e0b', // Amber
      '#8b5cf6', // Purple
      '#ec4899', // Pink
      '#14b8a6', // Teal
      '#f97316', // Orange
      '#06b6d4', // Cyan
      '#84cc16', // Lime
    ];

    // Create location pin icon
    const createDriverIcon = (color, isSelected) => {
      const size = isSelected ? 28 : 20;
      const borderWidth = isSelected ? 3 : 2;
      
      return L.divIcon({
        className: 'custom-pin-marker',
        html: `
          <div style="
            background: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: ${borderWidth}px solid white;
            box-shadow: 0 ${isSelected ? '4px 10px' : '2px 6px'} rgba(0,0,0,${isSelected ? '0.4' : '0.3'});
            position: relative;
            transition: all 0.3s ease;
            ${isSelected ? 'animation: pinPulse 1.5s infinite;' : ''}
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(45deg);
              width: ${size * 0.35}px;
              height: ${size * 0.35}px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size]
      });
    };

    // Add markers for all drivers
    const newMarkers = drivers.map((driver, index) => {
      const isSelected = selectedDriver?.driverId === driver.driverId;
      const color = driverColors[index % driverColors.length];
      
      const marker = L.marker(
        [driver.liveLocation.lat, driver.liveLocation.lng],
        { icon: createDriverIcon(color, isSelected) }
      ).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 220px;">
          <div style="font-weight: bold; font-size: 15px; color: #1e293b; margin-bottom: 6px;">
            ${driver.name}
          </div>
          <div style="font-size: 11px; color: #64748b; font-family: monospace; margin-bottom: 10px;">
            ${driver.driverId}
          </div>
          <div style="display: inline-block; padding: 5px 10px; background: ${
            driver.status === 'busy' ? '#dbeafe' : 
            driver.status === 'idle' ? '#dcfce7' : 
            '#f1f5f9'
          }; color: ${
            driver.status === 'busy' ? '#1e40af' : 
            driver.status === 'idle' ? '#166534' : 
            '#475569'
          }; border-radius: 8px; font-size: 11px; font-weight: 600; text-transform: uppercase;">
            ${driver.status.replace(/_/g, ' ')}
          </div>
          <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e2e8f0;">
            <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">
              <strong>Location:</strong> ${driver.liveLocation.lat.toFixed(4)}, ${driver.liveLocation.lng.toFixed(4)}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">
              <strong>Vehicle:</strong> ${driver.vehicleId}
            </div>
            <div style="font-size: 11px; color: #64748b;">
              <strong>Tasks:</strong> ${driver.tasksToday} today
            </div>
          </div>
        </div>
      `, {
        maxWidth: 250,
        closeButton: true
      });

      // Auto-open popup for selected driver
      if (isSelected) {
        marker.openPopup();
      }

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
    } else {
      // Fit all markers in view
      if (newMarkers.length > 0) {
        const group = L.featureGroup(newMarkers);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [map, L, drivers, selectedDriver]);

  return (
    <>
      <div 
        id="logistics-map" 
        style={{ 
          width: '100%',
          height: '100%',
          borderRadius: '0',
          zIndex: 1
        }}
      />
      <style jsx global>{`
        .custom-pin-marker {
          background: none !important;
          border: none !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 14px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.25);
        }
        
        .leaflet-popup-content {
          margin: 14px 18px;
          line-height: 1.6;
        }
        
        .leaflet-popup-tip {
          box-shadow: 0 3px 10px rgba(0,0,0,0.15);
        }
        
        @keyframes pinPulse {
          0%, 100% {
            transform: rotate(-45deg) scale(1);
          }
          50% {
            transform: rotate(-45deg) scale(1.15);
          }
        }

        #logistics-map {
          background: #f8fafc;
        }
      `}</style>
    </>
  );
}
