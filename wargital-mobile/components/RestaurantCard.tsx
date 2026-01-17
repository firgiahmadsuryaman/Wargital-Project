import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Restaurant } from '@/types';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { favoriteService } from '@/services/favoriteService';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface RestaurantCardProps {
    restaurant: Restaurant;
    initialIsFavorite?: boolean;
    onToggleFavorite?: (isFav: boolean) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
    restaurant,
    initialIsFavorite = false,
    onToggleFavorite
}) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        try {
            setLoading(true);
            const newState = !isFavorite;

            if (newState) {
                await favoriteService.addFavorite(restaurant.id);
            } else {
                await favoriteService.removeFavorite(restaurant.id);
            }

            setIsFavorite(newState);
            if (onToggleFavorite) {
                onToggleFavorite(newState);
            }
        } catch (error) {
            Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan favorit');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Link href={`/restaurant/${restaurant.id}`} asChild>
                <TouchableOpacity style={styles.card} activeOpacity={0.9}>
                    <Image
                        source={restaurant.image ? { uri: restaurant.image } : require('@/assets/images/food/nasi-goreng.png')}
                        style={styles.image}
                        contentFit="cover"
                        transition={500}
                    />
                    <View style={styles.content}>
                        <ThemedText type="subtitle">{restaurant.name}</ThemedText>
                        <ThemedText numberOfLines={2} style={styles.description}>
                            {restaurant.description}
                        </ThemedText>
                        {restaurant.distance && (
                            <ThemedText style={styles.distance}>{restaurant.distance}</ThemedText>
                        )}
                    </View>
                </TouchableOpacity>
            </Link>

            <TouchableOpacity
                style={styles.favButton}
                onPress={handleToggle}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color={theme.primary} />
                ) : (
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={24}
                        color={isFavorite ? "red" : "#fff"}
                    />
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 150,
    },
    content: {
        padding: 12,
    },
    description: {
        color: '#666',
        marginTop: 4,
        fontSize: 14,
    },
    distance: {
        marginTop: 8,
        fontSize: 12,
        color: '#888',
    },
    favButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        elevation: 10, // Fix for Android clickability
    }
});
