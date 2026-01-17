"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CreditCard, Save, Loader2, Wallet, Building2 } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';

export default function AddPaymentPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState('BANK_TRANSFER');

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network
            alert('Metode pembayaran berhasil ditambahkan (Simulasi)');
            router.push('/profile/payment');
        } catch (error) {
            console.error(error);
            alert('Gagal menambahkan metode pembayaran');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 bg-gray-50/50 min-h-screen">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <Button variant="ghost" asChild className="gap-2 pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-primary">
                        <Link href="/profile/payment">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                    <h1 className="text-xl font-bold md:hidden">Tambah Metode</h1>
                </div>

                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-2xl font-bold text-gray-900">Tambah Metode Pembayaran</h1>
                    <p className="text-muted-foreground mt-1">Tambahkan rekening bank atau e-wallet baru.</p>
                </div>