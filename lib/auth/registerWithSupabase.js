'use client';
import { supabase } from '@/lib/supabase/client';
export async function registerOrganizationWithAuth({
  adminEmail,
  adminPassword,
  adminName,
  adminPhone = '',
  registrationProofUrl = null,
  legalBusinessName,
  serviceType,
  billingPlan,
}) {
  if (!supabase) {
    return { error: new Error('Registration is unavailable. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart the dev server.') };
  }
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: adminEmail.trim(),
    password: adminPassword,
  });
  if (signUpError) {
    return { error: signUpError };
  }
  const userId = authData?.user?.id;
  if (!userId) {
    return { error: new Error('Sign up did not return a user') };
  }
  const { data: orgRow, error: orgError } = await supabase
    .from('organizations')
    .insert([
      {
        legal_business_name: legalBusinessName,
        service_type: serviceType,
        billing_plan: billingPlan,
      },
    ])
    .select('id')
    .single();
  if (orgError) {
    return { error: orgError };
  }
  const organizationId = orgRow?.id;
  if (!organizationId) {
    return { error: new Error('Organization insert did not return id') };
  }
  const { error: adminError } = await supabase.from('organization_admins').insert([
    {
      organization_id: organizationId,
      admin_name: adminName,
      admin_email: adminEmail.trim(),
      admin_phone: adminPhone || null,
      registration_proof_url: registrationProofUrl,
      auth_user_id: userId,
    },
  ]);
  if (adminError) {
    return { error: adminError };
  }
  return { userId, organizationId };
}