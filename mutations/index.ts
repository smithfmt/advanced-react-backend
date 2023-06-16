import addToCart from "./addToCart";
import { GraphQLSchema } from "graphql";
import { mergeSchemas } from '@graphql-tools/schema';
import checkout from "./checkout";

const extendGraphqlSchema = (schema: GraphQLSchema) => {
    return mergeSchemas({
        schemas: [schema],
        typeDefs: `
            type Mutation {
                addToCart(productId: ID!): CartItem
                checkout(token: String!): Order
            }
        `,
        resolvers: {
            Mutation: {
                addToCart,
                checkout,
            },
        },
    });
};

export default extendGraphqlSchema;