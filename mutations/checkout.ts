import { Context } from '.keystone/types';
import stripeConfig from '../lib/Stripe';
const checkout = async (root:any, { token }: { token: string }, context:Context) => {
    // check if signed in
    const { session } = context;
    const userId = session.itemId
    if (!userId) {
        throw new Error("You must be logged in to do this");
    };
    const user = await context.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            cart: {
                select: {
                    id: true,
                    quantity: true,
                    product: {
                        select: {
                            name: true,
                            price: true,
                            description: true,
                            id: true,
                            photo: {
                                select: {
                                    id: true,
                                    image: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    if (!user) throw new Error("User not found");
    // calc total price
    const cartItems = user.cart.filter(cartItem => cartItem.product);
    if (!cartItems) throw new Error("no Cart Items");
    const amount = cartItems.reduce((acc, cur) => acc + cur.quantity! * cur.product!.price!, 0);
    // create the charge with the stripe library
    const charge = await stripeConfig.paymentIntents.create({
        amount,
        currency: "USD",
        confirm: true,
        payment_method: token,
    }).catch(err => {
        console.log(err);
        throw new Error(err.message);
    });
    console.log(charge)
    // convert cartitems to orderItems
    const orderItems = cartItems.map(cartItem => {
        return {
            name: cartItem.product!.name,
            description: cartItem.product!.description,
            price: cartItem.product!.price,
            quantity: cartItem.quantity,
            photo: { connect: { id: cartItem.product!.photo!.id } },
        };
    });
    // create the order and return it
    const order = await context.prisma.order.create({
        data: {
            total: charge.amount,
            charge: charge.id,
            items: { create: orderItems },
            user: { connect: { id: userId } },
        },
    });
    // clean up any old cart items
    const cartItemsIds = user.cart.map(cartItem => cartItem.id);
    await context.prisma.cartItem.deleteMany({
        where: {
            id: {
                in: cartItemsIds,
            },
        },
    });
    return order;
};

export default checkout;
