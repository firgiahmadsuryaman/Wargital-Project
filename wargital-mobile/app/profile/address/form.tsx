import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { addressService } from '@/services/addressService';
import { Address } from '@/types';
import { Ionicons } from '@expo/vector-icons';

export default function AddressFormScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    // Check if we are in edit mode
    const isEditMode = !!params.id;

    const [label, setLabel] = useState((params.label as string) || 'Rumah');
    const [recipient, setRecipient] = useState((params.recipient as string) || '');
    const [phone, setPhone] = useState((params.phone as string) || '');
    const [fullAddress, setFullAddress] = useState((params.fullAddress as string) || '');
    const [detail, setDetail] = useState((params.detail as string) || '');
    const [isPrimary, setIsPrimary] = useState(params.isPrimary === 'true');

    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!label || !recipient || !phone || !fullAddress) {
            Alert.alert('Eror', 'Mohon lengkapi semua field wajib');
            return;
        }

        try {
            setLoading(true);
            const data = {
                label,
                recipient,
                phone,
                fullAddress,
                detail,
                isPrimary
            };

            if (isEditMode) {
                await addressService.updateAddress(params.id as string, data);
                Alert.alert('Sukses', 'Alamat berhasil diperbarui');
            } else {
                await addressService.createAddress(data);
                Alert.alert('Sukses', 'Alamat berhasil ditambahkan');
            }
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan alamat');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen
                options={{
                    title: isEditMode ? 'Ubah Alamat' : 'Tambah Alamat',
                    headerBackTitle: 'Kembali'
                }}
            />

            <ScrollView contentContainerStyle={styles.content}></ScrollView>