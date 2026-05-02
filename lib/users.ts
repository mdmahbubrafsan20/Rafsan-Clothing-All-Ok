import { supabase } from './supabase';

export type User = {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
};

// Get all users
export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return (data || []) as User[];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching user ${id}:`, error);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    return null;
  }
}

// Update user
export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: updates.full_name,
        phone: updates.phone,
        address: updates.address,
        city: updates.city,
        country: updates.country,
        postal_code: updates.postal_code,
        avatar_url: updates.avatar_url,
        role: updates.role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating user ${id}:`, error);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error(`Failed to update user ${id}:`, error);
    return null;
  }
}

// Delete user (with auth user cascade)
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.admin.deleteUser(id);
    
    if (error) {
      console.error(`Error deleting user ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error);
    return false;
  }
}

// Get user statistics
export async function getUserStats(): Promise<{
  total: number;
  admins: number;
  regular: number;
  recentSignups: number;
  withOrders: number;
}> {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('role, created_at');

    if (error) {
      console.error('Error fetching user stats:', error);
      return { total: 0, admins: 0, regular: 0, recentSignups: 0, withOrders: 0 };
    }

    const total = users?.length || 0;
    const admins = users?.filter(u => u.role === 'admin').length || 0;
    const regular = total - admins;
    
    // Count users created in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSignups = users?.filter(u => 
      new Date(u.created_at) > thirtyDaysAgo
    ).length || 0;

    // Get users with orders
    const { data: orders } = await supabase
      .from('orders')
      .select('user_id');
    
    const uniqueUsersWithOrders = new Set(orders?.map(o => o.user_id) || []);
    const withOrders = uniqueUsersWithOrders.size;

    return {
      total,
      admins,
      regular,
      recentSignups,
      withOrders,
    };
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return { total: 0, admins: 0, regular: 0, recentSignups: 0, withOrders: 0 };
  }
}

// Get user orders count
export async function getUserOrderCount(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id', { count: 'exact' })
      .eq('user_id', userId);

    if (error) {
      console.error(`Error fetching orders for user ${userId}:`, error);
      return 0;
    }

    return data?.length || 0;
  } catch (error) {
    console.error(`Failed to fetch orders for user ${userId}:`, error);
    return 0;
  }
}

// Get user total spent
export async function getUserTotalSpent(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('user_id', userId)
      .eq('status', 'delivered');

    if (error) {
      console.error(`Error fetching total spent for user ${userId}:`, error);
      return 0;
    }

    return data?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
  } catch (error) {
    console.error(`Failed to fetch total spent for user ${userId}:`, error);
    return 0;
  }
}