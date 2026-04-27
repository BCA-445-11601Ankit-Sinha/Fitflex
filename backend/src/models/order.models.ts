import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        cartId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart",
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        deliveryAddress: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
            default: "placed",
        },
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
export type OrderType = mongoose.InferSchemaType<typeof orderSchema>;
