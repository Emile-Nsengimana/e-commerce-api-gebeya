import model from "../db/models";
import { uploader } from "../middlewares/cloudinary";
import path from "path";
import imageDataURI from "image-data-uri";
import ItemService from "../services/item";

const { Item } = model;

class ItemManager {
  static async addItem(req, res) {
    try {
      // get image file from the request
      const image = req.file;
      const dataBuffer = new Buffer.from(image.buffer);
      const mediaType = path.extname(image.originalname).toString();
      const imageData = imageDataURI.encode(dataBuffer, mediaType);

      // uploads image to cloudinary
      const uploadedImage = await uploader.upload(imageData);

      await ItemService.saveItem(req.body, uploadedImage.url);
      return res.status(201).json({
        message: "item added successful",
      });
    } catch (error) {
      return res.status(500).json({
        error: "Server error",
      });
    }
  }

  // retrieve available items
  static async getItems(req, res) {
    try {
      const items = await ItemService.findAvailableItems();
      if (items.length === 0)
        return res.status(404).json({
          error: "no available item found",
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
