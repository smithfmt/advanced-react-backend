import { list } from "@keystone-6/core";
import { text, password, relationship } from "@keystone-6/core/fields";
import { allowAll } from '@keystone-6/core/access';

export const User = list({
    access: allowAll,
    //ui
    fields: {
        name: text(),
        email: text({ isIndexed: "unique" }),
        password: password(),
        // add roles, cart and orders
        cart: relationship({
            ref: "CartItem.user",
            many: true,
            ui: {
                createView: { fieldMode: "hidden" },
                itemView: { fieldMode: "read" },
            },
        }),
    },
});