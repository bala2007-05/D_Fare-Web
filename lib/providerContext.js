'use client';

import { createContext, useContext, useState } from 'react';

// Multi-tenant provider system - Dynamic organization registration
// Organizations are registered dynamically via onboarding, not predefined

// Driver Types
export const DRIVER_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
};

export const DRIVER_TYPE_LABELS = {
  [DRIVER_TYPES.FULL_TIME]: 'Full-Time (Automated)',
  [DRIVER_TYPES.PART_TIME]: 'Part-Time (Manual)',
};

const ProviderContext = createContext();

export function ProviderProvider({ children }) {
  const [currentProvider, setCurrentProvider] = useState(null);
  const [selectedHub, setSelectedHub] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Mock provider data - in real app, this comes from API based on org ID
  const providerData = currentProvider ? {
    id: currentProvider.id || currentProvider,
    name: currentProvider.name || currentProvider,
    type: currentProvider.type || 'Logistics',
    registrationNumber: currentProvider.registrationNumber,
    hubs: currentProvider.hubs || [
      { id: 'HUB-001', name: 'Main Hub', serviceAreas: ['Downtown', 'Suburbs'] },
      { id: 'HUB-002', name: 'Secondary Hub', serviceAreas: ['East District', 'West District'] },
    ],
  } : null;

  const login = (email, password) => {
    // Mock authentication - in real app, call API to check if org exists
    // If organization exists, load their data
    // If first-time user, trigger onboarding
    setIsAuthenticated(true);
    setUser({ email, role: 'admin', name: 'Admin User' });
    
    // Check if organization needs onboarding
    const hasCompletedOnboarding = false; // In real app, check from API
    if (!hasCompletedOnboarding) {
      setNeedsOnboarding(true);
    } else {
      // Load existing organization data
      setCurrentProvider({
        id: 'org-demo-123',
        name: 'Demo Organization',
        type: 'Logistics',
      });
      if (providerData?.hubs?.[0]) {
        setSelectedHub(providerData.hubs[0].id);
      }
    }
  };

  const completeOnboarding = (orgData) => {
    // In real app, send orgData to API to create organization
    setCurrentProvider({
      id: `org-${Date.now()}`,
      ...orgData,
    });
    setNeedsOnboarding(false);
    if (orgData.hubs?.[0]) {
      setSelectedHub(orgData.hubs[0].id);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentProvider(null);
    setSelectedHub(null);
    setUser(null);
  };

  const switchHub = (hubId) => {
    setSelectedHub(hubId);
  };

  return (
    <ProviderContext.Provider
      value={{
        currentProvider,
        setCurrentProvider,
        selectedHub,
        switchHub,
        isAuthenticated,
        user,
        login,
        logout,
        providerData,
        needsOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
}

export function useProvider() {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider must be used within ProviderProvider');
  }
  return context;
}
