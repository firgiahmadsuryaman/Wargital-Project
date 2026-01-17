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

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 bg-gray-50/50 min-h-screen">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <Button variant="ghost" asChild className="gap-2 pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-primary">
                        <Link href="/profile">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Profil
                        </Link>
                    </Button>
                    <h1 className="text-xl font-bold md:hidden">Metode Pembayaran</h1>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold hidden md:block">Metode Pembayaran</h1>
                        <p className="text-muted-foreground">Kelola kartu dan rekening bank Anda.</p>
                    </div>
                    <Button asChild className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                        <Link href="/profile/payment/add">
                            <Plus className="h-4 w-4" />
                            Tambah Baru
                        </Link>
                    </Button>
                </div>