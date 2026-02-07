alter table public.drivers
  alter column driver_id type text using driver_id::text;
