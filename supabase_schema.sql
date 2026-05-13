-- Supabase Schema for Rafsan Clothing E-commerce
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Bangladesh',
  postal_code TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON users FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Allow any authenticated user to read basic user profiles (use cautiously)
CREATE POLICY "Authenticated users can view user profiles" 
  ON users FOR SELECT
  USING (auth.role() = 'authenticated');

-- Ensure the Postgres role `authenticated` has SELECT privilege
GRANT SELECT ON users TO authenticated;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  category TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Anyone can view products" 
  ON products FOR SELECT 
  USING (true);

-- Only admins can modify products (for now, allow all authenticated users)
CREATE POLICY "Authenticated users can modify products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

-- Only admins can modify categories
CREATE POLICY "Authenticated users can modify categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated');

-- Banners table
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for banners
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Allow public read access to banners
CREATE POLICY "Anyone can view banners"
  ON banners FOR SELECT
  USING (true);

-- Only admins can modify banners
CREATE POLICY "Authenticated users can modify banners"
  ON banners FOR ALL
  USING (auth.role() = 'authenticated');

-- Update products table to reference categories
ALTER TABLE products
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id),
ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Insert default categories
INSERT INTO categories (id, name, description) VALUES
  (uuid_generate_v4(), 'men', 'Men''s clothing'),
  (uuid_generate_v4(), 'women', 'Women''s clothing'),
  (uuid_generate_v4(), 'kids', 'Kids clothing'),
  (uuid_generate_v4(), 'sports', 'Sports wear')
ON CONFLICT (name) DO NOTHING;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || to_char(NOW(), 'YYYYMMDD') || '-' || lpad(floor(random() * 10000)::text, 4, '0'),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery',
  shipping_address TEXT,
  billing_address TEXT,
  tracking_number TEXT,
  carrier TEXT,
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'orders'
      AND column_name = 'status'
  ) THEN
    ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
    ALTER TABLE orders ADD CONSTRAINT orders_status_check
      CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'));
  END IF;
END $$;

-- Enable RLS for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can only see their own orders
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
CREATE POLICY "Users can insert their own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
CREATE POLICY "Users can update their own orders" 
  ON orders FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow any authenticated user to read orders (adjust if you want stricter privacy)
DROP POLICY IF EXISTS "Authenticated users can view orders" ON orders;
CREATE POLICY "Authenticated users can view orders" 
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.uid() = user_id);

-- Allow authenticated admins/panel users to update order status and tracking.
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

GRANT SELECT, UPDATE ON orders TO authenticated;

-- Order items table (for products in orders)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_time DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can only see order items for their own orders
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
CREATE POLICY "Users can view their own order items" 
  ON order_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Allow authenticated users to read order items (so client can fetch items when authorized)
DROP POLICY IF EXISTS "Authenticated users can view order items" ON order_items;
CREATE POLICY "Authenticated users can view order items" 
  ON order_items FOR SELECT
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own order items" ON order_items;
CREATE POLICY "Users can insert their own order items"
  ON order_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

GRANT SELECT, INSERT ON order_items TO authenticated;

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS for wishlist
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Users can only see their own wishlist
CREATE POLICY "Users can manage their own wishlist" 
  ON wishlist FOR ALL 
  USING (auth.uid() = user_id);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS for cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Users can only see their own cart
CREATE POLICY "Users can manage their own cart" 
  ON cart_items FOR ALL 
  USING (auth.uid() = user_id);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'Bangladesh',
  postal_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for addresses
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Users can only see their own addresses
CREATE POLICY "Users can manage their own addresses" 
  ON addresses FOR ALL 
  USING (auth.uid() = user_id);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('order', 'promotion', 'system', 'security')),
  read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can manage their own notifications" 
  ON notifications FOR ALL 
  USING (auth.uid() = user_id);

-- Performance indexes for products table
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_is_active ON products(category_id, is_active);

-- Performance indexes for banners table
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO products (id, name, description, price, original_price, image_url, category, stock) VALUES
  (uuid_generate_v4(), 'Classic White T-Shirt', 'Premium cotton white t-shirt', 799.00, 999.00, 'https://example.com/tshirt.jpg', 'men', 50),
  (uuid_generate_v4(), 'Denim Jacket', 'Stylish denim jacket for all seasons', 2499.00, 2999.00, 'https://example.com/jacket.jpg', 'men', 25),
  (uuid_generate_v4(), 'Summer Dress', 'Light and comfortable summer dress', 1899.00, 2299.00, 'https://example.com/dress.jpg', 'women', 30),
  (uuid_generate_v4(), 'Sports Shoes', 'Comfortable running shoes', 3299.00, 3999.00, 'https://example.com/shoes.jpg', 'sports', 40)
ON CONFLICT (id) DO NOTHING;

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
