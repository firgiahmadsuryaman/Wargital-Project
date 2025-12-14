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

// Mengambil JWT secret dari environment
const getJwtSecret = () => process.env.JWT_SECRET || 'dev-secret';

// Mengambil userId dari token Authorization
function getUserIdFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization'); 
  if (!authHeader?.startsWith('Bearer ')) {
    return null; // Tidak ada token
  }
  const token = authHeader.replace('Bearer ', ''); 
  try {
    const payload = jwt.verify(token, getJwtSecret()) as { sub: string }; 
    return payload.sub; 
  } catch {
    return null;
  }
}

// Handler GET untuk mengambil daftar order
export async function GET(request: Request) {
  const userId = getUserIdFromRequest(request); 
  
  const orders = await prisma.order.findMany({
    where: userId ? { userId } : undefined,
    include: {
      restaurant: true,
      orderItems: {
        include: { menuItem: true },
      },
    },
    orderBy: { orderDate: 'desc' },
  });

  return NextResponse.json(orders);
}

// Handler POST untuk membuat order baru
export async function POST(request: Request) {
  const json = await request.json(); 
  const parsed = orderSchema.safeParse(json); 

  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Payload tidak valid', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const userIdFromToken = getUserIdFromRequest(request); // Ambil userId dari token
  const { restaurantId, items, userId: userIdFromBody } = parsed.data; // Ambil data valid
  const userId = userIdFromToken || userIdFromBody; // Prioritaskan userId dari token

  // Ambil data menu item dari database
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: items.map((i) => i.menuItemId) } },
  }); 

  // Cek menu item yang tidak ditemukan
  const missing = items.filter(
    (item) => !menuItems.find((m: { id: string }) => m.id === item.menuItemId)
  ); 

  // Jika ada menu item yang tidak ada
  if (missing.length) {
    return NextResponse.json(
      { message: 'Beberapa item tidak ditemukan', missing },
      { status: 404 }
    ); 
  }

  // Hitung total harga order
  const total = items.reduce((sum, item) => {
    const menuItem = menuItems.find((m: { id: string; price: number }) => m.id === item.menuItemId)!;
    return sum + menuItem.price * item.quantity;
  }, 0); 

    const order = await prisma.order.create({
    data: {
      restaurantId,
      status: 'Dalam perjalanan',
      total,
      userId,
      orderItems: {
        create: items.map((item) => ({
          quantity: item.quantity,
          menuItemId: item.menuItemId,
        })),
      },
    },
    include: {
      restaurant: true,
      orderItems: { include: { menuItem: true } },
    },
  }); // Simpan order dan order items ke database

  // Return order yang berhasil dibuat
  return NextResponse.json(order, { status: 201 }); 
}