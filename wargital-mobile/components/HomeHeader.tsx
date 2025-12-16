import React, { forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
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
                                <RestaurantCard restaurant={item} />
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

