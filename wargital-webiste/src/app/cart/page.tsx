
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


