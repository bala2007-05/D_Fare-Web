create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  legal_business_name text not null,
  service_type text,
  billing_plan text,
  created_at timestamptz default now()
);

create table if not exists public.organization_admins (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  admin_name text not null,
  admin_email text not null,
  admin_phone text,
  registration_proof_url text,
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(auth_user_id)
);

alter table public.organization_admins enable row level security;

create policy "Admin access own row"
  on public.organization_admins
  for select
  using (auth.uid() = auth_user_id);

create policy "Allow insert organization_admins"
  on public.organization_admins
  for insert
  with check (auth.uid() = auth_user_id);

alter table public.organizations enable row level security;
create policy "Org read for admins"
  on public.organizations
  for select
  using (
    exists (
      select 1 from public.organization_admins oa
      where oa.organization_id = organizations.id and oa.auth_user_id = auth.uid()
    )
  );
