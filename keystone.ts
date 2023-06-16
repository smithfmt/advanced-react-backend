import "dotenv/config";
import { config } from "@keystone-6/core";
import { User } from "./schemas/User";
import { Product } from "./schemas/Product";
import { ProductImage } from "./schemas/ProductImage";
import { insertSeedData } from "./seed-data";
import { CartItem } from "./schemas/CartItem";
import extendGraphqlSchema from "./mutations";
import { withAuth, session } from "./auth";
import { OrderItem } from "./schemas/OrderItem";
import { Order } from "./schemas/Order";
const databaseURL = process.env.DATABASE_URL || "mongodb://localhost/keystone-sick-fits-tutorial";

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
        OrderItem,
        Order,
    },
    extendGraphqlSchema,
    ui: {
        // show ui only for people who pass the test
        isAccessAllowed: ({ session }) => {
            return session?.data;
        },
    },
    session: session,
}));