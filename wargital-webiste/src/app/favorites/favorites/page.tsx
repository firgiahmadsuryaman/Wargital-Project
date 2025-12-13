
'use client';

import { useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MenuItemCard from '@/components/menu-item-card';
import type { MenuItem } from '@/lib/types';
import { fetchRestaurants } from '@/lib/data';
import { useFavorites } from '@/context/favorites-context';

