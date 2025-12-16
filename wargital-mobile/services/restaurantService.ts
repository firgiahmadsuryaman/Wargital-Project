import api from './api';
import { Restaurant, MenuItem } from '../types';

export const restaurantService = {
    getRestaurants: async (): Promise<Restaurant[]> => {
        const response = await api.get<Restaurant[]>('/restaurants');
        return response.data;
    }
};
