import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { restaurantService } from '@/services/restaurantService';
import { Restaurant, MenuItem } from '@/types';
import { MenuItemCard } from '@/components/MenuItemCard';
import { useCartStore } from '@/store/useCartStore';
import { Ionicons } from '@expo/vector-icons';

export default function RestaurantDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    const cartItems = useCartStore((state) => state.items);
    const cartTotal = useCartStore((state) => state.total());

    useEffect(() => {
        if (id) {
            loadData(id as string);
        }
    }, [id]);

    const loadData = async (restaurantId: string) => {
        try {
            setLoading(true);
            const [restData, menuData] = await Promise.all([
                restaurantService.getRestaurantById(restaurantId),
                restaurantService.getMenuByRestaurantId(restaurantId),
            ]);
            setRestaurant(restData);
            setMenuItems(menuData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0a7ea4" />
            </View>
        );
    }

    if (!restaurant) {
        return (
            <View style={styles.centered}>
                <ThemedText>Restaurant not found</ThemedText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: restaurant.name, headerBackTitle: 'Back' }} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image
                    source={restaurant.image ? { uri: restaurant.image } : require('@/assets/images/food/nasi-goreng.png')}
                    style={styles.headerImage}
                    contentFit="cover"
                />
                <View style={styles.info}>
                    <ThemedText type="title">{restaurant.name}</ThemedText>
                    <ThemedText style={styles.description}>{restaurant.description}</ThemedText>
                </View>

                <View style={styles.menuList}>
                    <ThemedText type="subtitle" style={styles.menuTitle}>Menu</ThemedText>
                    {menuItems.map((item) => (
                        <MenuItemCard key={item.id} item={item} />
                    ))}
                </View>
            </ScrollView>

            {cartItems.length > 0 && (
                <View style={styles.cartFooter}>
                    <View>
                        <ThemedText style={styles.cartInfo}>{cartItems.length} Items</ThemedText>
                        <ThemedText style={styles.cartTotal}>Rp {cartTotal.toLocaleString('id-ID')}</ThemedText>
                    </View>
                    <TouchableOpacity style={styles.viewCartButton} onPress={() => router.push('/cart')}>
                        <ThemedText style={styles.viewCartText}>View Cart</ThemedText>
                        <Ionicons name="cart" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

