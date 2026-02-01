'use client';

import { useState } from 'react';
import DriverListPanel from './DriverListPanel';
import FloatingDriverDetailPanel from './FloatingDriverDetailPanel';
import DriverMapPanel from './DriverMapPanel';
import { driversEnhanced } from '@/lib/enterpriseMockData';

export default function DriverMonitoring() {
  const [selectedDriver, setSelectedDriver] = useState(null);

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
  };

  const handleClosePanel = () => {
    setSelectedDriver(null);
  };

  return (
    <div 
      className="dashboard-container"
      style={{
        display: 'flex',
        height: 'calc(100vh - 120px)',
        background: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        border: '1px solid #e5e7eb'
      }}
    >
      {/* Left Panel - Driver List (30%) */}
      <DriverListPanel 
        onDriverSelect={handleDriverSelect}
        selectedDriver={selectedDriver}
      />

      {/* Right Panel - Map (70%) */}
      <div 
        className="map-panel"
        style={{
          width: '70%',
          position: 'relative',
          background: '#f8fafc'
        }}
      >
        <DriverMapPanel 
          drivers={driversEnhanced}
          selectedDriver={selectedDriver}
        />
        
        {/* Floating Detail Panel (Over Map) */}
        {selectedDriver && (
          <FloatingDriverDetailPanel 
            driver={selectedDriver}
            onClose={handleClosePanel}
          />
        )}
      </div>
    </div>
  );
}
