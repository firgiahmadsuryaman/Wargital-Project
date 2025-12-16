import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    headerImage: {
        width: '100%',
        height: 200,
    },
    info: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    description: {
        marginTop: 8,
        color: '#666',
    },
    menuList: {
        padding: 16,
    },
    menuTitle: {
        marginBottom: 16,
    },
    cartFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cartInfo: {
        color: '#666',
        fontSize: 12,
    },
    cartTotal: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    viewCartButton: {
        backgroundColor: '#0a7ea4',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    viewCartText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
