import React, { useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { useCartStore } from '@/store/useCartStore';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

export default function CartScreen() {
    const router = useRouter();
    const { items, updateQuantity, removeItem, total, clearCart } = useCartStore();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCheckout = async () => {
        if (items.length === 0) return;

        if (!user) {
            Alert.alert('Info', 'Mohon masuk terlebih dahulu untuk memesan.', [
                { text: 'Batal', style: 'cancel' },
                { text: 'Masuk', onPress: () => router.push('/auth/login') }
            ]);
            return;
        }

        // Group items by Restaurant? API supports ONE restaurant per order.
        // Check if multiple restaurants
        const restaurantIds = new Set(items.map(i => i.restaurantId));
        if (restaurantIds.size > 1) {
            Alert.alert('Info', 'Mohon pesan dari satu restoran saja dalam satu waktu.');
            return;
        }

        const restaurantId = items[0].restaurantId;
        const payload = {
            restaurantId,
            items: items.map(item => ({
                menuItemId: item.id,
                quantity: item.quantity
            }))
        };

        setIsSubmitting(true);
        try {
            await api.post('/order', payload);
            Alert.alert('Berhasil', 'Pesanan Anda telah dibuat!', [
                {
                    text: 'OK',
                    onPress: () => {
                        clearCart();
                        router.dismissTo('/');
                        router.push('/(tabs)/orders'); // Navigate to orders tab
                    },
                },
            ]);
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Gagal membuat pesanan.';
            Alert.alert('Gagal', msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ title: 'Keranjang', presentation: 'modal' }} />
                <View style={styles.emptyState}>
                    <Ionicons name="cart-outline" size={64} color="#ccc" />
                    <ThemedText style={styles.emptyText}>Keranjang Anda kosong</ThemedText>
                    <TouchableOpacity style={styles.browseButton} onPress={() => router.back()}>
                        <ThemedText style={styles.browseButtonText}>Cari Makanan</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Keranjang', presentation: 'modal' }} />
            <StatusBar style="light" />

            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Image
                            source={item.image ? { uri: item.image } : require('@/assets/images/food/nasi-goreng.png')}
                            style={styles.itemImage}
                            contentFit="cover"
                        />
                        <View style={styles.itemInfo}>
                            <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                            <ThemedText style={styles.price}>Rp {item.price.toLocaleString('id-ID')}</ThemedText>
                        </View>
                        <View style={styles.controls}>
                            <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                                <Ionicons name="remove-circle-outline" size={24} color="#C0772C" />
                            </TouchableOpacity>
                            <ThemedText style={styles.quantity}>{item.quantity}</ThemedText>
                            <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                                <Ionicons name="add-circle-outline" size={24} color="#C0772C" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <ThemedText type="subtitle">Total</ThemedText>
                    <ThemedText type="title">Rp {total().toLocaleString('id-ID')}</ThemedText>
                </View>
                <TouchableOpacity
                    style={[styles.checkoutButton, isSubmitting && styles.disabledButton]}
                    onPress={handleCheckout}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <ThemedText style={styles.checkoutText}>Pesan Sekarang</ThemedText>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    list: {
        padding: 16,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
    },
    browseButton: {
        padding: 12,
        backgroundColor: '#C0772C',
        borderRadius: 8,
    },
    browseButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
    },
    price: {
        color: '#C0772C',
        marginTop: 4,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    quantity: {
        fontSize: 16,
        fontWeight: 'bold',
        minWidth: 20,
        textAlign: 'center',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkoutButton: {
        backgroundColor: '#C0772C',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    checkoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
