export type ServiceType = 'ecommerce' | 'logistics' | 'grocery' | 'courier';
export type BillingPlan = 'startup' | 'enterprise' | 'pay_per_driver';
export interface AdminContact {
  name: string;
  email: string;
  phone?: string;
}
export interface Hub {
  id: string;
  name: string;
  address: string;
  serviceRadiusKm?: number;
  operatingWindowStart?: string;
  operatingWindowEnd?: string;
}
export type VehicleKind =
  | '2_wheeler'
  | '3_wheeler'
  | 'van'
  | 'truck_4ft';
export interface VehicleCapacityConfig {
  vehicleType: VehicleKind;
  maxWeightKg: number;
  maxVolumeCubicFt: number;
  costPerKm: number;
}
export interface FleetConfigForHub {
  hubId: string;
  totalActiveDrivers: number;
  vehicleConfigs: VehicleCapacityConfig[];
}
export type PaymentStatus = 'paid' | 'cod' | 'pending';
export interface FailureProtocol {
  reattemptCount: 1 | 2;
  returnToOriginOnFailure: boolean;
  finalStatusOnFailure: 'failed' | 'returned_to_hub';
}
export interface DeliveryRules {
  codLimitPerDriver: number;
  defaultPaymentStatus: PaymentStatus;
  failureProtocol: FailureProtocol;
}
export interface OrganizationTenant {
  id: string;
  legalBusinessName: string;
  serviceType: ServiceType;
  admin: AdminContact;
  billingPlan: BillingPlan;
  hubs: Hub[];
  fleets: FleetConfigForHub[];
  deliveryRules: DeliveryRules;
}
export type EmploymentType = 'full_time' | 'gig';
export type ShiftType = 'shift_a' | 'shift_b';
export interface Driver {
  id: string;
  tenantId: string;
  fullName: string;
  photoUrl?: string;
  homeAddress: string;
  licenseNumber: string;
  licenseDocumentUrl?: string; // uploaded proof
  employmentType: EmploymentType;
  shift: ShiftType;
  assignedHubId: string;
  vehicleType: VehicleKind;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}