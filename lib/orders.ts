import { supabase } from './supabase';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  payment_method: string;
  shipping_address?: string;
  billing_address?: string;
  tracking_number?: string;
  carrier?: string;
  estimated_delivery?: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    email: string;
    full_name?: string;
  };
  items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    image_url?: string;
  };
};

// Get all orders with optional filters
export async function getAllOrders(
  status?: OrderStatus,
  limit: number = 50,
  page: number = 1
): Promise<Order[]> {
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        user:users(email, full_name)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error } = await query.range(from, to);

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      (data || []).map(async (order: any) => {
        const items = await getOrderItems(order.id);
        return { ...order, items };
      })
    );

    return ordersWithItems as Order[];
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}

// Get order by ID
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        user:users(email, full_name)
      `)
      .eq('id', id)
      .single();

    if (orderError) {
      console.error(`Error fetching order ${id}:`, orderError);
      return null;
    }

    const items = await getOrderItems(id);

    return { ...orderData, items } as Order;
  } catch (error) {
    console.error(`Failed to fetch order ${id}:`, error);
    return null;
  }
}

// Get order items
export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .select(`
        *,
        product:products(name, image_url)
      `)
      .eq('order_id', orderId);

    if (error) {
      console.error(`Error fetching items for order ${orderId}:`, error);
      return [];
    }

    return (data || []) as OrderItem[];
  } catch (error) {
    console.error(`Failed to fetch items for order ${orderId}:`, error);
    return [];
  }
}

// Update order status
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        user:users(email, full_name)
      `)
      .single();

    if (error) {
      console.error(`Error updating order ${id}:`, error);
      return null;
    }

    const items = await getOrderItems(id);
    return { ...data, items } as Order;
  } catch (error) {
    console.error(`Failed to update order ${id}:`, error);
    return null;
  }
}

// Update order tracking info
export async function updateOrderTracking(
  id: string, 
  trackingNumber: string, 
  carrier: string,
  estimatedDelivery?: string
): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        tracking_number: trackingNumber,
        carrier,
        estimated_delivery: estimatedDelivery,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        user:users(email, full_name)
      `)
      .single();

    if (error) {
      console.error(`Error updating order tracking ${id}:`, error);
      return null;
    }

    const items = await getOrderItems(id);
    return { ...data, items } as Order;
  } catch (error) {
    console.error(`Failed to update order tracking ${id}:`, error);
    return null;
  }
}

// Get order statistics
export async function getOrderStats(): Promise<{
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}> {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('status, total_amount');

    if (error) {
      console.error('Error fetching order stats:', error);
      return {
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
      };
    }

    const total = orders?.length || 0;
    const pending = orders?.filter(o => o.status === 'pending').length || 0;
    const processing = orders?.filter(o => o.status === 'processing').length || 0;
    const shipped = orders?.filter(o => o.status === 'shipped').length || 0;
    const delivered = orders?.filter(o => o.status === 'delivered').length || 0;
    const cancelled = orders?.filter(o => o.status === 'cancelled').length || 0;
    const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

    return {
      total,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      totalRevenue,
    };
  } catch (error) {
    console.error('Failed to fetch order stats:', error);
    return {
      total: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0,
    };
  }
}

// Get recent orders
export async function getRecentOrders(limit: number = 10): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:users(email, full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }

    return (data || []) as Order[];
  } catch (error) {
    console.error('Failed to fetch recent orders:', error);
    return [];
  }
}