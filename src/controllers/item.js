import model from "../db/models";
import ItemService from "../services/item";
import imageUploader from "../helpers/imageUploader";

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

      if (req.file) {
        const imageUrl = await imageUploader(req.file);
        req.body.photo = imageUrl;
      }

      await ItemService.saveItem(req.body, itemOwner);
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

  static async deleteItem(req, res) {
    try {
      const { itemId } = req.params;

      // check if the item exist
      const item = await ItemService.findItem(itemId);
      if (!item)
        return res.status(404).json({
          error: "the item you are trying to delete doesn't exist",
        });

      // makes sure thats only the owner can delete the item
      const { fullName } = item.dataValues.vendor.dataValues;
      if (req.user.fullName !== fullName)
        return res.status(401).json({
          error: "not allowed to delete this item",
        });

      // delete the item
      const deletedItem = await ItemService.deleteItem(itemId);
      if (deletedItem) {
        return res.status(200).json({
          message: "item deleted successful",
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: "server error, please try again later",
      });
    }
  }

  static async updateItem(req, res) {
    try {
      const { itemId } = req.params;

      // check if the item exist
      const item = await Item.findOne({ where: { id: itemId } });
      if (!item) return res.status(404).json({ error: "item not found" });

      // check for an image in the req
      if (req.file) {
        const imageUrl = await imageUploader(req.file);
        req.body.photo = imageUrl;
      }

      // checks if the user updating the item is the owner
      if (req.user.id !== item.vendorId)
        return res.status(403).json({
          error: "you are not authorized to update this item",
        });

      // update the item
      const updatedItem = await item.update(
        {
          name: req.body.name || item.name,
          status: req.body.status || item.status,
          quantity: req.body.quantity || item.quantity,
          price: req.body.price || item.price,
          description: req.body.description || item.description,
        },
        { where: { id: itemId }, returning: true, plain: true }
      );

      return res.status(200).json({
        message: "item updated successfully",
        item: updatedItem,
      });
    } catch (error) {
      return res.status(200).json({
        error,
      });
    }
  }
}

export default ItemManager;
