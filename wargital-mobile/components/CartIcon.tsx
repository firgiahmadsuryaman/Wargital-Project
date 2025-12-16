import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/store/useCartStore';
import { ThemedText } from './themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function CartIcon() {
    const router = useRouter();
    const { items } = useCartStore();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <TouchableOpacity onPress={() => router.push('/cart')} style={styles.container}>
            <Ionicons name="cart-outline" size={26} color={theme.text} />
            {itemCount > 0 && (
                <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                    <ThemedText style={styles.badgeText}>{itemCount}</ThemedText>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
