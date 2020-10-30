import express from "express";
import user from "./user";
import item from "./item";
import cart from "./cart";

const router = express.Router();

router.use("/api/auth", user);
router.use("/api/item", item);
router.use("/api/cart", cart);

export default router;
