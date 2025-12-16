import React, { useEffect, useState, useMemo, useRef } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Restaurant } from '@/types';
import { restaurantService } from '@/services/restaurantService';
import { MenuItemCard } from '@/components/MenuItemCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { HomeHeader } from '@/components/HomeHeader';

// Screen utama halaman Home
export default function HomeScreen() {
  const router = useRouter(); // Router untuk navigasi
  const searchInputRef = useRef<TextInput>(null); // Ref untuk fokus input search
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]); // State daftar restoran
  const [loading, setLoading] = useState(true); // State loading data
  const [searchQuery, setSearchQuery] = useState(''); // State query pencarian
  const colorScheme = useColorScheme(); // Ambil mode tema (light/dark)
  const theme = Colors[colorScheme ?? 'light']; // Ambil warna sesuai tema

  useEffect(() => {
    loadRestaurants();
  }, []); // Load data restoran saat screen pertama kali dibuka

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await restaurantService.getRestaurants();
      setRestaurants(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }; // Mengambil data restoran dari API

  // Filter restoran berdasarkan query pencarian
  const filteredRestaurants = useMemo(() => {
    if (!searchQuery) return restaurants;
    const lowerQuery = searchQuery.toLowerCase();
    return restaurants.filter(r =>
      r.name?.toLowerCase().includes(lowerQuery) ||
      r.menu?.some(m =>
        m.name?.toLowerCase().includes(lowerQuery) ||
        (m.description && m.description.toLowerCase().includes(lowerQuery))
      )
    );
  }, [restaurants, searchQuery]);

  // Menggabungkan dan memfilter semua menu item dari semua restoran
  const filteredMenuItems = useMemo(() => {
    const all = restaurants.flatMap(r =>
      (r.menu || []).map(m => ({ ...m, restaurantId: r.id }))
    );
    if (!searchQuery) return all;
    return all.filter(m =>
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [restaurants, searchQuery]);

  const handleBannerSearchPress = () => {
    searchInputRef.current?.focus();
  }; // Fokus ke input search saat banner ditekan

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={filteredMenuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MenuItemCard item={item} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <HomeHeader
            ref={searchInputRef}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            restaurants={filteredRestaurants}
            handleBannerSearchPress={handleBannerSearchPress}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <ThemedText style={{ textAlign: 'center', marginTop: 20 }}>
              Tidak ada menu ditemukan.
            </ThemedText>
          ) : null
        }

        {loading && (
          <View style={[styles.loadingOverlay, { backgroundColor: theme.background }]}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )} {/* Overlay loading */}
    </SafeAreaView>
  );
}

// Styling komponen
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

