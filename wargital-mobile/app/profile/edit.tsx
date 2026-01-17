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