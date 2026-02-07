alter table public.drivers add column if not exists auth_user_id uuid references auth.users(id) on delete set null;

create index if not exists idx_drivers_auth_user_id on public.drivers(auth_user_id);
