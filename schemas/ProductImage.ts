import { list } from "@keystone-6/core";
import { text, relationship } from "@keystone-6/core/fields";
import { allowAll } from '@keystone-6/core/access';
import { cloudinaryImage } from "@keystone-6/cloudinary"

export const cloudinary = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_KEY || "",
    apiSecret: process.env.CLOUDINARY_SECRET || "",
    folder: "sickfits",
};

export const ProductImage = list({
    access: allowAll,
    //ui
    fields: {
        image: cloudinaryImage({
            cloudinary,
            label: "source",
        }),
        altText: text(),
        product: relationship({ ref: "Product.photo" })
    },
    ui: {
        listView: {
            initialColumns: ["image", "altText", "product"]
        }
    },
});