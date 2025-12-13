
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };
  
  if (!isUserLoading && !user) {
    router.push('/login');
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)]">
        <ShoppingCart className="h-24 w-24 text-muted-foreground" />
        <h1 className="mt-6 text-3xl font-bold">Keranjang Anda Kosong</h1>
        <p className="mt-2 text-muted-foreground">Sepertinya Anda belum menambahkan apa pun ke keranjang Anda.</p>
        <Button asChild className="mt-6">
          <Link href="/">Kembali ke Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Tinjau Pesanan Anda</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Isi Keranjang</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {cartItems.map((item) => {
                const imageUrl = item.image || FALLBACK_IMAGES.food;
                return (
                <div key={item.id} className="flex items-center gap-4 py-4">
                  <Image
                    src={imageUrl}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="w-24 text-right font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Pengiriman</span>
                <span>{formatPrice(5000)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(cartTotal + 5000)}</span>
              </div>
            </CardContent>
            <CardFooter>
            <Button className="w-full" onClick={handlePlaceOrder} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Membuat Pesanan...' : 'Buat Pesanan'}
            </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
