import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: 'Pesanan Saya', headerShadowVisible: false, headerStyle: { backgroundColor: theme.background } }} />

      <View style={styles.header}>
        <ThemedText type="subtitle">Pesanan Saya</ThemedText>
      </View>

      {loading && !refreshing && <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />}

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={!loading ? <ThemedText style={{ textAlign: 'center', marginTop: 20 }}>Belum ada pesanan.</ThemedText> : null}
        renderItem={({ item }) => {
          const statusColor = mapStatusColor(item.status);
          const progress = getProgress(item.status);
          const itemsText = item.orderItems.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ');

          return (
            <View style={[styles.card, { backgroundColor: '#fff' }]}>
              <View style={styles.cardHeader}>
                <View>
                  <ThemedText style={styles.restaurantName}>{item.restaurant?.name || 'Restoran'}</ThemedText>
                  <ThemedText style={styles.orderId}>ID Pesanan: {item.id.slice(0, 8)}...</ThemedText>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <ThemedText style={styles.statusText}>{item.status}</ThemedText>
                </View>
              </View>

              <View style={styles.itemsSection}>
                <ThemedText style={styles.itemLabel}>Item:</ThemedText>
                <ThemedText style={styles.itemText} numberOfLines={2}>{itemsText}</ThemedText>
              </View>

              {/* Progress Bar Simulation */}
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: theme.primary }]} />
              </View>
              <View style={styles.progressLabels}>
                <ThemedText style={styles.progressLabel}>Dibuat</ThemedText>
                <ThemedText style={styles.progressLabel}>Dapur</ThemedText>
                <ThemedText style={styles.progressLabel}>Kirim</ThemedText>
                <ThemedText style={styles.progressLabel}>Sampai</ThemedText>
              </View>

              <View style={styles.cardFooter}>
                <View>
                  <ThemedText style={styles.dateLabel}>{formatDate(item.orderDate)}</ThemedText>
                </View>
                <View>
                  <ThemedText style={styles.totalLabel}>Total:</ThemedText>
                  <ThemedText style={[styles.totalAmount, { color: theme.primary }]}>Rp {item.total.toLocaleString('id-ID')}</ThemedText>
                </View>
              </View>
            </View>
          );
        }}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  restaurantName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  orderId: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  itemsSection: {
    marginBottom: 16,
  },
  itemLabel: {
    fontSize: 12,
    color: '#666',
  },
  itemText: {
    fontSize: 14,
    marginTop: 2,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 9,
    color: '#888',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#f9f9f9',
    marginHorizontal: -16,
    marginBottom: -16,
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    maxWidth: 150,
  },
  totalLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
