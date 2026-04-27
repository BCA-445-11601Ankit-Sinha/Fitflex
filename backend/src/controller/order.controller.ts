import { type Request, type Response } from "express";
import { Cart } from "../models/cart.models";
import { Order } from "../models/order.models";
import { AppError } from "../utils/AppError";

export const createOrder = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { cartId, deliveryAddress } = req.body;
    if (!userId) throw new AppError(401, "Unauthorized");
    if (!cartId || !deliveryAddress?.trim()) {
        throw new AppError(400, "Cart ID and delivery address are required");
    }

    const cart = await Cart.findOne({ _id: cartId, userId, cart_status: "active" });
    if (!cart) throw new AppError(404, "Cart not found or already ordered");
    if (cart.items.length === 0) throw new AppError(400, "Cart is empty");

    const totalPrice = cart.total_price ?? 0;
    const order = await Order.create({
        userId,
        cartId: cart._id,
        totalPrice,
        deliveryAddress: deliveryAddress.trim(),
    });

    cart.cart_status = "completed";
    await cart.save();

    await Cart.create({ userId, items: [], total_price: 0, cart_status: "active" });

    res.status(201).json({ message: "Order placed successfully", order });
};

export const getMyOrders = async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) throw new AppError(401, "Unauthorized");

    const orders = await Order.find({ userId })
        .populate("cartId")
        .sort({ createdAt: -1 })
        .lean();

    res.status(200).json({ orders });
};

export const getOrderById = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { orderId } = req.params;
    if (!userId) throw new AppError(401, "Unauthorized");

    const order = await Order.findOne({ _id: orderId, userId })
        .populate({ path: "cartId", populate: { path: "items.productId", select: "name slug price imageUrl" } })
        .lean();

    if (!order) throw new AppError(404, "Order not found");

    res.status(200).json({ order });
};

export const getAllOrdersForAdmin = async (req: Request, res: Response) => {
    const orders = await Order.find()
        .populate("userId", "fullName email")
        .populate({ path: "cartId", populate: { path: "items.productId", select: "name slug price" } })
        .sort({ createdAt: -1 })
        .lean();

    res.status(200).json({ orders });
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const validStatuses = ["placed", "confirmed", "shipped", "delivered", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
        throw new AppError(400, "Valid status is required: placed, confirmed, shipped, delivered, cancelled");
    }

    const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
    )
        .populate("userId", "fullName email")
        .populate({ path: "cartId", populate: { path: "items.productId", select: "name slug price" } })
        .lean();

    if (!order) throw new AppError(404, "Order not found");

    res.status(200).json({ message: "Order status updated", order });
};
