import { StyleSheet, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface Address {
    id: string;
    label: string;
    recipient: string;
    phone: string;
    fullAddress: string;
    isPrimary: boolean;
}