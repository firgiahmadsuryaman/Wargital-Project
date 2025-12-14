"use client";

import Image from 'next/image';
import { PlusCircle, Heart } from 'lucide-react';
import type { MenuItem } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
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
    <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative w-full h-44 overflow-hidden">
        <Image
          src={imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          data-ai-hint={item.imageHint}
        />
        <button
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm"
          onClick={handleToggleFavorite}
        >
          <Heart className={cn("h-4 w-4", isFavorite(item.id) ? "text-red-500 fill-red-500" : "text-gray-500")} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-base text-foreground mb-1">{item.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-grow">
          {item.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-primary font-bold text-base">{formatPrice(item.price)}</span>
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white rounded-md px-3 py-1 text-xs h-8"
          >
            <PlusCircle className="mr-1 h-3 w-3" />
            Tambah
          </Button>
        </div>
      </div>
    </div>
  );
}
