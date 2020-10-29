import TokenHandler from "../helpers/tokenHandler";
import UserService from "../services/user";
import bcrypt from "bcrypt";

class UserManager {
  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} created user info
   */
  static async signup(req, res) {
    try {
      const user = await UserService.createUser(req.body);

      const { passkey, ...userInfo } = user;
      const token = await TokenHandler.generateToken({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        username: userInfo.username,
        type: userInfo.type,
      });

      return res.status(201).json({
        message: "thank you for joining us",
        token,
      });
    } catch (error) {
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      return res.status(500).json({ error: "server error" });
    }
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {Object} user
   */
  static async signin(req, res) {
    try {
      const { username, password } = req.body;
      const user = await UserService.getUser(username.trim());
      if (user === null)
        return res.status(404).json({ error: `user ${username} not found` });

      if (!bcrypt.compareSync(password, user.passkey))
        return res.status(401).json({ error: "incorrect password" });

      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        type: user.type,
      };
      const token = await TokenHandler.generateToken(payload);
      const { passkey, ...userInfo } = user;

      return res.status(200).json({
        message: "successfully logged in",
        token,
      });
    } catch (error) {
      return res.status(500).json({
        error: "internal server error",
      });
    }
  }
}

export default UserManager;
