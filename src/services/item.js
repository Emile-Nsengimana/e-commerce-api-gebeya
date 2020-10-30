import model from "../db/models";
import Sequelize from "sequelize";
import dotenv from "dotenv";

const { Op } = Sequelize;

dotenv.config();
const { Item, User } = model;

class ItemService {
  // save item to database
  static async saveItem(itemInfo, imageUrl, itemOwner) {
    const item = (
      await Item.create({
        ...itemInfo,
        vendorId: itemOwner.id,
        photo: imageUrl,
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
          attributes: ["firstName", "lastName"],
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
}
export default ItemService;
