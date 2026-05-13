import { supabase } from './supabase';

export type Banner = {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  position: number;
  /** Controls where this banner should render on the storefront. */
  placement?: 'homepage_slider' | 'homepage_top' | 'category_page' | 'other';
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
};

// Get all banners
export async function getAllBanners(): Promise<Banner[]> {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('id, title, description, image_url, link_url, is_active, position, placement, start_date, end_date, created_at, updated_at')
      .order('position', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching banners:', error);
      throw error;
    }

    return (data || []) as Banner[];
  } catch (error) {
    console.error('Failed to fetch banners:', error);
    return [];
  }
}

// Get active banners (for frontend)
export async function getActiveBanners(): Promise<Banner[]> {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('id, title, description, image_url, link_url, is_active, position, placement, start_date, end_date, created_at, updated_at')
      .eq('is_active', true)
      .order('position', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active banners:', error);
      throw error;
    }

    return (data || []) as Banner[];
  } catch (error) {
    console.error('Failed to fetch active banners:', error);
    return [];
  }
}

// Get banner by ID
export async function getBannerById(id: string): Promise<Banner | null> {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('id, title, description, image_url, link_url, is_active, position, placement, start_date, end_date, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching banner ${id}:`, error);
      return null;
    }

    return data as Banner;
  } catch (error) {
    console.error(`Failed to fetch banner ${id}:`, error);
    return null;
  }
}

// Create new banner
export async function createBanner(banner: Omit<Banner, 'id' | 'created_at' | 'updated_at'>): Promise<Banner | null> {
  try {
    const { data, error } = await supabase
      .from('banners')
      .insert([{
        title: banner.title,
        description: banner.description,
        image_url: banner.image_url,
        link_url: banner.link_url,
        is_active: banner.is_active ?? true,
        position: banner.position || 0,
        placement: banner.placement || 'homepage_slider',
        start_date: banner.start_date,
        end_date: banner.end_date,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating banner:', error);
      return null;
    }

    return data as Banner;
  } catch (error) {
    console.error('Failed to create banner:', error);
    return null;
  }
}

// Update banner
export async function updateBanner(id: string, updates: Partial<Banner>): Promise<Banner | null> {
  try {
    const { data, error } = await supabase
      .from('banners')
      .update({
        title: updates.title,
        description: updates.description,
        image_url: updates.image_url,
        link_url: updates.link_url,
        is_active: updates.is_active,
        position: updates.position,
        placement: updates.placement,
        start_date: updates.start_date,
        end_date: updates.end_date,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating banner ${id}:`, error);
      return null;
    }

    return data as Banner;
  } catch (error) {
    console.error(`Failed to update banner ${id}:`, error);
    return null;
  }
}

// Delete banner
export async function deleteBanner(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting banner ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete banner ${id}:`, error);
    return false;
  }
}

// Get banner statistics
export async function getBannerStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  withLinks: number;
}> {
  try {
    const { data: banners, error } = await supabase
      .from('banners')
      .select('is_active, link_url');

    if (error) {
      console.error('Error fetching banner stats:', error);
      return { total: 0, active: 0, inactive: 0, withLinks: 0 };
    }

    const total = banners?.length || 0;
    const active = banners?.filter(b => b.is_active).length || 0;
    const inactive = total - active;
    const withLinks = banners?.filter(b => b.link_url).length || 0;

    return { total, active, inactive, withLinks };
  } catch (error) {
    console.error('Failed to fetch banner stats:', error);
    return { total: 0, active: 0, inactive: 0, withLinks: 0 };
  }
}