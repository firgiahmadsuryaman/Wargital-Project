import { StyleSheet, FlatList, View, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RestaurantCard } from '@/components/RestaurantCard';
import { MenuItemCard } from '@/components/MenuItemCard'; // Import
import { useState, useCallback } from 'react';
import { Restaurant, MenuItem } from '@/types';
import { favoriteService } from '@/services/favoriteService';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type TabType = 'restaurant' | 'menu';

export default function FavoritesScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    // State tabs
    const [activeTab, setActiveTab] = useState<TabType>('restaurant');

    const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
    const [favoriteMenus, setFavoriteMenus] = useState<MenuItem[]>([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadFavorites = async () => {
        try {
            // Load both concurrently
            const [restos, menus] = await Promise.all([
                favoriteService.getFavorites(),
                favoriteService.getFavoriteMenuItems()
            ]);
            setFavoriteRestaurants(restos);
            setFavoriteMenus(menus);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [])
    );

    const handleRefresh = () => {
        setRefreshing(true);
        loadFavorites();
    };

    const handleToggleFavorite = async () => {
        // Reload list untuk sinkronisasi
        loadFavorites();
    };

    // Render item based on active tab
    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            );
        }

        if (activeTab === 'restaurant') {
            return (
                <FlatList
                    data={favoriteRestaurants}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <RestaurantCard
                            restaurant={item}
                            initialIsFavorite={true}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                    ListEmptyComponent={renderEmpty('Restoran')}
                />
            );
        } else {
            return (
                <FlatList
                    data={favoriteMenus}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        // MenuItemCard sudah handle toggle favorite internal, 
                        // tapi kita mungkin butuh reload jika item di-unlove agar hilang dari list.
                        // Sayangnya MenuItemCard tidak punya callback prop 'onToggleFavorite'.
                        // Untuk saat ini kita biarkan, user perlu pull-to-refresh untuk menghilangkan item.
                        // Atau next update kita tambah callback callback ke MenuItemCard.
                        <MenuItemCard item={{ ...item, isFavorite: true }} />
                    )}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                    ListEmptyComponent={renderEmpty('Menu')}
                />
            );
        }
    };

    const renderEmpty = (type: string) => (
        <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={64} color="#ccc" />
            <ThemedText style={styles.emptyTitle}>Belum ada {type} Favorit</ThemedText>
            <ThemedText style={styles.emptyText}>
                Tandai {type.toLowerCase()} favoritmu agar mudah ditemukan nanti.
            </ThemedText>
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* Tab Header */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'restaurant' && { borderBottomColor: theme.primary }]}
                        onPress={() => setActiveTab('restaurant')}
                    >
                        <ThemedText style={[styles.tabText, activeTab === 'restaurant' && { color: theme.primary, fontWeight: 'bold' }]}>
                            Restoran
                        </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'menu' && { borderBottomColor: theme.primary }]}
                        onPress={() => setActiveTab('menu')}
                    >
                        <ThemedText style={[styles.tabText, activeTab === 'menu' && { color: theme.primary, fontWeight: 'bold' }]}>
                            Menu
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {renderContent()}
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        gap: 12,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
        padding: 32,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        lineHeight: 20,
    },
});