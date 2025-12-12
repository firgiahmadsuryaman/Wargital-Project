import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

// Mengambil JWT secret dari environment
const getJwtSecret = () => process.env.JWT_SECRET || 'dev-secret';