alter table public.drivers add column if not exists auth_user_id uuid;
create index if not exists idx_drivers_auth_user_id on public.drivers(auth_user_id);
