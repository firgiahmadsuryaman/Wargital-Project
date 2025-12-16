import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Restaurant } from '@/types';
import { ThemedText } from '@/components/themed-text';

interface RestaurantCardProps {
    restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
    return (
        <Link href={`/restaurant/${restaurant.id}`} asChild>
            <TouchableOpacity style={styles.card}>
                <Image
                    source={restaurant.image ? { uri: restaurant.image } : require('@/assets/images/food/nasi-goreng.png')} // Fallback image
                    style={styles.image}
                    contentFit="cover"
                    transition={1000}
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
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
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
});
