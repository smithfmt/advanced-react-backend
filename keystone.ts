import "dotenv/config";
import { config } from "@keystone-6/core";
import { mergeSchemas } from '@graphql-tools/schema';
import { User } from "./schemas/User";
import { createAuth } from "@keystone-6/auth";
import { statelessSessions } from "@keystone-6/core/session";
import { Product } from "./schemas/Product";
import { ProductImage } from "./schemas/ProductImage";
import { insertSeedData } from "./seed-data";
import { sendPasswordResetEmail } from "./lib/mail";
import { CartItem } from "./schemas/CartItem";
import extendGraphqlSchema from "./mutations";
import { withAuth, session } from "./auth";
import { GraphQLSchema } from "graphql/type";
const databaseURL = process.env.DATABASE_URL || "mongodb://localhost/keystone-sick-fits-tutorial";

// const sessionConfig = {
//     maxAge: 60 * 60 * 24 * 360,
//     secret: process.env.COOKIE_SECRET || "",
// };

// const { withAuth } = createAuth({
//     listKey: "User",
//     identityField: "email",
//     secretField: "password",
//     initFirstItem: {
//         fields: ["name", "email", "password"],
//         // Add initial Roles
//     },
//     passwordResetLink: {
//         async sendToken(args) {
//             await sendPasswordResetEmail(args.token, args.identity);
//         },
//     },
// });

export default withAuth(config({
    server: {
        cors: {
            origin: [process.env.FRONTEND_URL || "http://localhost:7777"],
            credentials: true
        }
    },
    db: {
        provider: "postgresql",
        url: databaseURL,
        async onConnect() {
            if (process.argv.includes("--seed-data")) {
                await insertSeedData();
            };
        },
    },
    lists: {
        // Schema here
        User,
        Product,
        ProductImage,
        CartItem,
    },
    // extendGraphqlSchema,
    ui: {
        // show ui only for people who pass the test
        isAccessAllowed: ({ session }) => {
            return session?.data;
        },
    },
    session: session,
    extendGraphqlSchema: (schema: GraphQLSchema) => {
        return mergeSchemas({
            schemas: [schema],
            typeDefs: `
                type Mutation {
                    addToCart(productId: ID!): CartItem
                }
            `,
            resolvers: {
                Mutation: {
                    addToCart: (root, { productId }, context) => {
                        const { session } = context;
                        console.log(Object.keys(context.req))
                        console.log({ session, productId, client: context.req.client });
                        return { msg: "hi" };
                    }
                }
            }
        });
    },

}));