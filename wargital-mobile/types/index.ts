export interface Restaurant {
    id: string;
    name: string;
    description: string;
    distance?: string;
    image?: string;
    imageHint?: string;
    menu?: MenuItem[];
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
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    quantity: number;
    menuItem: MenuItem;
}


