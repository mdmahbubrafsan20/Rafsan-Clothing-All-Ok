import { supabase } from './supabase';

/**
 * Upload multiple files to Supabase Storage bucket "products"
 * @param files Array of File objects
 * @returns Array of public URLs for uploaded files
 */
export async function uploadProductImages(files: File[]): Promise<string[]> {
  if (!files.length) return [];

  const uploadedUrls: string[] = [];

  for (const file of files) {
    try {
      // Generate unique filename: timestamp + random string + original filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Error uploading file:', error);
        continue; // Skip this file but continue with others
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
      console.log(`Uploaded ${file.name} to ${publicUrl}`);
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
    }
  }

  return uploadedUrls;
}

/**
 * Delete files from Supabase Storage
 * @param urls Array of public URLs to delete
 */
export async function deleteProductImages(urls: string[]): Promise<void> {
  if (!urls.length) return;

  for (const url of urls) {
    try {
      // Extract file path from URL
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const bucketIndex = pathParts.indexOf('products');
      if (bucketIndex === -1) continue;

      const filePath = pathParts.slice(bucketIndex + 1).join('/');
      
      const { error } = await supabase.storage
        .from('products')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting file:', error);
      } else {
        console.log(`Deleted ${filePath}`);
      }
    } catch (error) {
      console.error(`Failed to delete ${url}:`, error);
    }
  }
}

/**
 * Validate file type and size
 * @param file File object
 * @returns Error message or null if valid
 */
export function validateImageFile(file: File): string | null {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return `File type ${file.type} not supported. Please upload JPEG, PNG, WebP, or GIF.`;
  }

  if (file.size > maxSize) {
    return `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds limit of 5MB.`;
  }

  return null;
}