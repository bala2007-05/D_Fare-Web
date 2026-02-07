import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
function orderToRow(order, options = {}) {
  const loc = order.geolocation || order;
  const lat = loc.lat ?? loc.latitude;
  const lng = loc.lng ?? loc.longitude;
  return {
    organization_id: options.organizationId || null,
    order_id: order.orderId,
    customer_name: order.customerName ?? null,
    customer_phone: order.customerPhone ?? null,
    delivery_address: order.deliveryAddress ?? order.delivery_address ?? order.customer_address ?? order.address ?? null,
    latitude: typeof lat === 'number' ? lat : null,
    longitude: typeof lng === 'number' ? lng : null,
    status: order.status ?? 'pending',
    time_window_start: order.timeWindowStart ?? null,
    time_window_end: order.timeWindowEnd ?? null,
    package_weight: order.packageWeight ?? 0,
    volumetric_weight: order.volumetricWeight ?? 0,
    service_type: order.serviceType ?? 'standard',
    skill_requirement: order.skillRequirement ?? null,
    cod_amount: order.codAmount ?? 0,
    delivery_cost: order.deliveryCost ?? 0,
    driver_payout: order.driverPayout ?? 0,
    hub_id: order.hubId ?? null,
    assigned_driver: order.assignedDriver ?? null,
    assigned_route: order.assignedRoute ?? null,
    priority: order.priority ?? 'normal',
    attempts: order.attempts ?? 0,
    updated_at: new Date().toISOString(),
  };
}
export async function saveOrdersToBackend(orders, options = {}) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: new Error('Supabase is not configured') };
  }
  if (!Array.isArray(orders) || orders.length === 0) {
    return { data: null, error: null };
  }
  const rows = orders.map((order) => orderToRow(order, options));
  const { data, error } = await supabase
    .from('orders')
    .upsert(rows, {
      onConflict: 'order_id',
      ignoreDuplicates: false,
    })
    .select('id, order_id');
  if (error) return { data: null, error };
  return { data, error: null };
}
export async function updateOrderInBackend(orderId, updates) {
  if (!isSupabaseConfigured() || !supabase || !orderId) {
    return { data: null, error: null };
  }
  const row = {};
  if (updates.assignedDriver !== undefined) row.assigned_driver = updates.assignedDriver;
  if (updates.assignedRoute !== undefined) row.assigned_route = updates.assignedRoute;
  if (updates.status !== undefined) row.status = updates.status;
  if (updates.deliveryAddress !== undefined) row.delivery_address = updates.deliveryAddress;
  row.updated_at = new Date().toISOString();
  if (Object.keys(row).length <= 1) return { data: null, error: null };
  const { data, error } = await supabase
    .from('orders')
    .update(row)
    .eq('order_id', orderId)
    .select('id, order_id')
    .maybeSingle();
  if (error) return { data: null, error };
  return { data, error: null };
}
function rowToOrder(row) {
  if (!row) return null;
  return {
    orderId: row.order_id,
    customerName: row.customer_name ?? null,
    customerPhone: row.customer_phone ?? null,
    deliveryAddress: row.delivery_address ?? null,
    geolocation:
      row.latitude != null && row.longitude != null
        ? { lat: Number(row.latitude), lng: Number(row.longitude) }
        : null,
    status: row.status ?? 'pending',
    timeWindowStart: row.time_window_start ?? null,
    timeWindowEnd: row.time_window_end ?? null,
    packageWeight: row.package_weight ?? 0,
    volumetricWeight: row.volumetric_weight ?? 0,
    serviceType: row.service_type ?? 'standard',
    codAmount: row.cod_amount ?? 0,
    deliveryCost: row.delivery_cost ?? 0,
    driverPayout: row.driver_payout ?? 0,
    hubId: row.hub_id ?? null,
    assignedDriver: row.assigned_driver ?? null,
    assignedRoute: row.assigned_route ?? null,
    priority: row.priority ?? 'normal',
    attempts: row.attempts ?? 0,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}
export async function fetchOrdersFromBackend() {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: new Error('Supabase is not configured') };
  }
  const { data: rows, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return { data: null, error };
  const orders = (rows || []).map(rowToOrder);
  return { data: orders, error: null };
}