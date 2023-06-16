import { list } from "@keystone-6/core";
import { text, select, integer, relationship } from "@keystone-6/core/fields";
import { allowAll } from '@keystone-6/core/access';

export const OrderItem = list({
    access: allowAll,
    //ui
    fields: {
        name: text({validation: {isRequired: true}}),
        description: text({
            ui: {
                displayMode: "textarea",
            },
        }),
        photo: relationship({
            ref: "ProductImage",
            ui: {
                displayMode: "cards",
                cardFields: ["image", "altText"],
                inlineCreate: { fields: ["image", "altText"] },
                inlineEdit: { fields: ["image", "altText"] },
            }
        }),
        price: integer(),
        quantity: integer(),
        order: relationship({ ref: "Order.items" }),
    },
});