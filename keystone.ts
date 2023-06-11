import "dotenv/config";
import { config } from "@keystone-6/core";
import { User } from "./schemas/User";
import { createAuth } from "@keystone-6/auth";
import { statelessSessions } from "@keystone-6/core/session";
import { Product } from "./schemas/Product";
import { ProductImage } from "./schemas/ProductImage"
    ;
import { insertSeedData } from "./seed-data";
const databaseURL = process.env.DATABASE_URL || "mongodb://localhost/keystone-sick-fits-tutorial";

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360,
    secret: process.env.COOKIE_SECRET || "",
};

const { withAuth } = createAuth({
    listKey: "User",
    identityField: "email",
    secretField: "password",
    initFirstItem: {
        fields: ["name", "email", "password"],
        // Add initial Roles
    }
});

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
    },
    ui: {
        // show ui only for people who pass the test
        isAccessAllowed: ({ session }) => {
            return session?.data;
        },
    },
    session: statelessSessions(sessionConfig),
}));