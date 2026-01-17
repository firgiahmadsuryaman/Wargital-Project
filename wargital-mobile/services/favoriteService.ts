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
        // Map dari FavoriteResponse ke Restaurant dan filter yang valid (karena bisa jadi ada Menu Favorite yang restaurant-nya null)
        return response.data
            .map(item => item.restaurant)
            .filter((r): r is Restaurant => r !== null && r !== undefined);
    },

    // Menambah ke favorit
    addFavorite: async (restaurantId: string): Promise<void> => {
        await api.post('/user/favorites', { restaurantId });
    },

    // Menghapus dari favorit
    removeFavorite: async (restaurantId: string): Promise<void> => {
        // Gunakan endpoint baru dengan query params
        await api.delete(`/user/favorites?restaurantId=${restaurantId}`);
    },

    // Menambah menu ke favorit
    addFavoriteMenu: async (menuItemId: string): Promise<void> => {
        await api.post('/user/favorites', { menuItemId });
    },

    // Menghapus menu dari favorit
    removeFavoriteMenu: async (menuItemId: string): Promise<void> => {
        await api.delete(`/user/favorites?menuItemId=${menuItemId}`);
    }
};
