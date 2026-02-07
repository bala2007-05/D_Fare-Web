'use client';
import { useEffect, useRef, useState } from 'react';
const COIMBATORE = [76.9558, 11.0168];
const OSM_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};
function createMarkerEl(driver, isSelected) {
  const el = document.createElement('div');
  el.className = 'driver-marker';
  el.setAttribute('data-driver-id', driver.id);
  const isOnline = driver.active === true;
  const size = isSelected ? 20 : 14;
  el.style.cssText = `
    width: ${size}px; height: ${size}px; border-radius: 50%;
    background: ${isSelected ? '#1F4FD8' : isOnline ? '#16a34a' : '#94a3b8'};
    border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    cursor: pointer; transition: transform 0.15s ease;
  `;
  el.title = `${driver.name}${isOnline ? ' (Online)' : ''}`;
  el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.15)'; });
  el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });
  return el;
}
export default function DriverMapPanel({
  drivers = [],
  selectedDriverId,
  onSelectDriver,
  onLocationDenied,
  driversOnlineOnly = false,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const maplibreRef = useRef(null);
  const markersRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);
  const driversToShow = driversOnlineOnly
    ? drivers.filter((d) => d.active === true)
    : drivers;
  const driversWithCoords = driversToShow.filter((d) => d.lat != null && d.lng != null);
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;
    let cancelled = false;
    Promise.all([
      import('maplibre-gl/dist/maplibre-gl.css'),
      import('maplibre-gl'),
    ]).then(([, maplibreModule]) => {
      if (cancelled || !containerRef.current) return;
      const maplibre = maplibreModule.default;
      maplibreRef.current = maplibre;
      const mapInstance = new maplibre.Map({
        container: containerRef.current,
        style: OSM_STYLE,
        center: COIMBATORE,
        zoom: 11,
      });
      mapInstance.addControl(new maplibre.NavigationControl(), 'top-right');
      mapRef.current = mapInstance;
      mapInstance.on('load', () => {
        if (!cancelled) setMapReady(true);
      });
      if (navigator.geolocation && typeof onLocationDenied === 'function') {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (!cancelled && mapRef.current) {
              mapRef.current.setCenter([pos.coords.longitude, pos.coords.latitude]);
              mapRef.current.setZoom(13);
            }
          },
          () => onLocationDenied()
        );
      }
    });
    return () => {
      cancelled = true;
      markersRef.current = [];
      maplibreRef.current = null;
      if (mapRef.current) {
        try { mapRef.current.remove(); } catch (_) {}
        mapRef.current = null;
      }
      setMapReady(false);
    };
  }, [onLocationDenied]);
  useEffect(() => {
    if (!mapReady || !mapRef.current || !maplibreRef.current) return;
    const map = mapRef.current;
    const maplibre = maplibreRef.current;
    markersRef.current.forEach((m) => {
      try { m.remove(); } catch (_) {}
    });
    markersRef.current = [];
    driversWithCoords.forEach((driver) => {
      const isSelected = selectedDriverId === driver.id;
      const el = createMarkerEl(driver, isSelected);
      const marker = new maplibre.Marker({ element: el })
        .setLngLat([driver.lng, driver.lat])
        .addTo(map);
      el.addEventListener('click', () => {
        if (typeof onSelectDriver === 'function') onSelectDriver(driver);
      });
      const popup = new maplibre.Popup({ offset: 15, closeButton: false })
        .setHTML(
          `<div style="padding:4px 0;min-width:120px;">
            <strong style="color:#0f172a">${driver.name}</strong>
            ${driver.active ? '<span style="color:#16a34a;font-size:11px;margin-left:6px">● Online</span>' : ''}
            <div style="font-size:11px;color:#64748b;margin-top:2px">${driver.routeName}</div>
          </div>`
        );
      marker.setPopup(popup);
      markersRef.current.push(marker);
    });
    if (driversWithCoords.length > 1) {
      const lngs = driversWithCoords.map((d) => d.lng);
      const lats = driversWithCoords.map((d) => d.lat);
      const bounds = [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ];
      try {
        map.fitBounds(bounds, { padding: 50, maxZoom: 14, duration: 500 });
      } catch (_) {}
    }
  }, [mapReady, driversWithCoords, selectedDriverId, onSelectDriver]);
  useEffect(() => {
    if (!mapRef.current || !selectedDriverId) return;
    const driver = driversWithCoords.find((d) => d.id === selectedDriverId);
    if (!driver) return;
    try {
      mapRef.current.flyTo({ center: [driver.lng, driver.lat], zoom: 15, duration: 800 });
    } catch (_) {}
  }, [selectedDriverId, driversWithCoords]);
  return (
    <div className="relative w-full h-full" style={{ minHeight: 300 }}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}