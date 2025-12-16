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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    message: {
        color: '#666',
        marginBottom: 8,
    },
    header: {
        alignItems: 'center',
        marginVertical: 32,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFBE6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#C0772C',
    },
    email: {
        fontSize: 18,
    },
    section: {
        backgroundColor: '#fff', // Or dynamic theme card bg
        borderRadius: 12,
        padding: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuText: {
        flex: 1,
        marginLeft: 16,
        fontSize: 16,
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
