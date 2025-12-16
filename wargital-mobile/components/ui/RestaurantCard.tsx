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


