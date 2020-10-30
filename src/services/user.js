import model from "../db/models";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const { User } = model;

class UserService {
  // save user to database
  static async saveUser(userInfo) {
    const { fullName, username, email, gender, password, role } = userInfo;

    // hash password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT, 10)
    );
    const newUser = {
      ...userInfo,
      passkey: hashedPassword,
    };
    const user = (await User.create(newUser)).get({ plain: true });
    return user;
  }

  // retrieve user from database
  static async findUser(username) {
    const user = await User.findOne({
      raw: true,
      where: { username },
    });
    return user;
  }
}

export default UserService;
