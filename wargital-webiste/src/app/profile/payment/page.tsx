"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CreditCard, Plus, Trash2, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PaymentMethodsPage() {
    const router = useRouter();

    // Dummy Data
    const dummyMethods = [
        {
            id: '1',
            type: 'BANK_TRANSFER',
            provider: 'BCA',
            accountNumber: '1234567890',
            accountName: 'Warga Digital',
            isPrimary: true,
        },
        {
            id: '2',
            type: 'E_WALLET',
            provider: 'GoPay',
            accountNumber: '081234567890',
            accountName: 'Warga Digital',
            isPrimary: false,
        },
    ];

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus metode pembayaran ini?')) {
            alert('Metode pembayaran berhasil dihapus (Simulasi)');
        }
    };