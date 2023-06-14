import { graphql } from "@keystone-6/core";
import addToCart from "./addToCart";
import { GraphQLSchema } from "graphql";
import { mergeSchemas } from '@graphql-tools/schema';

// const extendGraphqlSchema = graphql.extend(base => {
//     return {
//         mutation: {
//             addToCart: addToCart(base),
//         },
//     };
// });

const extendGraphqlSchema = (schema: GraphQLSchema) => {
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
                    const { session, query } = context;
                    console.log({ session, productId, query });
                    return { msg: "hi" };
                }
            }
        }
    })
};

export default extendGraphqlSchema;