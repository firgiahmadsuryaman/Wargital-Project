'use client';

import { useEffect, useState } from 'react';
import { Package, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import OrderStatusCard from '@/components/order-status-card';
import type { Order } from '@/lib/types';
import { useAuth } from '@/context/auth-context';

// Mock data untuk orders (dalam implementasi nyata, ini akan diambil dari API)
const mockOrders: Order[] = [
    {
        id: 'ORD-001',
        restaurantName: 'Wargital',
        items: [
            { id: '1', name: 'Nasi Goreng Spesial', price: 25000, quantity: 2, image: '' },
            { id: '2', name: 'Es Teh Manis', price: 5000, quantity: 2, image: '' },
        ],
        total: 60000,
        status: 'Menyiapkan',
        orderDate: new Date().toISOString(),
    },
];

export default function OrdersPage() {
    const { user, isUserLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            setIsLoading(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            // In real implementation, fetch from API based on user
            if (user) {
                setOrders(mockOrders);
            } else {
                setOrders([]);
            }
            setIsLoading(false);
        };

        if (!isUserLoading) {
            void loadOrders();
        }
    }, [user, isUserLoading]);

    if (isLoading || isUserLoading) {
        return (
            <div className="flex h-full min-h-[calc(100vh-10rem)] w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg p-12 min-h-[calc(100vh-20rem)]">
                    <Package className="h-24 w-24 text-muted-foreground" />
                    <h2 className="mt-6 text-2xl font-semibold">Masuk untuk Melihat Pesanan</h2>
                    <p className="mt-2 text-muted-foreground">
                        Silakan masuk untuk melihat riwayat pesanan Anda.
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/login">Masuk Sekarang</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            <h1 className="text-3xl font-bold mb-6 font-headline">Pesanan Saya</h1>
            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <OrderStatusCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg p-12 min-h-[calc(100vh-20rem)]">
                    <Package className="h-24 w-24 text-muted-foreground" />
                    <h2 className="mt-6 text-2xl font-semibold">Belum Ada Pesanan</h2>
                    <p className="mt-2 text-muted-foreground">
                        Anda belum memiliki pesanan. Pesan makanan favorit Anda sekarang!
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/">Pesan Sekarang</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
