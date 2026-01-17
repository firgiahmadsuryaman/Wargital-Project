import { StyleSheet, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface Address {
    id: string;
    label: string;
    recipient: string;
    phone: string;
    fullAddress: string;
    isPrimary: boolean;
}

const DUMMY_ADDRESSES: Address[] = [
    {
        id: '1',
        label: 'Rumah',
        recipient: 'Warga Digital',
        phone: '081234567890',
        fullAddress: 'Jl. ZA. Pagar Alam No.93, Gedong Meneng, Kec. Rajabasa, Kota Bandar Lampung, Lampung 35142',
        isPrimary: true,
    },
    {
        id: '2',
        label: 'Kantor',
        recipient: 'Warga Digital',
        phone: '081234567890',
        fullAddress: 'Universitas Teknokrat Indonesia, Gedung A',
        isPrimary: false,
    },
];

export default function AddressScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [addresses, setAddresses] = useState<Address[]>(DUMMY_ADDRESSES);

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
                <TouchableOpacity>
                    <ThemedText style={[styles.editText, { color: theme.primary }]}>Ubah</ThemedText>
                </TouchableOpacity>
            </View>

            <ThemedText type="defaultSemiBold" style={styles.recipient}>{item.recipient}</ThemedText>
            <ThemedText style={styles.phone}>{item.phone}</ThemedText>
            <ThemedText style={styles.address}>{item.fullAddress}</ThemedText>

            {!item.isPrimary && (
                <TouchableOpacity style={styles.setPrimaryButton}>
                    <ThemedText style={styles.setPrimaryText}>Jadikan Alamat Utama</ThemedText>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Alamat Tersimpan', headerBackTitle: 'Kembali' }} />

            <FlatList
                data={addresses}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListFooterComponent={
                    <TouchableOpacity style={[styles.addButton, { borderColor: theme.primary }]}>
                        <Ionicons name="add" size={20} color={theme.primary} />
                        <ThemedText style={[styles.addButtonText, { color: theme.primary }]}>
                            Tambah Alamat Baru
                        </ThemedText>
                    </TouchableOpacity>
                }
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 20,
        gap: 16,
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
    },
    addButtonText: {
        fontWeight: '600',
        marginLeft: 8,
    },
});