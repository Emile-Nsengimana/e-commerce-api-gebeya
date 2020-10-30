import model from "../db/models";
import dotenv from "dotenv";

dotenv.config();
const { Item } = model;

class ItemService {
  // save item to database
  static async saveItem(itemInfo, imageUrl) {
    const item = (await Item.create({ ...itemInfo, photo: imageUrl })).get({
      plain: true,
    });
    return item;
  }

  // retrieve available items from database
  static async findAvailableItems() {
    const availableItems = await Item.findAll({
      raw: true,
      where: { status: "available" },
    });
    return availableItems;
  }

  // retrieve a specific item from database
  static async findItem(itemId) {
    const item = await Item.findOne({
      raw: true,
      where: { id: itemId },
    });
    return item;
  }
}
export default ItemService;
