import { Router } from "express";
import {
    getOrCreateCart,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
} from "../controller/cart.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.use(verifyToken);

router.get("/", asyncHandler(getCart));
router.get("/get-or-create", asyncHandler(getOrCreateCart));
router.post("/add", asyncHandler(addToCart));
router.patch("/item", asyncHandler(updateCartItem));
router.delete("/item/:productId", asyncHandler(removeFromCart));

export default router;
