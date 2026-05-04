-- Optional banner placements (run in Supabase SQL editor).
alter table public.banners
  add column if not exists placement text default 'homepage_slider';

comment on column public.banners.placement is 'Where to render this banner (homepage_slider, homepage_top, category_page, etc).';

