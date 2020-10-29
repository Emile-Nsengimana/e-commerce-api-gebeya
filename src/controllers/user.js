import TokenHandler from "../helpers/tokenHandler";
import UserService from "../services/user";
import bcrypt from "bcrypt";

class UserManager {
  static async signup(req, res) {
    try {
      const user = await UserService.saveUser(req.body);
      const { passkey, ...userInfo } = user;

      // generate token
      const token = await TokenHandler.generateToken({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        username: userInfo.username,
        role: userInfo.role,
      });

      return res.status(201).json({
        message: "thank you for joining us",
        token,
      });
    } catch (error) {
      return res.status(500).json({ error: "server error" });
    }
  }

  static async signin(req, res) {
    try {
      const { username, password } = req.body;
      const user = await UserService.getUser(username.trim());
      if (user === null)
        return res.status(404).json({ error: `user ${username} not found` });

      if (!bcrypt.compareSync(password, user.passkey))
        return res.status(401).json({ error: "incorrect password" });

      // generate token
      const token = await TokenHandler.generateToken({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        type: user.type,
      });

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
