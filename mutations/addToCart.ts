import { graphql } from "@keystone-6/core";
import { Context } from '.keystone/types';
import { Session } from "../types";

const addToCart = (base: graphql.BaseSchemaMeta) => graphql.field({
    type: base.object('CartItem'),
    args: { productId: graphql.arg({ type: graphql.nonNull(graphql.ID) }) },
    async resolve(source, { productId }, context: Context) {
        console.log(source)
        const sesh = context.session as Session;
        console.log({ sesh }, Object.keys(context))
        if (!sesh?.itemId) {
            console.log("THROWING ERROR")
            throw new Error("You must be logged in to do this");
        };
        // query current users cart
        const allCartItems = await context.prisma.cartItem.findMany({
            where: {
                user: { id: sesh.itemId },
                product: { id: productId },
            },
        });
        const [existingCartItem] = allCartItems;
        // check if item is already in cart
        if (existingCartItem) {
            console.log(`There are already ${existingCartItem.quantity}, increment by 1`);
            return await context.prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity ? existingCartItem.quantity + 1 : 2 }
            });
        };
        // add to cart
        return await context.prisma.cartItem.create({
            data: {
                product: { connect: { id: productId } },
                user: { connect: { id: sesh.itemId } },
            },
        });
    },
});

export default addToCart;









// import { KeystoneContext } from "@keystone-6/core/types";
// import { } from "graphql-modules"
// import { Session } from "../types";

// const addToCart = async (root: any, { productId }: { productId: string }, context: any) => {
//     // query user
//     const sesh = await context.req.user;
//     console.log({ sesh }, Object.keys(context.req))
//     console.log("STRAT", context.sessionStrategy?.get)
//     const testSesh = await context.sessionStrategy?.get({ context })
//     console.log({ testSesh })
//     if (!sesh?.itemId) {
//         console.log("THROWING ERROR")
//         throw new Error("You must be logged in to do this");
//     };
//     // query current users cart
//     const allCartItems = await context.prisma.CartItem.findMany({
//         where: {
//             user: { id: sesh.itemId },
//             product: { id: productId },
//         },
//         resolveField: "id,quantity",
//     });
//     const [existingCartItem] = allCartItems;
//     // check if item is already in cart
//     if (existingCartItem) {
//         console.log(`There are already ${existingCartItem.quantity}, increment by 1`);
//         return await context.prisma.CartItem.update({
//             id: existingCartItem.id,
//             data: { quantity: existingCartItem.quantity + 1 }
//         });
//     };
//     // add to cart
//     return await context.prisma.CartItem.create({
//         data: {
//             product: { connect: { id: productId } },
//             user: { connect: { id: sesh.itemId } },
//         },
//     });
// };

// export default addToCart;