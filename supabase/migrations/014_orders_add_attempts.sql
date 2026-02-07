alter table public.orders add column if not exists attempts int default 0;
