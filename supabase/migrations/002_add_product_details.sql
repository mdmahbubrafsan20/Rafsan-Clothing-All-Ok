-- Migration: 002_add_product_details.sql
-- Adds brand-quality product fields: fabric, sizes, colors, size_chart, product_details
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Add fabric (material info)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS fabric TEXT;

COMMENT ON COLUMN public.products.fabric IS 'Fabric material description (e.g. Premium Cotton Blend)';

-- 2. Add sizes (array of size names)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sizes TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.products.sizes IS 'Available sizes array (e.g. ["S","M","L","XL"])';

-- 3. Add colors (JSONB array with name and hex value)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS colors JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.products.colors IS 'Available colors as JSON array (e.g. [{"name":"Black","value":"#000000"}])';

-- 4. Add size_chart (JSONB - per-product measurements table)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS size_chart JSONB DEFAULT '{"description":"","unit":"inches","headers":["Size","Chest","Waist","Length"],"rows":[]}'::jsonb;

COMMENT ON COLUMN public.products.size_chart IS 'Per-product size chart JSON: {"description":"Asian fit","unit":"inches","headers":["Size","Chest","Waist","Length"],"rows":[["S","36","28","26"],["M","38","30","27"]]}';

-- 5. Add product_details (JSONB - structured description sections)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_details JSONB DEFAULT '{"overview":"","fabric_care":"","size_fit":"","shipping_returns":""}'::jsonb;

COMMENT ON COLUMN public.products.product_details IS 'Structured description: {"overview":"...","fabric_care":"...","size_fit":"...","shipping_returns":"..."}';

-- 6. Ensure JSONB columns allow null and have defaults
ALTER TABLE public.products
  ALTER COLUMN size_chart DROP NOT NULL;

ALTER TABLE public.products
  ALTER COLUMN product_details DROP NOT NULL;

ALTER TABLE public.products
  ALTER COLUMN colors DROP NOT NULL;

-- 7. GIN indexes on JSONB columns for fast filtering
CREATE INDEX IF NOT EXISTS idx_products_size_chart ON public.products USING GIN (size_chart);
CREATE INDEX IF NOT EXISTS idx_products_product_details ON public.products USING GIN (product_details);

-- 8. Grant read/update permissions to authenticated users
GRANT SELECT, UPDATE ON public.products TO authenticated;
