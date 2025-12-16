import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { TouchableOpacity } from 'react-native';

interface OrderItem {
  id: string;
  quantity: number;
  menuItem: {
    name: string;
  };
}

interface Order {
  id: string;
  status: string;
  total: number;
  orderDate: string;
  restaurant: { name: string };
  orderItems: OrderItem[];
}

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/order'); // Check if API endpoint is singular or plural. File was /order/route.ts so '/order'
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const mapStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('terkirim') || s.includes('selesai')) return '#6E8048'; // Green
    if (s.includes('batal')) return 'red';
    return '#D97706'; // Orange (Pending/In Progress)
  };

  const getProgress = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('dibuat')) return 0.25;
    if (s.includes('dapur')) return 0.5;
    if (s.includes('perjalanan') || s.includes('pengiriman')) return 0.75;
    if (s.includes('terkirim') || s.includes('selesai')) return 1.0;
    return 0.1;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ThemedText style={{ marginBottom: 16 }}>Silakan masuk untuk melihat pesanan Anda.</ThemedText>
        <TouchableOpacity
          style={{ backgroundColor: theme.primary, padding: 10, borderRadius: 8 }}
          onPress={() => router.push('/auth/login')}
        >
          <ThemedText style={{ color: '#fff' }}>Masuk</ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }


