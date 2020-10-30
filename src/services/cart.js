import model from "../db/models";
import Sequelize from "sequelize";
import dotenv from "dotenv";

const { Op } = Sequelize;

dotenv.config();
const { Item, User, Cart } = model;

class CartService {
  // save cart to database
  static async saveToCart(item, quantity, buyerId) {
    const itemOnCart = await Cart.findOne({
      where: {
        buyerId,
      },
    });

    // checks if the cart is empty and
    // adds the first item on the cart
    if (!itemOnCart) {
      const cart = (
        await Cart.create({
          products: { [item.name]: { ...item, quantity } },
          buyerId,
          totalPrice: item.price * quantity,
        })
      ).get({
        plain: true,
      });
      return cart;
    }

    // chechs if the item is on the cart and make changes accordingly
    const sameItem = itemOnCart.dataValues.products[item.name];
    let tempPrice = itemOnCart.dataValues.totalPrice + item.price * quantity;

    if (sameItem) {
      const oldItemQuantity = sameItem.quantity;
      const oldTotal = item.price * oldItemQuantity;
      tempPrice = tempPrice - oldTotal;
    }

    // updates the cart
    const updatedCart = await itemOnCart.update({
      returning: true,
      plain: true,
      products: {
        ...itemOnCart.dataValues.products,
        [item.name]: { ...item, quantity },
      },
      totalPrice: tempPrice,
    });
    return updatedCart;
  }

  //   retrieve a specific item from database
  static async findCart(buyerId) {
    const cart = await Cart.findOne({
      where: { buyerId },
    });
    return cart;
  }
}
export default CartService;
