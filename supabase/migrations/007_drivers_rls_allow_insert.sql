drop policy if exists "Users can insert drivers" on public.drivers;

create policy "Users can insert drivers"
  on public.drivers for insert
  with check (true);
