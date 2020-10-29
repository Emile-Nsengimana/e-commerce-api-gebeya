import model from "../db/models";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
const { User } = model;

/**
 * User service
 */
class UserService {
  /**
   *
   * @param {Object} user
   * @returns {Object} created user
   */
  static async createUser(userInfo) {
    const { firstName, lastName, username, email, gender, password } = userInfo;
    const hashedPassword = await bcrypt.hash(password, process.env.HASH_ROUND);
    const newUser = {
      firstName,
      lastName,
      username,
      email,
      gender,
      passkey: hashedPassword,
      role: "client",
    };
    const user = (await User.create(newUser)).get({ plain: true });
    return user;
  }

  /**
   *
   * @param {Object} user
   * @returns {Object} user
   */
  static async getUser(username) {
    const user = await User.findOne({
      raw: true,
      where: { username },
    });
    return user;
  }
}

export default UserService;
