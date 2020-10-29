import { itemSchema } from "./schema/item";

class ItemValidation {
  //  validation for item
  static async itemValidator(req, res, next) {
    const { name, status, quantity, price, description } = req.body;
    const item = { name, status, quantity, price, description };
    try {
      const checkItem = itemSchema.validate(item, { abortEarly: false });
      const errors = [];

      // group validation erros together
      if (checkItem.error) {
        const { details } = checkItem.error;
        for (let i = 0; i < details.length; i += 1) {
          errors.push(details[i].message.replace('"', "").replace('"', ""));
        }
        return res.status(400).json({ error: errors });
      }
      next();
    } catch (error) {
      return res.status(500).json({ error: "server error" });
    }
  }
}
export default ItemValidation;
