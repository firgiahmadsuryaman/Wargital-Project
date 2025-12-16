import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuItem } from '../types';

interface FavoritesState {
    items: MenuItem[];
    addFavorite: (item: MenuItem) => void;
    removeFavorite: (itemId: string) => void;
    isFavorite: (itemId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            items: [],
            addFavorite: (item) => {
                const { items } = get();
                if (!items.find((i) => i.id === item.id)) {
                    set({ items: [...items, item] });
                }
            },
            removeFavorite: (itemId) => {
                set({ items: get().items.filter((i) => i.id !== itemId) });
            },
            isFavorite: (itemId) => {
                return !!get().items.find((i) => i.id === itemId);
            },
        }),
        {
            name: 'wargital-favorites-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
