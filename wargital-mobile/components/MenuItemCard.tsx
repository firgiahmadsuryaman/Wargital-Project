import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MenuItem } from '@/types';
import { ThemedText } from '@/components/themed-text';
import { useCartStore } from '@/store/useCartStore';
import { Ionicons } from '@expo/vector-icons';

import { useFavoritesStore } from '@/store/useFavoritesStore';

interface MenuItemCardProps {
    item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
    const addItem = useCartStore((state) => state.addItem);
    const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
    const favorite = isFavorite(item.id);

    const toggleFavorite = () => {
        if (favorite) {
            removeFavorite(item.id);
        } else {
            addFavorite(item);
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={item.image ? { uri: item.image } : require('@/assets/images/food/nasi-goreng.png')}
                style={styles.image}
                contentFit="cover"
            />
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <ThemedText type="defaultSemiBold" style={{ flex: 1 }}>{item.name}</ThemedText>
                    <TouchableOpacity onPress={toggleFavorite}>
                        <Ionicons name={favorite ? "heart" : "heart-outline"} size={20} color={favorite ? "red" : "#999"} />
                    </TouchableOpacity>
                </View>
                <ThemedText style={styles.description} numberOfLines={2}>{item.description}</ThemedText>
                <View style={styles.footer}>
                    <ThemedText style={styles.price}>Rp {item.price.toLocaleString('id-ID')}</ThemedText>
                    <TouchableOpacity style={styles.addButton} onPress={() => addItem(item)}>
                        <Ionicons name="add" size={20} color="#fff" />
                        <ThemedText style={styles.addButtonText}>Add</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};


