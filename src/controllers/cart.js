import model from "../db/models";
import CartService from "../services/cart";

const { Item } = model;

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
      return res.status(500).json({
        error: "Server error",
      });
    }
  }

  static async addItemsToCart(req, res) {
    try {
      const { items } = req.body;
      const buyer = req.user;
      const allItems = [];

      // retrieve details of items to add on cart
      const allItemToAdd = items.map(async (item) => {
        const singleItem = await Item.findOne({
          where: { id: item.id },
          raw: true,
        });

        singleItem && allItems.push(singleItem);
      });

      await Promise.all(allItemToAdd);

      // adds all items to cart
      const cartItems = allItems.map(async (item, index) => {
        const cart = await CartService.saveToCart(
          item,
          items[index].quantity,
          buyer.id
        );
      });
      await Promise.all(cartItems);

      return res.status(201).json({
        message: "all items added to cart successful",
      });
    } catch (error) {
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

  static async removeCartItem(req, res) {
    try {
      const { itemName } = req.params;

      // check if the item exist on the cart
      // remove the item and update the total price
      const buyerCart = await CartService.findCart(req.user.id);

      const itemOnCart = buyerCart.dataValues.products;
      if (itemOnCart[itemName]) {
        const deletedItemPrice =
          itemOnCart[itemName].price * itemOnCart[itemName].quantity;

        delete itemOnCart[itemName];
        const oldTotalPrice = buyerCart.dataValues.totalPrice;
        const updatedCart = await buyerCart.update({
          returning: true,
          plain: true,
          products: { ...itemOnCart },
          totalPrice: oldTotalPrice - deletedItemPrice,
        });

        return res.status(200).json({
          message: "item removed successful",
          cart: updatedCart,
        });
      }
      return res.status(404).json({
        error: "item not on your cart",
      });
    } catch (error) {
      return res.status(500).json({
        error: "server error, please try again later",
      });
    }
  }
}

export default CartManager;
