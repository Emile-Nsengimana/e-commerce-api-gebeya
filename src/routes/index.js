import express from "express";
import user from "./user";
import item from "./item";

const router = express.Router();

router.use("/api/auth", user);
router.use("/api/item", item);

export default router;
