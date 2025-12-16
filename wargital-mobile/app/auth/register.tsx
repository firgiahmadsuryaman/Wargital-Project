import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';

export default function RegisterScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { signIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Mohon isi email dan kata sandi');
            return;
        }

        try {
            setLoading(true);
            const data = await authService.register(email, password);
            await signIn(data.token, data.user);
            router.replace('/(tabs)');
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Registrasi Gagal.';
            Alert.alert('Gagal', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.background }]}
        >
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.formContainer}>
                    <ThemedText type="title" style={styles.title}>Daftar Akun Baru</ThemedText>
                    <View style={styles.subtitleRow}>
                        <ThemedText style={styles.subtitle}>Sudah punya akun? </ThemedText>
                        <TouchableOpacity onPress={() => router.back()}>
                            <ThemedText style={styles.link}>Masuk di sini</ThemedText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Email</ThemedText>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
                            placeholder="email@contoh.com"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Kata Sandi</ThemedText>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
                            placeholder="••••••••"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }, loading && styles.disabledButton]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Daftar</ThemedText>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


