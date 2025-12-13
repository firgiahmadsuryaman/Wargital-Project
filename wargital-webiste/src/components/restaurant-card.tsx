
import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import type { Restaurant } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FALLBACK_IMAGES } from '@/lib/images';

type RestaurantCardProps = {
  restaurant: Restaurant;
};

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const imageUrl = restaurant.image || FALLBACK_IMAGES.restaurant;

  return (
    <Link href={`/restaurants/${restaurant.id}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-primary/20 group-hover:shadow-lg group-hover:border-primary/50">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={imageUrl}
              alt={`Foto dari ${restaurant.name}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={restaurant.imageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-xl font-bold font-headline">{restaurant.name}</CardTitle>
          <CardDescription className="mt-2 h-10 overflow-hidden text-ellipsis">
            {restaurant.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4 text-primary" />
            <span>{restaurant.distance}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
