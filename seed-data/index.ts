import { products } from './data';
import { PrismaClient } from '@prisma/client'

export const insertSeedData = async () => {
    const prisma = new PrismaClient();

    console.log(`🌱 Inserting Seed Data: ${products.length} Products`);
    for (const product of products) {
        console.log(`  🛍️ Adding Product: ${product.name}`);
        const { id } = await prisma.productImage.create({ data: { image: product.photo, altText: product.description } })
        await prisma.product.create({
            data: {
                ...product,
                photo: {
                    connect: {
                        id,
                    },
                },
            },
        });
    };
    console.log(`✅ Seed Data Inserted: ${products.length} Products`);
    console.log(`👋 Please start the process with \`yarn dev\` or \`npm run dev\``);
    process.exit();
}