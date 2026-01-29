'use client';

import { createContext, useContext, useState } from 'react';

// Role definitions
export const ROLES = {
  ADMIN: 'admin',
  DISPATCHER: 'dispatcher',
  MONITOR: 'monitor',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.DISPATCHER]: 'Dispatcher',
  [ROLES.MONITOR]: 'Operations Monitor',
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    canViewAll: true,
    canOverride: true,
    canManageConfig: true,
    canViewFinancials: true,
    canAudit: true,
    canUploadOrders: true,
    canManageVehicles: true,
  },
  [ROLES.DISPATCHER]: {
    canViewAll: true,
    canOverride: true,
    canManageConfig: false,
    canViewFinancials: false,
    canAudit: false,
    canUploadOrders: true,
    canManageVehicles: false,
  },
  [ROLES.MONITOR]: {
    canViewAll: true,
    canOverride: false,
    canManageConfig: false,
    canViewFinancials: false,
    canAudit: false,
    canUploadOrders: false,
    canManageVehicles: false,
  },
};

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [currentRole, setCurrentRole] = useState(ROLES.ADMIN);

  const permissions = ROLE_PERMISSIONS[currentRole];

  const hasPermission = (permission) => {
    return permissions[permission] === true;
  };

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        permissions,
        hasPermission,
        roleLabel: ROLE_LABELS[currentRole],
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
}
