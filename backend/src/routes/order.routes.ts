import { Router } from "express";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrdersForAdmin,
    updateOrderStatus,
} from "../controller/order.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middleware/verifyToken";
import { adminOnly } from "../middleware/roleCheck";

const router = Router();

router.use(verifyToken);

router.post("/", asyncHandler(createOrder));
router.get("/", asyncHandler(getMyOrders));
router.get("/admin/all", adminOnly, asyncHandler(getAllOrdersForAdmin));
router.patch("/admin/:orderId/status", adminOnly, asyncHandler(updateOrderStatus));
router.get("/:orderId", asyncHandler(getOrderById));

export default router;
