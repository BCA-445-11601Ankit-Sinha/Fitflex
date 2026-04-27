import { type Request, type Response } from "express";
import { Cart } from "../models/cart.models";
import { Product } from "../models/product.models";
import { AppError } from "../utils/AppError";
import mongoose from "mongoose";

async function recalculateCartTotal(cartId: mongoose.Types.ObjectId): Promise<number> {
    const cart = await Cart.findById(cartId).populate("items.productId", "price").lean();
    if (!cart) return 0;
    let total = 0;
    for (const item of cart.items as { productId: { price: number }; quantity: number }[]) {
        const price = item.productId?.price ?? 0;
        total += price * item.quantity;
    }
    await Cart.findByIdAndUpdate(cartId, { total_price: total });
    return total;
}

export const getOrCreateCart = async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) throw new AppError(401, "Unauthorized");

    let cart = await Cart.findOne({ userId, cart_status: "active" }).populate("items.productId", "name slug price imageUrl");

    if (!cart) {
        cart = await Cart.create({ userId, items: [], total_price: 0, cart_status: "active" });
        cart = await Cart.findById(cart._id).populate("items.productId", "name slug price imageUrl");
    }

    res.status(200).json({ cart });
};

export const getCart = async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) throw new AppError(401, "Unauthorized");

    const cart = await Cart.findOne({ userId, cart_status: "active" }).populate("items.productId", "name slug price imageUrl");

    if (!cart) {
        return res.status(200).json({ cart: null, message: "No active cart" });
    }

    res.status(200).json({ cart });
};

export const addToCart = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { productId, quantity = 1 } = req.body;
    if (!userId) throw new AppError(401, "Unauthorized");
    if (!productId) throw new AppError(400, "Product ID is required");

    const product = await Product.findById(productId);
    if (!product) throw new AppError(404, "Product not found");

    let cart = await Cart.findOne({ userId, cart_status: "active" });
    if (!cart) {
        cart = await Cart.create({ userId, items: [], total_price: 0, cart_status: "active" });
    }

    const qty = Math.max(1, Number(quantity));
    const existingIndex = cart.items.findIndex(
        (i) => i.productId.toString() === productId
    );

    if (existingIndex >= 0) {
        cart.items[existingIndex].quantity += qty;
    } else {
        cart.items.push({ productId: new mongoose.Types.ObjectId(productId), quantity: qty });
    }
    await cart.save();
    await recalculateCartTotal(cart._id);

    cart = await Cart.findById(cart._id).populate("items.productId", "name slug price imageUrl");
    res.status(200).json({ message: "Added to cart", cart });
};

export const updateCartItem = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { productId, quantity } = req.body;
    if (!userId) throw new AppError(401, "Unauthorized");
    const productIdStr = productId != null ? String(productId) : "";
    if (!productIdStr) throw new AppError(400, "Product ID is required");
    if (quantity === undefined || quantity < 0) throw new AppError(400, "Valid quantity is required");

    const cart = await Cart.findOne({ userId, cart_status: "active" });
    if (!cart) throw new AppError(404, "Cart not found");

    const index = cart.items.findIndex((i) => String(i.productId) === productIdStr);
    if (index < 0) throw new AppError(404, "Item not in cart");

    if (quantity === 0) {
        cart.items.splice(index, 1);
    } else {
        cart.items[index].quantity = Number(quantity);
    }
    cart.markModified("items");
    await cart.save();
    await recalculateCartTotal(cart._id);

    const updated = await Cart.findById(cart._id).populate("items.productId", "name slug price imageUrl");
    res.status(200).json({ message: "Cart updated", cart: updated });
};

export const removeFromCart = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { productId } = req.params;
    if (!userId) throw new AppError(401, "Unauthorized");
    const productIdStr = productId != null ? String(productId) : "";
    if (!productIdStr) throw new AppError(400, "Product ID is required");

    const cart = await Cart.findOne({ userId, cart_status: "active" });
    if (!cart) throw new AppError(404, "Cart not found");

    cart.items = cart.items.filter((i) => String(i.productId) !== productIdStr);
    cart.markModified("items");
    await cart.save();
    await recalculateCartTotal(cart._id);

    const updated = await Cart.findById(cart._id).populate("items.productId", "name slug price imageUrl");
    res.status(200).json({ message: "Item removed", cart: updated });
};
