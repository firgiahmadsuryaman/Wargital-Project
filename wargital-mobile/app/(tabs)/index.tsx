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

