import { StyleSheet, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type IconName = keyof typeof Ionicons.glyphMap;

interface MenuItemProps {
    icon: IconName;
    label: string;
    onPress?: () => void;
    color?: string;
    showChevron?: boolean;
}

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

    const handleComingSoon = (feature: string) => {
        Alert.alert('Info', `Fitur ${feature} akan segera hadir!`);
    };

    const MenuItem = ({ icon, label, onPress, color, showChevron = true }: MenuItemProps) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: color ? `${color}15` : theme.background }]}>
                <Ionicons name={icon} size={20} color={color || theme.text} />
            </View>
            <ThemedText style={[styles.menuText, color && { color }]}>{label}</ThemedText>
            {showChevron && <Ionicons name="chevron-forward" size={20} color="#ccc" />}
        </TouchableOpacity>
    );

    if (!user) {
        return (
            <ThemedView style={styles.container}>
                <View style={styles.center}>
                    <ThemedText style={styles.message}>Silakan masuk untuk melihat profil Anda.</ThemedText>
                    <TouchableOpacity
                        style={[styles.loginButton, { backgroundColor: theme.primary }]}
                        onPress={() => router.push('/auth/login')}
                    >
                        <ThemedText style={styles.loginButtonText}>Masuk / Daftar</ThemedText>
                    </TouchableOpacity>
                </View>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header Section */}
                <View style={styles.header}>
                    <View style={[styles.avatar, { borderColor: theme.primary }]}>
                        <ThemedText style={styles.avatarText}>
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                        </ThemedText>
                    </View>
                    <View style={styles.userInfo}>
                        <ThemedText type="title" style={styles.name}>Warga Digital</ThemedText>
                        <ThemedText style={styles.email}>{user.email}</ThemedText>
                        <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                            <Ionicons name="star" size={12} color="#fff" />
                            <ThemedText style={styles.badgeText}>Foodie Member</ThemedText>
                        </View>
                    </View>
                </View>

                {/* Account Section */}
                <View style={styles.sectionHeader}>
                    <ThemedText type="subtitle">Akun & Keamanan</ThemedText>
                </View>
                <View style={styles.sectionCard}>
                    <MenuItem icon="person-outline" label="Edit Profil" onPress={() => router.push('/profile/edit')} />
                    <View style={styles.divider} />
                    <MenuItem icon="map-outline" label="Alamat Tersimpan" onPress={() => router.push('/profile/address')} />
                    <View style={styles.divider} />
                    <MenuItem icon="card-outline" label="Metode Pembayaran" onPress={() => handleComingSoon('Pembayaran')} />
                </View>

                {/* Activity Section */}
                <View style={styles.sectionHeader}>
                    <ThemedText type="subtitle">Aktivitas</ThemedText>
                </View>
                <View style={styles.sectionCard}>
                    <MenuItem icon="receipt-outline" label="Riwayat Pesanan" onPress={() => router.push('/(tabs)/orders')} />
                    <View style={styles.divider} />
                    <MenuItem icon="ticket-outline" label="Voucher Saya" onPress={() => handleComingSoon('Voucher')} />
                    <View style={styles.divider} />
                    <MenuItem icon="heart-outline" label="Restoran Favorit" onPress={() => router.push('/(tabs)/favorites')} />
                </View>

                {/* General Info Section */}
                <View style={styles.sectionHeader}>
                    <ThemedText type="subtitle">Info Lainnya</ThemedText>
                </View>
                <View style={styles.sectionCard}>
                    <MenuItem icon="help-circle-outline" label="Pusat Bantuan" onPress={() => handleComingSoon('Bantuan')} />
                    <View style={styles.divider} />
                    <MenuItem icon="language-outline" label="Pengaturan Bahasa" onPress={() => handleComingSoon('Bahasa')} />
                    <View style={styles.divider} />
                    <MenuItem icon="document-text-outline" label="Syarat & Ketentuan" onPress={() => handleComingSoon('Syarat & Ketentuan')} />
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                    <ThemedText style={styles.logoutText}>Keluar</ThemedText>
                </TouchableOpacity>

                <ThemedText style={styles.versionText}>Versi Aplikasi 1.0.0</ThemedText>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
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
    loginButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 10,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FFFBE6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        marginRight: 16,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#C0772C',
    },
    userInfo: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        gap: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    sectionHeader: {
        marginBottom: 12,
        marginTop: 8,
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: '#f5f5f5',
    },
    menuText: {
        flex: 1,
        fontSize: 15,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginLeft: 56, // indent to align with text
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF5F5',
        padding: 16,
        borderRadius: 16,
        marginTop: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#FFE5E5',
    },
    logoutText: {
        color: '#FF3B30',
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 16,
    },
    versionText: {
        textAlign: 'center',
        color: '#ccc',
        fontSize: 12,
        marginBottom: 20,
    },
});
