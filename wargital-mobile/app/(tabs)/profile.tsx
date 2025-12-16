import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar?', [
            { text: 'Batal', style: 'cancel' },
            { text: 'Keluar', style: 'destructive', onPress: signOut },
        ]);
    };

    if (!user) {
        return (
            <ThemedView style={styles.container}>
                <View style={styles.center}>
                    <ThemedText style={styles.message}>Silakan masuk untuk melihat profil Anda.</ThemedText>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }]}
                        onPress={() => router.push('/auth/login')}
                    >
                        <ThemedText style={styles.buttonText}>Masuk / Daftar</ThemedText>
                    </TouchableOpacity>
                </View>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.avatar, { borderColor: theme.primary }]}>
                    <ThemedText style={styles.avatarText}>{user.email.charAt(0).toUpperCase()}</ThemedText>
                </View>
                <ThemedText type="title" style={styles.email}>{user.email}</ThemedText>
            </View>

            <View style={styles.section}>
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="settings-outline" size={24} color={theme.text} />
                    <ThemedText style={styles.menuText}>Pengaturan</ThemedText>
                    <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="red" />
                    <ThemedText style={[styles.menuText, { color: 'red' }]}>Keluar</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

