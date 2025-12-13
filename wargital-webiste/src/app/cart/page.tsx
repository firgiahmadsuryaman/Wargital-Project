
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { createOrder, fetchRestaurants } from '@/lib/data';
import { FALLBACK_IMAGES } from '@/lib/images';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    const loadRestaurant = async () => {
      const restaurants = await fetchRestaurants();
      if (restaurants.length > 0) {
        setRestaurantId(restaurants[0].id);
      }
    };
    void loadRestaurant();
  }, []);

const handlePlaceOrder = async () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Anda harus masuk",
            description: "Silakan masuk untuk membuat pesanan.",
        });
        router.push('/login');
        return;
    }
    if (!restaurantId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Restoran tidak ditemukan. Silakan coba lagi.",
      });
      return;
    }
    try {
      setIsSubmitting(true);
      await createOrder({ restaurantId, items: cartItems, userId: user.id });
      toast({
        title: "Pesanan Dibuat!",
        description: "Makanan Anda sedang dalam perjalanan. Lacak di 'Pesanan Saya'.",
      });
      clearCart();
      router.push('/orders');
    } catch {
      toast({
        variant: "destructive",
        title: "Pesanan Gagal",
        description: "Terjadi kesalahan. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


