import { supabase } from './supabase';

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  images?: string[];
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
  /** When false, hide from storefront grids (admin toggle). */
  show_on_homepage?: boolean;
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
    const exact = await supabase
      .from('products')
      .select(
        `
        *,
        categories!inner (*)
      `
      )
      .eq('categories.name', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (exact.error) {
      console.error(`Error fetching products for category ${category}:`, exact.error);
      throw exact.error;
    }

    let rows = exact.data;
    if (!rows?.length) {
      const loose = await supabase
        .from('products')
        .select(
          `
        *,
        categories!inner (*)
      `
        )
        .ilike('categories.name', category)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (loose.error) {
        console.error(`Error fetching products (ilike) for ${category}:`, loose.error);
        return [];
      }
      rows = loose.data;
    }

    return (rows || []).map((product: any) => ({
      ...product,
      category: product.categories?.name || category,
      category_id: product.categories?.id,
    }));
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

function mapProductRows(data: unknown[] | null): Product[] {
  return (data || []).map((product: any) => ({
    ...product,
    category: product.categories?.name,
    category_id: product.categories?.id,
  }));
}

export type FetchProductsOptions = {
  /** Only products visible on the storefront (requires `is_active` column). */
  activeOnly?: boolean;
};

// Get all products (admin: all rows; storefront: pass activeOnly)
export async function fetchProducts(options?: FetchProductsOptions): Promise<Product[]> {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (*)
      `)
      .order('created_at', { ascending: false });

    if (options?.activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    let products = mapProductRows(data);
    if (options?.activeOnly) {
      products = products.filter(
        (p) => p.show_on_homepage !== false
      );
    }
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

/** Paginated active catalog products (homepage / load more). */
export async function fetchActiveProductsRange(
  offset: number,
  limit: number
): Promise<Product[]> {
  try {
    const from = Math.max(0, offset);
    const to = from + Math.max(1, limit) - 1;
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching paginated products:', error);
      throw error;
    }

    return mapProductRows(data).filter((p) => p.show_on_homepage !== false);
  } catch (error) {
    console.error('Failed to fetch paginated products:', error);
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
    // Convert image_url to images array for backward compatibility
    const images = product.images || (product.image_url ? [product.image_url] : []);
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.original_price,
        image_url: product.image_url, // Keep for backward compatibility
        images: images,
        category_id: product.category_id,
        stock: product.stock || 0,
        sku: product.sku,
        is_active: product.is_active ?? true,
        show_on_homepage: product.show_on_homepage ?? true,
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
    // Handle images update - if images is provided, use it; if image_url is provided but images is not, convert
    let images = updates.images;
    if (updates.image_url !== undefined && updates.images === undefined) {
      // If updating image_url but not images, we need to fetch current product to preserve existing images
      // For simplicity, we'll just set images to [updates.image_url] if image_url is being set
      // In a real scenario, you might want to merge with existing images
      images = updates.image_url ? [updates.image_url] : [];
    }
    
    const updateData: any = {
      name: updates.name,
      description: updates.description,
      price: updates.price,
      original_price: updates.original_price,
      category_id: updates.category_id,
      stock: updates.stock,
      sku: updates.sku,
      is_active: updates.is_active,
      updated_at: new Date().toISOString(),
    };
    if (updates.show_on_homepage !== undefined) {
      updateData.show_on_homepage = updates.show_on_homepage;
    }
    
    // Only include image_url if provided (for backward compatibility)
    if (updates.image_url !== undefined) {
      updateData.image_url = updates.image_url;
    }
    
    // Only include images if provided
    if (images !== undefined) {
      updateData.images = images;
    }
    
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
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

// Delete product (hard delete; on FK conflict, deactivate and hide from storefront)
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) return true;

    const { error: softError } = await supabase
      .from('products')
      .update({
        is_active: false,
        show_on_homepage: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (softError) {
      console.error(`Error deleting product ${id}:`, error, softError);
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
    // Fetch products with safe query
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('stock, is_active');

    if (productsError) {
      console.error('Error fetching products for stats:', productsError);
      // Return safe defaults but continue to try fetching categories
    }

    const productsData = products || [];
    const total = productsData.length;
    const outOfStock = productsData.filter(p => p.stock === 0).length;
    const lowStock = productsData.filter(p => p.stock > 0 && p.stock <= 10).length;

    // Fetch categories with safe query
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id', { count: 'exact' });

    if (categoriesError) {
      console.error('Error fetching categories for stats:', categoriesError);
    }

    return {
      total,
      outOfStock,
      lowStock,
      categories: categories?.length || 0,
    };
  } catch (error) {
    console.error('Unexpected error in getProductStats:', error);
    // Always return safe default values to prevent UI crash
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