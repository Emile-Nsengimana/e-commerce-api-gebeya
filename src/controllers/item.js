import model from "../db/models";
import { uploader } from "../middlewares/cloudinary";
import path from "path";
import imageDataURI from "image-data-uri";
import ItemService from "../services/item";

const { Item } = model;

class ItemManager {
  static async addItem(req, res) {
    try {
      const itemOwner = req.user;

      // check if the vendor has the item
      const itemExit = await ItemService.findVendorItem(
        itemOwner.id,
        req.body.name
      );

      if (itemExit)
        return res.status(409).json({
          error:
            "you have added this item before! please update the quantity instead",
        });

      // get image file from the request
      const image = req.file;
      const dataBuffer = new Buffer.from(image.buffer);
      const mediaType = path.extname(image.originalname).toString();
      const imageData = imageDataURI.encode(dataBuffer, mediaType);

      // uploads image to cloudinary
      const uploadedImage = await uploader.upload(imageData);

      await ItemService.saveItem(req.body, uploadedImage.url, itemOwner);
      return res.status(201).json({
        message: "item added successful",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Server error",
      });
    }
  }

  // retrieve available items
  static async getItems(req, res) {
    try {
      const page = parseInt(req.query.page, 10);
      const limit = parseInt(req.query.limit, 10);
      const order = req.query.order;

      const items = await ItemService.findAvailableItems(page, limit, order);
      if (items.length === 0 || typeof items === "string")
        return res.status(404).json({
          error: typeof items === "string" ? items : "no available item found",
        });
      return res.status(200).json({
        items,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Server error",
      });
    }
  }

  // retrieve a specific item
  static async getItem(req, res) {
    const { itemId } = req.params;
    try {
      const item = await ItemService.findItem(itemId);
      if (!item)
        return res.status(404).json({
          error: "item not found",
        });
      return res.status(200).json({
        item,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Server error",
      });
    }
  }
}

export default ItemManager;
