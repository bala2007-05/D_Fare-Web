drop policy if exists "Users can read orders" on public.orders;

create policy "Orders read: drivers own, others all"
  on public.orders for select
  using (
    (select driver_id from public.drivers where auth_user_id = auth.uid() limit 1) is null
    or
    assigned_driver = (select driver_id from public.drivers where auth_user_id = auth.uid() limit 1)
  );
