import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Clean existing data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.restaurant.deleteMany();

    // Create Restaurant
    const restaurant = await prisma.restaurant.create({
        data: {
            name: 'Wargital',
            description: 'Masakan rumahan otentik dengan cita rasa nusantara.',
            distance: '1.2 km',
            image: '/images/hero-1.jpg', // Assuming this path or similar exists in frontend public
            imageHint: 'Masakan Indonesia',
            menuItems: {
                create: [
                    {
                        name: 'Nasi Goreng Spesial',
                        description: 'Nasi goreng dengan telur, ayam, dan kerupuk.',
                        price: 25000,
                        image: '/images/nasi-goreng.jpg',
                        imageHint: 'Nasi Goreng',
                    },
                    {
                        name: 'Mie Ayam Bakso',
                        description: 'Mie ayam kenyal dengan bakso sapi asli.',
                        price: 20000,
                        image: '/images/mie-ayam.jpg',
                        imageHint: 'Mie Ayam',
                    },
                    {
                        name: 'Sate Ayam Madura',
                        description: 'Sate ayam dengan bumbu kacang khas Madura.',
                        price: 30000,
                        image: '/images/sate-ayam.jpg',
                        imageHint: 'Sate Ayam',
                    },
                    {
                        name: 'Es Teh Manis',
                        description: 'Minuman penyegar dahaga.',
                        price: 5000,
                        image: '/images/es-teh.jpg',
                        imageHint: 'Es Teh',
                    },
                ],
            },
        },
    });

    console.log({ restaurant });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
