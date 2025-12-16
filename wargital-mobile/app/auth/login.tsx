import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';

export default function LoginScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { signIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Mohon isi email dan kata sandi');
            return;
        }

        try {
            setLoading(true);
            const data = await authService.login(email, password);
            await signIn(data.token, data.user);
            router.replace('/(tabs)');
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Gagal masuk. Periksa koneksi Anda.';
            Alert.alert('Login Gagal', msg);
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
                    <ThemedText type="title" style={styles.title}>Masuk</ThemedText>
                    <View style={styles.subtitleRow}>
                        <ThemedText style={styles.subtitle}>Belum punya akun? </ThemedText>
                        <TouchableOpacity onPress={() => router.push('/auth/register')}>
                            <ThemedText style={styles.link}>Daftar di sini</ThemedText>
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
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Masuk</ThemedText>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitleRow: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    subtitle: {
        color: '#666',
    },
    link: {
        color: '#C0772C',
        fontWeight: 'bold',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        height: 48,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    button: {
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
