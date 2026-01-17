export interface Restaurant {
    id: string;
    name: string;
    description: string;
    distance?: string;
    image?: string;
    imageHint?: string;
    menu?: MenuItem[];
    isFavorite?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    imageHint?: string;
    restaurantId: string;
    isFavorite?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    quantity: number;
    menuItem: MenuItem;
}

export interface Order {
    id: string;
    status: string;
    total: number;
    orderDate: string;
    restaurantId?: string;
    items: OrderItem[];
}

export interface Address {
    id: string;
    label: string;
    recipient: string;
    phone: string;
    fullAddress: string;
    detail?: string;
    isPrimary: boolean;
    userId: string;
}
