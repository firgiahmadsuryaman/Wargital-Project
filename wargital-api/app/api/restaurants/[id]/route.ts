import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Tipe parameter route (dynamic route)
type Params = {
  params: {
    id: string;
  };
};