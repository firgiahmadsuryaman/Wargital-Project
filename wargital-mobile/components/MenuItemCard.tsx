import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MenuItem } from '@/types';
import { ThemedText } from '@/components/ThemedText';
import { useCartStore } from '@/store/useCartStore';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { favoriteService } from '@/services/favoriteService';

interface MenuItemCardProps {
    item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
    const addItem = useCartStore((state) => state.addItem);
    const [isFavorite, setIsFavorite] = useState(item.isFavorite || false);
    const [loading, setLoading] = useState(false);

    const toggleFavorite = async () => {
        try {
            setLoading(true);
            const newState = !isFavorite;

            if (newState) {
                await favoriteService.addFavoriteMenu(item.id);
            } else {
                await favoriteService.removeFavoriteMenu(item.id);
            }

            setIsFavorite(newState);
        } catch (error) {
            console.error(error);
            // Revert state if error? Or just alert.
        } finally {
            setLoading(false);
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
                    <TouchableOpacity onPress={toggleFavorite} disabled={loading}>
                        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "red" : "#999"} />
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

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 6,
        marginRight: 12,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    description: {
        fontSize: 12,
        color: '#666',
        marginVertical: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    price: {
        fontWeight: 'bold',
        color: '#2a9d8f',
    },
    addButton: {
        backgroundColor: '#C0772C', // Primary Color
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    addButtonText: {
        color: '#fff',
        marginLeft: 4,
        fontSize: 12,
        fontWeight: '600',
    },
});
