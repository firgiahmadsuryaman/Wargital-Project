import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [name, setName] = useState('Warga Digital');
    const [phone, setPhone] = useState('081234567890');
    const [email, setEmail] = useState(user?.email || '');

    const handleSave = () => {
        Alert.alert('Sukses', 'Profil berhasil diperbarui!');
        router.back();
    };

    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Edit Profil', headerBackTitle: 'Kembali' }} />

            <ScrollView contentContainerStyle={styles.content}></ScrollView>

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
                style={[styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={handleSave}
            >
                <ThemedText style={styles.saveButtonText}>Simpan Perubahan</ThemedText>
            </TouchableOpacity>
        </ScrollView>
        </ThemedView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});