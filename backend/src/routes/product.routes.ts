import { Router } from "express";
import { createproduct, getAllProducts, getProductBySlug, updateProduct, searchProducts, deleteProduct, getProductsByType } from "../controller/product.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middleware/verifyToken";
import { adminOnly } from "../middleware/roleCheck";

const router = Router();

router.post("/", verifyToken, adminOnly, asyncHandler(createproduct));
router.get("/", asyncHandler(getAllProducts));
router.get("/search", asyncHandler(searchProducts));
router.get("/type/:type", asyncHandler(getProductsByType));
router.get("/:slug", asyncHandler(getProductBySlug));
router.put("/:id", verifyToken, adminOnly, asyncHandler(updateProduct));
router.delete("/:id", verifyToken, adminOnly, asyncHandler(deleteProduct));

export default router;