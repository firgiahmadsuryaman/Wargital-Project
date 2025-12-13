
"use client";

import Image from 'next/image';
import { PlusCircle, Heart } from 'lucide-react';
import type { MenuItem } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/context/favorites-context';
import { useAuth } from '@/context/auth-context';
import { FALLBACK_IMAGES } from '@/lib/images';

type MenuItemCardProps = {
  item: MenuItem;
};

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart(item);
    toast({
      title: "Ditambahkan ke keranjang",
      description: `${item.name} telah ditambahkan ke keranjang Anda.`,
    });
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Harus Masuk",
        description: "Silakan masuk untuk menambahkan favorit.",
      });
      router.push('/login');
      return;
    }

    const currentlyFavorite = isFavorite(item.id);
    toggleFavorite(item.id);
    toast({
      title: currentlyFavorite ? "Dihapus dari Favorit" : "Ditambahkan ke Favorit",
      description: `${item.name} ${currentlyFavorite ? 'dihapus dari' : 'ditambahkan ke'} favorit Anda.`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const imageUrl = item.image || FALLBACK_IMAGES.food;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow hover:shadow-lg">
       <CardHeader className="p-0 relative">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={item.imageHint}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/70 hover:bg-background"
          onClick={handleToggleFavorite}
        >
          <Heart className={cn("h-5 w-5", isFavorite(item.id) ? "text-red-500 fill-red-500" : "text-foreground/80")} />
        </Button>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-bold font-headline">{item.name}</CardTitle>
        <CardDescription className="mt-1 text-sm h-10 overflow-hidden text-ellipsis">{item.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto flex justify-between items-center">
        <p className="text-lg font-semibold text-primary">{formatPrice(item.price)}</p>
        <Button onClick={handleAddToCart} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah
        </Button>
      </CardFooter>
    </Card>
  );
}
