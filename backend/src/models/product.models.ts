import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    imageUrl:[
        {
            type:String,
        }
    ],
    type:{
        type:String,
        required:true,
        enum:["suppliments", "utility", "apparel"]
    }
    

},{timestamps:true});


export const Product = mongoose.model("Product", productSchema);
export type ProductType = mongoose.InferSchemaType<typeof productSchema>;
