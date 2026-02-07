alter table public.organizations
  add column if not exists billing_plan text;
