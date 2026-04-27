import { type Request, type Response } from 'express';
import { Product, type ProductType } from '../models/product.models';
import { AppError } from '../utils/AppError';

export const createproduct = async (req: Request, res: Response) => {
    const { name, slug, description, price, imageUrl, type }: ProductType = req.body;

    if (!name || !slug || !description || !price || !type) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
     throw new AppError(400, "Product with this slug already exists");}

    const product = await Product.create({
        name,
        slug,
        description,
        price:Number(price),
        imageUrl,
        type
    });
    

    res.status(201).json({ message: "Product created successfully", product });
};

export const getAllProducts = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find().select('-__v -description -createdAt -updatedAt').skip(skip).limit(Number(limit)).lean();
    console.log('count', products.length);
    res.status(200).json({ products, totalCount: await Product.countDocuments() });
};

export const getProductBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    console.log('slug', slug);
    if (!slug) {
        throw new AppError(400, "Product slug is required");
    }
    const product = await Product.findOne({ slug });

    if (!product) {
        throw new AppError(404, "Product not found");
    }

    res.status(200).json({ product });
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, slug, description, price, imageUrl, type }: ProductType = req.body;

    const product = await Product.findByIdAndUpdate(
        id,
        { name, slug, description, price, imageUrl , type },
        { new: true }
    );

    if (!product) {
        throw new AppError(404, "Product not found");
    }

    res.status(200).json({ message: "Product updated successfully", product });
};

//get product by search query
export const searchProducts = async (req: Request, res: Response) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
        throw new AppError(400, "Search query is required and must be a string");
    }

    const products = await Product.find({
        $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
        ]
    }).select('-__v -createdAt -updatedAt').lean();

    res.status(200).json({
        success: true,
        data: products
    });
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        throw new AppError(404, "Product not found");
    }

    res.status(200).json({ message: "Product deleted successfully" });
};

export const getProductsByType = async (req: Request, res: Response) => {
    const { type } = req.params;
    if (!type) {
        throw new AppError(400, "Product type is required");
    }

    const products = await Product.find({ type }).select('-__v -createdAt -updatedAt').lean();

    res.status(200).json({
        success: true,
        data: products
    });
};
