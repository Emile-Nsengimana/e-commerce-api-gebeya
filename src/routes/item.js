import express from "express";
import ItemManager from "../controllers/item";
import ItemValidation from "../middlewares/validations/itemValidation";
import { multerUpload } from "../middlewares/multer";
import { cloudinaryConfig } from "../middlewares/cloudinary";
import Auth from "../middlewares/auth";

const router = express.Router();

router.use("*", Auth.verifyAuth, cloudinaryConfig);
router.post(
  "/",
  multerUpload,
  ItemValidation.itemValidator,
  ItemManager.addItem
);
router.get("/", ItemManager.getItems);
router.get("/:itemId", ItemManager.getItem);
router.delete("/:itemId", ItemManager.deleteItem);
router.put(
  "/update/:itemId",
  multerUpload,
  ItemValidation.updateItemValidator,
  ItemManager.updateItem
);

export default router;
