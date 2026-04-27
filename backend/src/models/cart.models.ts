import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1,
            },
        },
    ],
    total_price:{
        type:Number,
        default:0,
    },
    cart_status:{
        type:String,
        enum:["active", "completed"],
        default:"active",
    }    

},{timestamps:true});

export const Cart = mongoose.model("Cart", cartSchema);
export type CartType = mongoose.InferSchemaType<typeof cartSchema>;