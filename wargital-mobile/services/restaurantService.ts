import api from './api';
import { Restaurant, MenuItem } from '../types';

export const restaurantService = {
    getRestaurants: async (): Promise<Restaurant[]> => {
        const response = await api.get<Restaurant[]>('/restaurants');
        return response.data;
    },
    getRestaurantById: async (id: string): Promise<Restaurant> => {
        const response = await api.get<Restaurant>(`/restaurants/${id}`);
        return response.data;
    },
    getMenuByRestaurantId: async (restaurantId: string): Promise<MenuItem[]> => {
        const response = await api.get<MenuItem[]>(`/restaurants/${restaurantId}/menu`);
        return response.data;
    },
};
