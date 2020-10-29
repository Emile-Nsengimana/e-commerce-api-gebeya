import model from "../db/models";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
const { Item } = model;

class UserService {
  // save item to database
  static async saveItem(itemInfo, imageUrl) {
    const item = (await Item.create({ ...itemInfo, photo: imageUrl })).get({
      plain: true,
    });
    return item;
  }
}

export default UserService;
