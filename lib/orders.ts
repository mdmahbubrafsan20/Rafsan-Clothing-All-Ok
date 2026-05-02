import { supabase } from './supabase';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  payment_method: string;
  shipping_address?: string;
  billing_address?: string;
  customer_name?: string;
  phone?: string;
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
  price_at_time?: number;
  price: number;
  product?: {
    name: string;
    image_url?: string;
  };
};

type OrderRow = Omit<Order, 'user' | 'items'>;
type DbRow = Record<string, unknown>;

async function hasAuthenticatedUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return Boolean(user);
}

function toNumber(value: unknown) {
  const amount = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

function normalizeOrder(order: DbRow): OrderRow {
  const id = String(order.id || '');

  return {
    ...order,
    id,
    order_number: String(order.order_number || `ORD-${id.slice(0, 8).toUpperCase()}`),
    user_id: String(order.user_id || ''),
    total_amount: toNumber(order.total_amount ?? order.amount),
    status: String(order.status || 'pending') as OrderStatus,
    payment_method: String(order.payment_method || 'cash_on_delivery'),
    shipping_address: typeof order.shipping_address === 'string' ? order.shipping_address : undefined,
    billing_address: typeof order.billing_address === 'string' ? order.billing_address : undefined,
    customer_name: typeof order.customer_name === 'string' ? order.customer_name : undefined,
    phone: typeof order.phone === 'string' ? order.phone : undefined,
    tracking_number: typeof order.tracking_number === 'string' ? order.tracking_number : undefined,
    carrier: typeof order.carrier === 'string' ? order.carrier : undefined,
    estimated_delivery: typeof order.estimated_delivery === 'string' ? order.estimated_delivery : undefined,
    created_at: typeof order.created_at === 'string' ? order.created_at : undefined,
    updated_at: typeof order.updated_at === 'string' ? order.updated_at : undefined,
  };
}

function normalizeOrderItem(item: DbRow): OrderItem {
  const price = toNumber(item.price_at_time ?? item.price);

  return {
    ...item,
    id: String(item.id || ''),
    order_id: String(item.order_id || ''),
    product_id: String(item.product_id || ''),
    quantity: Number(item.quantity) || 0,
    price,
    price_at_time: price,
  };
}

async function getUsersById(userIds: string[]) {
  const uniqueUserIds = [...new Set(userIds.filter(Boolean))];
  if (uniqueUserIds.length === 0) return new Map<string, Order['user']>();

  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name')
    .in('id', uniqueUserIds);

  if (error || !data) return new Map<string, Order['user']>();

  return new Map(
    (data as DbRow[]).map((user) => [
      String(user.id || ''),
      {
        email: typeof user.email === 'string' ? user.email : '',
        full_name: typeof user.full_name === 'string' ? user.full_name : undefined,
      },
    ])
  );
}

async function getItemsByOrderId(orderIds: string[]) {
  const uniqueOrderIds = [...new Set(orderIds.filter(Boolean))];
  if (uniqueOrderIds.length === 0) return new Map<string, OrderItem[]>();

  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', uniqueOrderIds);

  if (error || !data) return new Map<string, OrderItem[]>();

  const items = (data || []).map(normalizeOrderItem);
  const productIds = [...new Set(items.map(item => item.product_id).filter(Boolean))];
  const productsById = new Map<string, { name: string; image_url?: string }>();

  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from('products')
      .select('id, name, image_url')
      .in('id', productIds);

    ((products || []) as DbRow[]).forEach((product) => {
      productsById.set(String(product.id || ''), {
        name: typeof product.name === 'string' ? product.name : 'Unknown Product',
        image_url: typeof product.image_url === 'string' ? product.image_url : undefined,
      });
    });
  }

  return items.reduce((map, item) => {
    const currentItems = map.get(item.order_id) || [];
    map.set(item.order_id, [
      ...currentItems,
      {
        ...item,
        product: productsById.get(item.product_id) || item.product,
      },
    ]);
    return map;
  }, new Map<string, OrderItem[]>());
}

async function enrichOrders(orders: OrderRow[]): Promise<Order[]> {
  const [usersById, itemsByOrderId] = await Promise.all([
    getUsersById(orders.map(order => order.user_id)),
    getItemsByOrderId(orders.map(order => order.id)),
  ]);

  return orders.map(order => ({
    ...order,
    user: usersById.get(order.user_id) || {
      email: '',
      full_name: order.customer_name || undefined,
    },
    items: itemsByOrderId.get(order.id) || [],
  }));
}

// Get all orders with optional filters
export async function getAllOrders(
  status?: OrderStatus,
  limit: number = 50,
  page: number = 1
): Promise<Order[]> {
  try {
    if (!(await hasAuthenticatedUser())) return [];

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error } = await query.range(from, to);

    if (error) return [];

    return enrichOrders((data || []).map(normalizeOrder));
  } catch {
    return [];
  }
}

// Get order by ID
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    if (!(await hasAuthenticatedUser())) return null;

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError || !orderData) return null;

    const [order] = await enrichOrders([normalizeOrder(orderData)]);
    return order || null;
  } catch {
    return null;
  }
}

// Get order items
export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  try {
    if (!(await hasAuthenticatedUser())) return [];

    return (await getItemsByOrderId([orderId])).get(orderId) || [];
  } catch {
    return [];
  }
}

// Update order status
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  try {
    if (!(await hasAuthenticatedUser())) return null;

    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) return null;

    const [order] = await enrichOrders([normalizeOrder(data)]);
    return order || null;
  } catch {
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
    if (!(await hasAuthenticatedUser())) return null;

    const { data, error } = await supabase
      .from('orders')
      .update({
        tracking_number: trackingNumber,
        carrier,
        estimated_delivery: estimatedDelivery,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) return null;

    const [order] = await enrichOrders([normalizeOrder(data)]);
    return order || null;
  } catch {
    return null;
  }
}

// Get order statistics
export async function getOrderStats(): Promise<{
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}> {
  try {
    if (!(await hasAuthenticatedUser())) {
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
      };
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('status, total_amount');

    if (error) {
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
      };
    }

    const total = orders?.length || 0;
    const pending = orders?.filter(o => o.status === 'pending').length || 0;
    const confirmed = orders?.filter(o => o.status === 'confirmed').length || 0;
    const processing = orders?.filter(o => o.status === 'processing').length || 0;
    const shipped = orders?.filter(o => o.status === 'shipped').length || 0;
    const delivered = orders?.filter(o => o.status === 'delivered').length || 0;
    const cancelled = orders?.filter(o => o.status === 'cancelled').length || 0;
    const totalRevenue = orders?.reduce((sum, order) => sum + toNumber(order.total_amount), 0) || 0;

    return {
      total,
      pending,
      confirmed,
      processing,
      shipped,
      delivered,
      cancelled,
      totalRevenue,
    };
  } catch {
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
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
    if (!(await hasAuthenticatedUser())) return [];

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return [];

    return enrichOrders((data || []).map(normalizeOrder));
  } catch {
    return [];
  }
}
