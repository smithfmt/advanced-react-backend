import { Context } from '.keystone/types';

const addToCart = async (root:any, { productId }: {productId: string}, context:Context) => {
    const { session } = context;
    if (!session?.itemId) {
        throw new Error("You must be logged in to do this");
    };
    // query current users cart
    const allCartItems = await context.prisma.cartItem.findMany({
        where: {
            user: { id: session.itemId },
            product: { id: productId },
        },
    });
    const [existingCartItem] = allCartItems;
    // check if item is already in cart
    if (existingCartItem) {
        return await context.prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: { quantity: existingCartItem.quantity ? existingCartItem.quantity + 1 : 2 }
        });
    };
    // add to cart
    return await context.prisma.cartItem.create({
        data: {
            product: { connect: { id: productId } },
            user: { connect: { id: session.itemId } },
        },
    });
};

export default addToCart;