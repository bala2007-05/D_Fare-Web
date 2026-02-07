'use client';
import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
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
  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setUser({ email: session.user.email, id: session.user.id, role: 'admin', name: session.user.email });
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setCurrentProvider(null);
        setSelectedHub(null);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setUser({ email: session.user.email, id: session.user.id, role: 'admin', name: session.user.email });
      }
    });
    return () => subscription?.unsubscribe();
  }, []);
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
    setIsAuthenticated(true);
    setUser({ email, role: 'admin', name: 'Admin User' });
    const hasCompletedOnboarding = false; // In real app, check from API
    if (!hasCompletedOnboarding) {
      setNeedsOnboarding(true);
    } else {
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
  const value = useMemo(
    () => ({
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
    }),
    [currentProvider, selectedHub, isAuthenticated, user, providerData, needsOnboarding]
  );
  return (
    <ProviderContext.Provider value={value}>
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