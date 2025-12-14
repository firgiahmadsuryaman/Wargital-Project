const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');
    try {
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
                image: '/images/hero/hero-1.png',
                imageHint: 'Masakan Indonesia',
                menuItems: {
                    create: [
                        {
                            name: 'Nasi Goreng Spesial',
                            description: 'Nasi goreng dengan telur, ayam, dan kerupuk.',
                            price: 25000,
                            image: '/images/food/nasi-goreng.png',
                            imageHint: 'Nasi Goreng',
                        },
                        {
                            name: 'Mie Ayam Bakso',
                            description: 'Mie ayam kenyal dengan bakso sapi asli.',
                            price: 20000,
                            image: '/images/food/mie-ayam.png',
                            imageHint: 'Mie Ayam',
                        },
                        {
                            name: 'Sate Ayam Madura',
                            description: 'Sate ayam dengan bumbu kacang khas Madura.',
                            price: 30000,
                            image: '/images/food/sate-ayam.png',
                            imageHint: 'Sate Ayam',
                        },
                        {
                            name: 'Es Teh Manis',
                            description: 'Minuman penyegar dahaga.',
                            price: 5000,
                            image: '/images/food/es-teh.png',
                            imageHint: 'Es Teh',
                        },
                    ],
                },
            },
        });

        console.log('Seeding finished.');
        console.log({ restaurant });
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
