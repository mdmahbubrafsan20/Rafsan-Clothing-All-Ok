import { supabase } from './supabase';

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  category?: string;
  category_id?: string;
  stock: number;
  sku?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  // Additional fields for product details
  fabric?: string;
  sizes?: string[];
  colors?: Array<{ name: string; value: string }>;
  // Product images array for gallery
  images?: Array<{ id: string; image_url: string; alt_text?: string }>;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
};

// Helper function to get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner (*)
      `)
      .eq('categories.name', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw error;
    }

    const products: Product[] = (data || []).map((product: any) => ({
      ...product,
      category: product.categories?.name || category,
      category_id: product.categories?.id,
    }));

    console.log(`Products for category ${category}:`, products.length);
    return products;
  } catch (error) {
    console.error(`Failed to fetch products for category ${category}:`, error);
    return [];
  }
}

// Helper function to get all categories
export async function getAllCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return (data || []) as Category[];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

// Get all products
export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    const products: Product[] = (data || []).map((product: any) => ({
      ...product,
      category: product.categories?.name,
      category_id: product.categories?.id,
    }));

    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

// Get product by ID
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }

    return {
      ...data,
      category: data.categories?.name,
      category_id: data.categories?.id,
    };
  } catch (error) {
    console.error(`Failed to fetch product ${id}:`, error);
    return null;
  }
}

// Create new product
export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.original_price,
        image_url: product.image_url,
        category_id: product.category_id,
        stock: product.stock || 0,
        sku: product.sku,
        is_active: product.is_active ?? true,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    return data as Product;
  } catch (error) {
    console.error('Failed to create product:', error);
    return null;
  }
}

// Update product
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: updates.name,
        description: updates.description,
        price: updates.price,
        original_price: updates.original_price,
        image_url: updates.image_url,
        category_id: updates.category_id,
        stock: updates.stock,
        sku: updates.sku,
        is_active: updates.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating product ${id}:`, error);
      return null;
    }

    return data as Product;
  } catch (error) {
    console.error(`Failed to update product ${id}:`, error);
    return null;
  }
}

// Delete product
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting product ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete product ${id}:`, error);
    return false;
  }
}

// Get product statistics
export async function getProductStats(): Promise<{
  total: number;
  outOfStock: number;
  lowStock: number;
  categories: number;
}> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('stock, is_active');

    if (error) {
      console.error('Error fetching product stats:', error);
      return { total: 0, outOfStock: 0, lowStock: 0, categories: 0 };
    }

    const total = products?.length || 0;
    const outOfStock = products?.filter(p => p.stock === 0).length || 0;
    const lowStock = products?.filter(p => p.stock > 0 && p.stock <= 10).length || 0;

    const { data: categories } = await supabase
      .from('categories')
      .select('id', { count: 'exact' });

    return {
      total,
      outOfStock,
      lowStock,
      categories: categories?.length || 0,
    };
  } catch (error) {
    console.error('Failed to fetch product stats:', error);
    return { total: 0, outOfStock: 0, lowStock: 0, categories: 0 };
  }
}

// Category CRUD operations
export async function createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: category.name,
        description: category.description,
        image_url: category.image_url,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return null;
    }

    return data as Category;
  } catch (error) {
    console.error('Failed to create category:', error);
    return null;
  }
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: updates.name,
        description: updates.description,
        image_url: updates.image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating category ${id}:`, error);
      return null;
    }

    return data as Category;
  } catch (error) {
    console.error(`Failed to update category ${id}:`, error);
    return null;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting category ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete category ${id}:`, error);
    return false;
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching category ${id}:`, error);
      return null;
    }

    return data as Category;
  } catch (error) {
    console.error(`Failed to fetch category ${id}:`, error);
    return null;
  }
}