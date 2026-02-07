import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Resend } from 'resend';
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.randomBytes(12);
  let s = '';
  for (let i = 0; i < 12; i++) s += chars[bytes[i] % chars.length];
  return s;
}
async function getNextDriverId(): Promise<string> {
  const { data: rows } = await supabaseAdmin!.from('drivers').select('driver_id');
  const nums = (rows || [])
    .map((r: { driver_id?: string }) => {
      const m = (r.driver_id || '').match(/DRV-(\d+)/i);
      return m ? parseInt(m[1], 10) : 0;
    })
    .filter((n: number) => n > 0);
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `DRV-${String(next).padStart(3, '0')}`;
}
function parseLicenseExpiry(v: unknown): string | null {
  if (v == null || v === '') return null;
  const d = new Date(v as string);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}
interface CreateDriverBody {
  email?: string;
  fullName?: string;
  full_name?: string;
  phone?: string;
  homeAddress?: string;
  home_address?: string;
  licenseNumber?: string;
  license_number?: string;
  licenseExpiry?: string;
  license_expiry?: string;
  employmentType?: string;
  employment_type?: string;
  shiftTiming?: string;
  shift_timing?: string;
  assignedHub?: string;
  assigned_hub?: string;
  vehicleType?: string;
  vehicle_type?: string;
}
export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Server configuration error: Supabase admin not configured' },
      { status: 500 }
    );
  }
  let body: CreateDriverBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const email = (body.email || '').trim().toLowerCase();
  const fullName = (body.fullName || body.full_name || '').trim();
  const phone = (body.phone || '').trim() || null;
  const homeAddress = (body.homeAddress || body.home_address || '').trim() || null;
  const licenseNumber = (body.licenseNumber || body.license_number || '').trim() || null;
  const licenseExpiry = parseLicenseExpiry(body.licenseExpiry || body.license_expiry);
  const employmentType = (body.employmentType || body.employment_type || '').trim() || null;
  const shiftTiming = (body.shiftTiming || body.shift_timing || '').trim() || null;
  if (!email) {
    return NextResponse.json(
      { error: 'Driver email is required' },
      { status: 400 }
    );
  }
  if (!fullName) {
    return NextResponse.json(
      { error: 'Full name is required' },
      { status: 400 }
    );
  }
  const password = generatePassword();
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: 'driver' },
    });
  if (authError) {
    const msg = (authError.message || '').toLowerCase();
    if (
      msg.includes('already been registered') ||
      msg.includes('already exists') ||
      msg.includes('duplicate')
    ) {
      return NextResponse.json(
        {
          error:
            'A driver with this email already exists. Use a different email or sign in with the existing account.',
        },
        { status: 400 }
      );
    }
    if (
      msg.includes('database error') &&
      (msg.includes('creating new user') || msg.includes('saving new user'))
    ) {
      console.error('Driver create: Auth createUser failed (database-level):', authError);
      return NextResponse.json(
        {
          error:
            'Account creation failed at the database. Check Supabase Dashboard: Auth logs and Postgres logs. Common causes: a trigger or constraint on auth.users, or broken permissions (e.g. after using Prisma).',
        },
        { status: 500 }
      );
    }
    console.error('Driver create: Auth createUser error:', authError);
    return NextResponse.json(
      { error: authError.message || 'Failed to create account' },
      { status: 400 }
    );
  }
  const authUserId = authData?.user?.id;
  if (!authUserId) {
    return NextResponse.json(
      { error: 'Auth user was not created' },
      { status: 500 }
    );
  }
  const driverId = await getNextDriverId();
  const driverRow = {
    id: authUserId,
    auth_user_id: authUserId,
    driver_id: driverId,
    name: fullName,
    email,
    phone,
    home_address: homeAddress,
    license_number: licenseNumber,
    license_expiry: licenseExpiry,
    employment_type: employmentType,
    shift: shiftTiming,
    assigned_hub: body.assignedHub || body.assigned_hub || null,
    vehicle_type: body.vehicleType || body.vehicle_type || null,
    status: 'idle',
    photo_url: null,
    cod_limit: 500,
    updated_at: new Date().toISOString(),
  };
  const { data: driverInsert, error: insertError } = await supabaseAdmin
    .from('drivers')
    .insert(driverRow)
    .select('id, driver_id, name, email, phone, home_address, status, auth_user_id')
    .single();
  if (insertError) {
    const code = insertError.code || '';
    const msg = (insertError.message || '').toLowerCase();
    const isDuplicate =
      code === '23505' ||
      msg.includes('unique') ||
      msg.includes('duplicate') ||
      msg.includes('already exists');
    if (isDuplicate) {
      return NextResponse.json(
        {
          error:
            'A driver with this email is already registered. Use a different email.',
        },
        { status: 400 }
      );
    }
    const isFk =
      code === '23503' || msg.includes('foreign key') || msg.includes('violates');
    if (isFk) {
      return NextResponse.json(
        {
          error:
            'Driver account could not be linked. Please try again or use a different email.',
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: insertError.message || 'Failed to save driver' },
      { status: 500 }
    );
  }
  const loginUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const loginPath = '/auth/login';
  if (resend) {
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'D-FARE <onboarding@resend.dev>',
        to: email,
        subject: 'Your D-FARE driver account',
        text: `Hello ${fullName},\n\nYour driver account has been created.\n\nDriver ID: ${driverId}\nPassword: ${password}\n\nLog in at: ${loginUrl}${loginPath}\n\nPlease change your password after first login.\n\n— D-FARE Team`,
        html: `
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>Your driver account has been created.</p>
          <ul>
            <li><strong>Driver ID:</strong> ${driverId}</li>
            <li><strong>Password:</strong> <code>${password}</code></li>
          </ul>
          <p><a href="${loginUrl}${loginPath}">Log in here</a></p>
          <p>Please change your password after your first login.</p>
          <p>— D-FARE Team</p>
        `,
      });
    } catch (emailErr) {
      console.error('Failed to send driver credentials email:', emailErr);
    }
  }
  return NextResponse.json(
    {
      success: true,
      message: 'Driver created successfully. Credentials have been sent to the driver email.',
      driver: driverInsert,
      driverId,
    },
    { status: 201 }
  );
}