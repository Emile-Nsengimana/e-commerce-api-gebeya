import model from "../db/models";
import CartService from "../services/cart";
import ItemService from "../services/item";

const { Cart, Item, User } = model;

class CartManager {
  static async addToCart(req, res) {
    try {
      const { itemId } = req.params;
      const buyer = req.user;

      const item = await Item.findOne({
        where: { id: itemId },
        raw: true,
      });
      if (!item)
        return res.status(404).json({
          error: "item not found",
        });

      const cart = await CartService.saveToCart(
        item,
        req.body.quantity,
        buyer.id
      );
      return res.status(201).json({
        message: "item added to cart successful",
        cart,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Server error",
      });
    }
  }

  // retrieve cart items
  static async viewCart(req, res) {
    try {
      const cart = await CartService.findCart(req.user.id);

      if (!cart)
        return res.status(404).json({
          error: "nothing on your cart yet",
        });
      return res.status(200).json({
        cart,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Server error",
      });
    }
  }
}

export default CartManager;
