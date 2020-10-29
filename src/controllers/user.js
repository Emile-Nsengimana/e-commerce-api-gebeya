import TokenHandler from "../helpers/tokenHandler";
import UserService from "../services/user";
 
class UserManager {
  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} created user info
   */
  static async registerUser(req, res) {
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
        user: userInfo,
        token,
      });
    } catch (error) {
      console.log(error);
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      return res.status(500).json({ error: "server error" });
    }
  }
}

export default UserManager;
