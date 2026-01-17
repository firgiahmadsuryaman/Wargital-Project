import api from './api';
import { Restaurant } from '@/types';

// Tipe data response dari API favorites
// API mengembalikan array of Favorite object yang didalamnya ada restaurant
interface FavoriteResponse {
    id: string;
    restaurant: Restaurant;
    restaurantId: string;
    userId: string;
    createdAt: string;
}

export const favoriteService = {
    // Mengambil daftar restoran favorit
    getFavorites: async (): Promise<Restaurant[]> => {
        const response = await api.get<FavoriteResponse[]>('/user/favorites');
        // Map dari FavoriteResponse ke Restaurant
        return response.data.map(item => item.restaurant);
    },

    // Menambah ke favorit
    addFavorite: async (restaurantId: string): Promise<void> => {
        await api.post('/user/favorites', { restaurantId });
    },

    // Menghapus dari favorit
    removeFavorite: async (restaurantId: string): Promise<void> => {
        await api.delete(`/user/favorites/${restaurantId}`);
    }
};
