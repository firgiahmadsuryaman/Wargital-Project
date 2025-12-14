/**
 * Utility functions untuk mengakses gambar dari folder public/images
 * 
 * Usage:
 * - getImageUrl('food/nasi-goreng.jpg') → '/images/food/nasi-goreng.jpg'
 * - getHeroImage('hero-1.jpg') → '/images/hero/hero-1.jpg'
 */

/**
 * Mendapatkan URL lengkap untuk gambar dari folder public/images
 * @param path - Path relatif dari folder images (contoh: 'food/nasi-goreng.jpg')
 * @returns URL lengkap untuk digunakan di Next.js Image component
 */
export function getImageUrl(path: string): string {
  // Pastikan path dimulai dengan /images/
  if (path.startsWith('/images/')) {
    return path;
  }
  // Jika path tidak dimulai dengan /, tambahkan /images/
  if (!path.startsWith('/')) {
    return `/images/${path}`;
  }
  return path;
}

/**
 * Mendapatkan URL untuk gambar hero
 * @param filename - Nama file gambar (contoh: 'hero-1.jpg')
 * @returns URL lengkap
 */
export function getHeroImage(filename: string): string {
  return getImageUrl(`hero/${filename}`);
}

/**
 * Mendapatkan URL untuk gambar makanan
 * @param filename - Nama file gambar (contoh: 'nasi-goreng.jpg')
 * @returns URL lengkap
 */
export function getFoodImage(filename: string): string {
  return getImageUrl(`food/${filename}`);
}

/**
 * Mendapatkan URL untuk gambar restaurant
 * @param filename - Nama file gambar (contoh: 'restaurant-1.jpg')
 * @returns URL lengkap
 */
export function getRestaurantImage(filename: string): string {
  return getImageUrl(`restaurants/${filename}`);
}

/**
 * Mendapatkan URL untuk gambar avatar
 * @param filename - Nama file gambar (contoh: 'default-avatar.jpg')
 * @returns URL lengkap
 */
export function getAvatarImage(filename: string): string {
  return getImageUrl(`avatars/${filename}`);
}

/**
 * Mendapatkan URL untuk gambar icon
 * @param filename - Nama file gambar (contoh: 'logo.png')
 * @returns URL lengkap
 */
export function getIconImage(filename: string): string {
  return getImageUrl(`icons/${filename}`);
}


export const FALLBACK_IMAGES = {
  food: 'https://images.unsplash.com/photo-1546069901-ba9599b7e5a6?w=400&h=300&fit=crop',
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
  hero: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=600&fit=crop',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
} as const;


