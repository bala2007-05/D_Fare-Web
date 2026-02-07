import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return NextResponse.json(
      { error: 'Missing or invalid Authorization header. Send Bearer <access_token>.' },
      { status: 401 }
    );
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: 'Server configuration error: Supabase not configured' },
      { status: 500 }
    );
  }
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: orders, error } = await supabase
    .from('orders')
    .select(
      'id, order_id, customer_name, customer_phone, delivery_address, latitude, longitude, status, time_window_start, time_window_end, package_weight, volumetric_weight, service_type, cod_amount, priority, assigned_driver, created_at, updated_at'
    )
    .order('created_at', { ascending: false });
  if (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
  const mapped = (orders || []).map((row: Record<string, unknown>) => ({
    orderId: row.order_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    deliveryAddress: row.delivery_address,
    latitude: row.latitude,
    longitude: row.longitude,
    status: row.status,
    timeWindowStart: row.time_window_start,
    timeWindowEnd: row.time_window_end,
    packageWeight: row.package_weight,
    volumetricWeight: row.volumetric_weight,
    serviceType: row.service_type,
    codAmount: row.cod_amount,
    priority: row.priority,
    assignedDriver: row.assigned_driver,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
  return NextResponse.json({ orders: mapped });
}