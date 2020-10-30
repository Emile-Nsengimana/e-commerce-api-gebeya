import model from "../db/models";
import Sequelize from "sequelize";
import dotenv from "dotenv";

const { Op } = Sequelize;

dotenv.config();
const { Item, User } = model;

class ItemService {
  // save item to database
  static async saveItem(itemInfo, itemOwner) {
    const item = (
      await Item.create({
        ...itemInfo,
        vendorId: itemOwner.id,
      })
    ).get({
      plain: true,
    });
    return item;
  }

  // retrieve available items from database
  static async findAvailableItems(page, limit, order) {
    const totalItems = await Item.count();
    const maxPage = parseInt(totalItems / limit, 10);

    if (!page || !limit) page = 1;
    if (!limit) limit = totalItems;
    if (maxPage < page)
      return `no content available on this page(last page: ${maxPage})`;

    const offset = (page - 1) * limit;
    const orderBy = order === "cheap" ? "ASC" : "DESC";
    const availableItems = await Item.findAll({
      order: [["price", orderBy]],
      offset,
      limit,
      where: { status: "available" },
      include: [
        {
          as: "vendor",
          model: User,
          attributes: ["fullName"],
        },
      ],
    });
    return availableItems;
  }

  // retrieve a specific item from database
  static async findItem(itemId) {
    const item = await Item.findOne({
      where: { id: itemId },
      include: [
        {
          as: "vendor",
          model: User,
          attributes: ["fullName"],
        },
      ],
    });
    return item;
  }

  // retrieve vendor items
  static async findVendorItem(vendorId, itemName) {
    const vendorItem = await Item.findOne({
      raw: true,
      where: {
        [Op.and]: [vendorId, { name: itemName }],
      },
    });
    return vendorItem;
  }

  // delete item from database
  static async deleteItem(itemId) {
    const deletedItem = await Item.destroy({
      where: { id: itemId },
    });
    return deletedItem;
  }

  // update item
  static async updateItem(itemInfo, itemId) {
    const item = await Item.findOne({
      where: { id: itemId },
    });
    if (item) {
      item.update({
        name: itemInfo.name || item.name,
        status: itemInfo.status || item.status,
        quantity: itemInfo.quantity || item.quantity,
        price: itemInfo.price || item.price,
        description: itemInfo.description || item.description,
      });
    }
    return item;
  }
}
export default ItemService;
