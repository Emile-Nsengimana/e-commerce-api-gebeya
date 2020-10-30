import express from "express";
import CartManager from "../controllers/cart";
import Auth from "../middlewares/auth";

const router = express.Router();

router.use("*", Auth.verifyAuth);
router.post("/:itemId", CartManager.addToCart);
router.post("/", CartManager.addItemsToCart);
router.get("/", CartManager.viewCart);
router.delete("/:itemName", CartManager.removeCartItem);

export default router;
