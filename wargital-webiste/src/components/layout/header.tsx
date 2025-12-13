'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ShoppingCart, User as UserIcon, LogOut, Heart, Menu } from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/cart-context';
import { CartSheet } from '@/components/cart-sheet';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarImage } from '@/lib/images';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

// Daftar navigasi utama
const navLinks = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/orders', label: 'Pesanan', icon: Package },
  { href: '/favorites', label: 'Favorit', icon: Heart },
];

// Komponen header aplikasi
export default function Header() {
     const pathname = usePathname();
     const { itemCount } = useCart();

     const { user, isUserLoading, logout } = useAuth();
     const handleSignOut = () => logout();

     // Mengambil inisial user dari email
     const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">

        {/* Menu hamburger untuk mobile */}
        <div className="md:hidden flex-none">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Buka Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col h-full">
                <SheetClose asChild>
                  <Link href="/" className="mb-6 flex items-center gap-2">
                    <Logo />
                    <span className="font-bold">Wargital</span>
                  </Link>
                </SheetClose>

                {/* Navigasi mobile */}
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          'flex items-center gap-3 rounded-md p-2 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                          pathname === link.href
                            ? 'bg-accent text-accent-foreground'
                            : 'text-foreground/70'
                        )}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo & navigasi desktop */}
        <Link href="/" className="hidden md:flex items-center gap-2 mr-6">
          <Logo />
          <span className="hidden font-bold sm:inline-block">Wargital</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === link.href
                  ? 'text-foreground font-semibold'
                  : 'text-foreground/60'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logo tengah untuk mobile */}
        <div className="flex-1 md:hidden flex justify-center">
          <Link href="/" className="flex items-center gap-2 -ml-10">
            <Logo />
            <span className="font-bold">Wargital</span>
          </Link>
        </div>

        {/* Area kanan header (cart & user) */}
        <div className="flex items-center gap-2 md:gap-4 md:ml-auto flex-none">
          <CartSheet>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Buka Keranjang</span>
            </Button>
          </CartSheet>

          {/* Status user */}
          {isUserLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div> // Loading user
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={getAvatarImage('default-avatar.jpg')}
                      alt={user.email ?? 'User'}
                    />
                    <AvatarFallback>
                      {getInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              {/* Menu dropdown user */}
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Profil</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profil Saya</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="hidden md:flex">
              <Link href="/login">Masuk</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}