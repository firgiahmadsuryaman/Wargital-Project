import { StyleSheet, View, TouchableOpacity, FlatList, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { Address } from '@/types';
import { addressService } from '@/services/addressService';

export default function AddressScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadAddresses = async () => {
        try {
            const data = await addressService.getAddresses();
            setAddresses(data);
        } catch (error) {
            console.error(error);
            Alert.alert('Eror', 'Gagal memuat alamat');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadAddresses();
        }, [])
    );

    const handleRefresh = () => {
        setRefreshing(true);
        loadAddresses();
    };

    const handleDelete = (id: string) => {
        Alert.alert('Hapus Alamat', 'Yakin ingin menghapus alamat ini?', [
            { text: 'Batal', style: 'cancel' },
            {
                text: 'Hapus',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await addressService.deleteAddress(id);
                        loadAddresses();
                    } catch (error) {
                        Alert.alert('Gagal', 'Tidak dapat menghapus alamat');
                    }
                }
            }
        ]);
    };

    const handleEdit = (item: Address) => {
        // Pass data via params. Note that booleans/numbers become strings.
        router.push({
            pathname: '/profile/address/form',
            params: {
                id: item.id,
                label: item.label,
                recipient: item.recipient,
                phone: item.phone,
                fullAddress: item.fullAddress,
                detail: item.detail || '',
                isPrimary: item.isPrimary.toString()
            }
        });
    };

    const handleSetPrimary = async (item: Address) => {
        try {
            await addressService.updateAddress(item.id, { isPrimary: true });
            loadAddresses();
        } catch (error) {
            Alert.alert('Gagal', 'Gagal mengubah alamat utama');
        }
    };

    const renderItem = ({ item }: { item: Address }) => (
        <View style={styles.addressCard}>
            <View style={styles.cardHeader}>
                <View style={styles.labelContainer}>
                    <ThemedText style={styles.addressLabel}>{item.label}</ThemedText>
                    {item.isPrimary && (
                        <View style={[styles.primaryBadge, { backgroundColor: '#E8F5E9' }]}>
                            <ThemedText style={[styles.primaryText, { color: '#2E7D32' }]}>Utama</ThemedText>
                        </View>
                    )}
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
                        <ThemedText style={[styles.editText, { color: theme.primary }]}>Ubah</ThemedText>
                    </TouchableOpacity>
                    {!item.isPrimary && (
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
                            <Ionicons name="trash-outline" size={18} color="red" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ThemedText type="defaultSemiBold" style={styles.recipient}>{item.recipient}</ThemedText>
            <ThemedText style={styles.phone}>{item.phone}</ThemedText>
            <ThemedText style={styles.address}>{item.fullAddress} {item.detail ? `(${item.detail})` : ''}</ThemedText>

            {!item.isPrimary && (
                <TouchableOpacity style={styles.setPrimaryButton} onPress={() => handleSetPrimary(item)}>
                    <ThemedText style={styles.setPrimaryText}>Jadikan Alamat Utama</ThemedText>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Alamat Tersimpan', headerBackTitle: 'Kembali' }} />

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : (
                <FlatList
                    data={addresses}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="map-outline" size={48} color="#ccc" />
                            <ThemedText style={styles.emptyText}>Belum ada alamat tersimpan</ThemedText>
                        </View>
                    }
                    ListFooterComponent={
                        <TouchableOpacity
                            style={[styles.addButton, { borderColor: theme.primary }]}
                            onPress={() => router.push('/profile/address/form')}
                        >
                            <Ionicons name="add" size={20} color={theme.primary} />
                            <ThemedText style={[styles.addButtonText, { color: theme.primary }]}>
                                Tambah Alamat Baru
                            </ThemedText>
                        </TouchableOpacity>
                    }
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
        gap: 16,
        paddingBottom: 40,
    },
    addressCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    addressLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        textTransform: 'uppercase',
    },
    primaryBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    primaryText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    actionBtn: {
        padding: 4,
    },
    editText: {
        fontWeight: '600',
        fontSize: 14,
    },
    recipient: {
        fontSize: 16,
        marginBottom: 2,
    },
    phone: {
        color: '#666',
        marginBottom: 8,
    },
    address: {
        lineHeight: 20,
    },
    setPrimaryButton: {
        marginTop: 12,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    setPrimaryText: {
        fontSize: 12,
        color: '#666',
    },
    addButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        backgroundColor: '#f9f9f9',
        marginTop: 16,
    },
    addButtonText: {
        fontWeight: '600',
        marginLeft: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        marginTop: 12,
        color: '#999',
    },
});