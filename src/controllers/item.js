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
      return res.status(201).send({
        message: "item added successful",
      });
    } catch (error) {
      return res.status(500).send({
        error: "Server error",
      });
    }
  }
}

export default ItemManager;
