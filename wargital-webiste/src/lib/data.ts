
import { apiClient, apiServer } from '@/lib/api-client';
import type { CartItem, MenuItem, Order, Restaurant } from '@/lib/types';

type ApiRestaurant = Restaurant & { menu: MenuItem[] };

type ApiOrder = {
  id: string;
  status: string;
  total: number;
  orderDate: string;
  restaurant?: { name: string | null };
  orderItems: Array<{
    quantity: number;
    menuItem: MenuItem;
  }>;
};

const mapOrder = (order: ApiOrder): Order => ({
  id: order.id,
  restaurantName: order.restaurant?.name ?? 'Wargital',
  items: order.orderItems.map((item) => ({
    id: item.menuItem.id,
    name: item.menuItem.name,
    price: item.menuItem.price,
    quantity: item.quantity,
    image: item.menuItem.image,
  })),
  total: order.total,
  status: (order.status as Order['status']) ?? 'Dalam perjalanan',
  orderDate: order.orderDate,
});

export async function fetchRestaurants(isServer = false): Promise<ApiRestaurant[]> {
  const client = isServer ? apiServer : apiClient;
  const { data } = await client.get<ApiRestaurant[]>('/restaurants');
  return data;
}

export async function fetchRestaurantById(id: string, isServer = false): Promise<ApiRestaurant | undefined> {
  const client = isServer ? apiServer : apiClient;
  const { data } = await client.get<ApiRestaurant>(`/restaurants/${id}`);
  return data;
}

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await apiClient.get<ApiOrder[]>('/orders');
  return data.map(mapOrder);
}

export async function createOrder(payload: { restaurantId: string; items: CartItem[]; userId?: string }) {
  const { data } = await apiClient.post<ApiOrder>('/orders', {
    restaurantId: payload.restaurantId,
    userId: payload.userId,
    items: payload.items.map((item) => ({
      menuItemId: item.id,
      quantity: item.quantity,
    })),
  });

  return mapOrder(data);
}
