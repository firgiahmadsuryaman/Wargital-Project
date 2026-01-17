import React, { forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { CartIcon } from '@/components/CartIcon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { Restaurant } from '@/types';
import { RestaurantCard } from '@/components/RestaurantCard';
import { FlatList } from 'react-native';

interface HomeHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    restaurants: Restaurant[];
    handleBannerSearchPress: () => void;
}

export const HomeHeader = forwardRef<TextInput, HomeHeaderProps>(({ searchQuery, setSearchQuery, restaurants, handleBannerSearchPress }, ref) => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    return (
        <View>
            {/* Header Section */}
            <View style={styles.headerTop}>
                <View style={styles.userInfo}>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
                        <View style={styles.avatar}>
                            <ThemedText>U</ThemedText>
                        </View>
                    </TouchableOpacity>
                    <View>
                        <ThemedText style={styles.greeting}>Hai,</ThemedText>
                        <ThemedText type="defaultSemiBold">Foodie!</ThemedText>
                    </View>
                </View>
                <CartIcon />
            </View>

            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: '#fff' }]}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    ref={ref}
                    placeholder="Cari makanan atau restoran..."
                    style={styles.searchInput}
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Banner */}
            <View style={styles.banner}>
                <View style={styles.bannerContent}>
                    <ThemedText style={styles.bannerTitle}>Hari ini,</ThemedText>
                    <ThemedText style={styles.bannerSubtitle}>Mau makan apa?</ThemedText>
                    <TouchableOpacity
                        style={[styles.bannerButton, { backgroundColor: theme.primary }]}
                        onPress={handleBannerSearchPress}
                    >
                        <ThemedText style={styles.bannerButtonText}>Cari Makanan</ThemedText>
                    </TouchableOpacity>
                </View>
                <Image
                    source={require('@/assets/images/food/nasi-goreng.png')}
                    style={styles.bannerImage}
                    contentFit="cover"
                />
            </View>

            {/* Restaurants (Horizontal) - Only show if we have restaurants to show, or if not searching */}
            {(restaurants.length > 0 || !searchQuery) && (
                <>
                    <View style={styles.sectionHeader}>
                        <ThemedText type="subtitle">Restoran Pilihan</ThemedText>
                        <ThemedText style={[styles.seeAll, { color: theme.primary }]}>Lihat Semua</ThemedText>
                    </View>

                    <FlatList
                        horizontal
                        data={restaurants}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={{ width: 280, marginRight: 16 }}>
                                <RestaurantCard
                                    restaurant={item}
                                    initialIsFavorite={item.isFavorite}
                                />
                            </View>
                        )}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 16 }}
                        keyboardShouldPersistTaps="handled"
                    />
                </>
            )}

            {/* Ongoing Order (Placeholder) */}
            <View style={[styles.sectionHeader, { marginTop: 8 }]}>
                <ThemedText type="subtitle">Pesanan Berjalan</ThemedText>
            </View>
            <View style={styles.ongoingOrderCard}>
                <Image
                    source={require('@/assets/images/food/nasi-goreng.png')}
                    style={styles.orderImage}
                />
                <View style={styles.orderInfo}>
                    <ThemedText type="defaultSemiBold">Steak Nusantara</ThemedText>
                    <ThemedText style={styles.orderDetail}>Jalan Pandjaitan no 299</ThemedText>
                    <ThemedText style={styles.orderDetail}>12 menit lagi</ThemedText>
                </View>
                <View style={styles.locationBadge}>
                    <Ionicons name="location-outline" size={16} color="#000" />
                </View>
            </View>

            <ThemedText type="subtitle" style={[styles.sectionHeader, { marginTop: 24, marginBottom: 16 }]}>Menu Wargital</ThemedText>
        </View>
    );
});

HomeHeader.displayName = 'HomeHeader';

const styles = StyleSheet.create({
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0D0B6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C0772C',
    },
    greeting: {
        fontSize: 12,
        color: '#666',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 1,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: '100%',
    },
    banner: {
        backgroundColor: '#1F2937',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        flexDirection: 'row',
        overflow: 'hidden',
        height: 160,
    },
    bannerContent: {
        flex: 1,
        zIndex: 2,
        justifyContent: 'center',
    },
    bannerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bannerSubtitle: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 12,
    },
    bannerButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    bannerButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    bannerImage: {
        position: 'absolute',
        right: -20,
        bottom: -20,
        width: 150,
        height: 150,
        opacity: 0.8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    seeAll: {
        fontSize: 12,
        fontWeight: '600',
    },
    ongoingOrderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginBottom: 8,
    },
    orderImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#f0f0f0',
    },
    orderInfo: {
        flex: 1,
    },
    orderDetail: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    locationBadge: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#FFFBE6',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});
