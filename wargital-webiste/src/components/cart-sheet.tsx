
"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { FALLBACK_IMAGES } from "@/lib/images";

export function CartSheet({ children }: { children: React.ReactNode }) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, itemCount } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Keranjang Saya ({itemCount})</SheetTitle>
        </SheetHeader>
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4">
              <div className="flex flex-col gap-4 py-4">
                {cartItems.map((item) => {
                  const imageUrl = item.image || FALLBACK_IMAGES.food;
                  return (
                  <div key={item.id} className="flex items-start gap-4">
                    <Image
                      src={imageUrl}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      onClick={() => removeFromCart(item.id)}
                    >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                  );
                })}
            </div>
            </ScrollArea>
            <SheetFooter className="mt-auto">
                <div className="w-full space-y-4">
                    <Separator />
                    <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <SheetClose asChild>
                        <Button asChild className="w-full">
                            <Link href="/cart">Lanjut ke Checkout</Link>
                        </Button>
                    </SheetClose>
                </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-grow flex-col items-center justify-center gap-4 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Keranjang Anda kosong</h3>
            <p className="text-muted-foreground">Tambahkan item dari menu untuk memulai.</p>
            <SheetClose asChild>
              <Button asChild variant="outline">
                <Link href="/">Lanjutkan Belanja</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
