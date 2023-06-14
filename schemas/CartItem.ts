import { list } from "@keystone-6/core";
import { integer, relationship } from "@keystone-6/core/fields";
import { allowAll } from '@keystone-6/core/access';

export const CartItem = list({
    access: allowAll,
    ui: {
        listView: {
            initialColumns: ["product", "quantity", "user"],
        },
    },
    fields: {
        // Custom Label
        quantity: integer({
            defaultValue: 1,
        }),
        product: relationship({ ref: "Product" }),
        user: relationship({ ref: "User.cart" }),
    },
});