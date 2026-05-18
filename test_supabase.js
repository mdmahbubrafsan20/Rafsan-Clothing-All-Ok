const { supabase } = require('./lib/supabase');

async function test() {
  console.log('Testing Supabase connection...');
  
  // Test 1: Check if we can fetch products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .limit(3);
    
  if (productsError) {
    console.log('Error fetching products:', productsError.message);
  } else {
    console.log('Products fetched successfully:', products?.length || 0, 'products');
    console.log('Sample product:', products?.[0]);
  }
  
  // Test 2: Check if categories table exists
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .limit(3);
    
  if (categoriesError) {
    console.log('Categories table error (expected):', categoriesError.message);
  } else {
    console.log('Categories table exists:', categories?.length || 0, 'categories');
  }
  
  // Test 3: Check if product_images table exists
  const { data: productImages, error: imagesError } = await supabase
    .from('product_images')
    .select('*')
    .limit(3);
    
  if (imagesError) {
    console.log('Product images table error (expected):', imagesError.message);
  } else {
    console.log('Product images table exists:', productImages?.length || 0, 'images');
  }
}

test().catch(console.error); 