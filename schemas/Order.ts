import { list, graphql } from "@keystone-6/core";
import { text, integer, relationship, virtual } from "@keystone-6/core/fields";
import { allowAll } from '@keystone-6/core/access';
import formatMoney from "../lib/formatMoney";

export const Order = list({
    access: allowAll,
    fields: {
        label: virtual({
            field: graphql.field({
                type: graphql.String,
                resolve: (item:any) => `Order: ${formatMoney(item.total)}`,
            }),
        }),
        total: integer(),
        items: relationship({ ref: "OrderItem.order", many: true }),
        user: relationship({ ref: "User.orders" }),
        charge: text(),
    },
});