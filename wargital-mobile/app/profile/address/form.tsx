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
            <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Label Alamat <ThemedText style={styles.required}>*</ThemedText></ThemedText>
                <View style={styles.labelOptions}>
                    {['Rumah', 'Kantor', 'Kost', 'Apartemen'].map((opt) => (
                        <TouchableOpacity
                            key={opt}
                            style={[
                                styles.chip,
                                label === opt && { backgroundColor: theme.primary, borderColor: theme.primary }
                            ]}
                            onPress={() => setLabel(opt)}
                        >
                            <ThemedText style={[
                                styles.chipText,
                                label === opt && { color: '#fff' }
                            ]}>{opt}</ThemedText>
                        </TouchableOpacity>
                    ))}
                </View>
                <TextInput
                    style={[styles.input, { color: theme.text, borderColor: '#e5e5e5' }]}
                    value={label}
                    onChangeText={setLabel}
                    placeholder="Contoh: Rumah Nenek"
                    placeholderTextColor="#999"
                />
            </View>
            <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Nama Penerima <ThemedText style={styles.required}>*</ThemedText></ThemedText>
                <TextInput
                    style={[styles.input, { color: theme.text, borderColor: '#e5e5e5' }]}
                    value={recipient}
                    onChangeText={setRecipient}
                    placeholder="Nama lengkap penerima"
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.formGroup}>
                <ThemedText style={styles.label}>Nomor Telepon <ThemedText style={styles.required}>*</ThemedText></ThemedText>
                <TextInput
                    style={[styles.input, { color: theme.text, borderColor: '#e5e5e5' }]}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholder="Contoh: 081234567890"
                    placeholderTextColor="#999"
                />
            </View>