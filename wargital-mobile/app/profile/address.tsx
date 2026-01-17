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

const DUMMY_ADDRESSES: Address[] = [
    {
        id: '1',
        label: 'Rumah',
        recipient: 'Warga Digital',
        phone: '081234567890',
        fullAddress: 'Jl. ZA. Pagar Alam No.93, Gedong Meneng, Kec. Rajabasa, Kota Bandar Lampung, Lampung 35142',
        isPrimary: true,
    },
    {
        id: '2',
        label: 'Kantor',
        recipient: 'Warga Digital',
        phone: '081234567890',
        fullAddress: 'Universitas Teknokrat Indonesia, Gedung A',
        isPrimary: false,
    },
];