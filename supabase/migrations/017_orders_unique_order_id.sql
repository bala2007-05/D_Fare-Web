do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.orders'::regclass
      and conname = 'orders_order_id_key'
  ) then
    alter table public.orders add constraint orders_order_id_key unique (order_id);
  end if;
end $$;
