import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
export function generateDriverId(existingDrivers = []) {
  const nums = existingDrivers
    .map((d) => {
      const id = d.driverId || d.driver_id || '';
      const m = id.match(/DRV-(\d+)/i);
      return m ? parseInt(m[1], 10) : 0;
    })
    .filter((n) => n > 0);
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `DRV-${String(next).padStart(3, '0')}`;
}
function driverToRow(driver, options = {}) {
  return {
    organization_id: options.organizationId ?? null,
    auth_user_id: driver.authUserId ?? driver.auth_user_id ?? null,
    driver_id: driver.driverId ?? driver.driver_id,
    name: driver.name ?? '',
    home_address: driver.homeAddress ?? driver.home_address ?? null,
    license_number: driver.licenseNumber ?? driver.license_number ?? null,
    license_expiry: driver.licenseExpiry ?? driver.license_expiry ?? null,
    employment_type: driver.employmentType ?? driver.employment_type ?? null,
    shift: driver.shift ?? driver.shiftTiming ?? null,
    assigned_hub: driver.assignedHub ?? driver.hubId ?? null,
    vehicle_type: driver.vehicleType ?? driver.vehicle_type ?? null,
    status: driver.status ?? 'idle',
    photo_url: driver.photoUrl ?? driver.photo_url ?? null,
    cod_limit: driver.codLimit ?? driver.cod_limit ?? 500,
    phone: driver.phone ?? null,
    email: driver.email ?? null,
    updated_at: new Date().toISOString(),
  };
}
export async function saveDriverToBackend(driver, options = {}) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: new Error('Supabase is not configured') };
  }
  if (!driver || !(driver.driverId || driver.driver_id)) {
    return { data: null, error: new Error('Driver must have a driverId') };
  }
  const row = driverToRow(driver, options);
  const { data, error } = await supabase
    .from('drivers')
    .insert(row)
    .select('id, driver_id')
    .single();
  if (error) return { data: null, error };
  return { data, error: null };
}