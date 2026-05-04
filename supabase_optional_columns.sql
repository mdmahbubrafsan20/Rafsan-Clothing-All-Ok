-- Run in Supabase SQL editor if these columns are missing (homepage + admin toggles).
alter table public.products
  add column if not exists show_on_homepage boolean default true;

comment on column public.products.show_on_homepage is 'When false, product is hidden from homepage / catalog grids (still in admin).';
