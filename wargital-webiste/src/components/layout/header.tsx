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
  };