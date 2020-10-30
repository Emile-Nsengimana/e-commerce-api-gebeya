import express from "express";
import CartManager from "../controllers/cart";
import Auth from "../middlewares/auth";

const router = express.Router();

router.use("*", Auth.verifyAuth);
router.post("/:itemId", CartManager.addToCart);
router.get("/", CartManager.viewCart);

export default router;
