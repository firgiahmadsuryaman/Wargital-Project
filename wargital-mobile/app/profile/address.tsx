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