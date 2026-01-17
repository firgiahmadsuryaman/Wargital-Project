import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import api from '@/services/api';

export default function EditProfileScreen() {
    const { user, updateUser } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/user/profile');
            const userData = response.data;
            setName(userData.name || '');
            setPhone(userData.phone || '');
            setEmail(userData.email || '');
            // Update context if needed, but data from inputs is separate
        } catch (error) {
            console.error('Failed to fetch profile', error);
            Alert.alert('Error', 'Gagal mengambil data profil');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Peringatan', 'Nama lengkap tidak boleh kosong');
            return;
        }

        try {
            setIsSaving(true);
            const response = await api.put('/user/profile', {
                name,
                phone,
            });

            // Update local user context
            await updateUser({
                ...user!, // Keep existing fields like id
                ...response.data, // Overwrite with new data
            });

            Alert.alert('Sukses', 'Profil berhasil diperbarui!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.error('Failed to update profile', error);
            const message = error.response?.data?.message || 'Gagal memperbarui profil';
            Alert.alert('Error', message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <ThemedView style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Edit Profil', headerBackTitle: 'Kembali' }} />

            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.avatarContainer}>
                    <View style={[styles.avatar, { borderColor: theme.primary }]}>
                        <ThemedText style={styles.avatarText}>
                            {email.charAt(0).toUpperCase()}
                        </ThemedText>
                        <TouchableOpacity style={[styles.editBadge, { backgroundColor: theme.primary }]}>
                            <Ionicons name="camera" size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Nama Lengkap</ThemedText>
                        <TextInput
                            style={[styles.input, { borderColor: '#e5e5e5', color: theme.text }]}
                            value={name}
                            onChangeText={setName}
                            placeholder="Masukkan nama lengkap"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Email</ThemedText>
                        <TextInput
                            style={[styles.input, { borderColor: '#e5e5e5', color: '#999', backgroundColor: '#f5f5f5' }]}
                            value={email}
                            editable={false}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Nomor Telepon</ThemedText>
                        <TextInput
                            style={[styles.input, { borderColor: '#e5e5e5', color: theme.text }]}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            placeholder="Masukkan nomor telepon"
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: theme.primary, opacity: isSaving ? 0.7 : 1 }]}
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <ThemedText style={styles.saveButtonText}>Simpan Perubahan</ThemedText>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </ThemedView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFFBE6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        position: 'relative',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#C0772C',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },

    form: {
        gap: 20,
        marginBottom: 32,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    saveButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        height: 54, // Fixed height to prevent layout jump
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});