import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// Skema validasi payload order
const orderSchema = z.object({
  restaurantId: z.string(),
  userId: z.string().optional(),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
});