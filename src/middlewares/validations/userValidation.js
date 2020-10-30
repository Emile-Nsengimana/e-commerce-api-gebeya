import { signupSchema, signinSchema } from "./schema/user";
import UserService from "./../../services/user";

class UserValidation {
  //  validation for user signup
  static async signupValidator(req, res, next) {
    const { body } = req;
    try {
      const user = {
        fullName: body.fullName,
        username: body.username,
        email: body.email,
        gender: body.gender,
        password: body.password,
        confirmPassword: body.confirmPassword,
        role: body.role,
      };
      const checkUser = signupSchema.validate(user, { abortEarly: false });
      const errors = [];

      // group validation erros together
      if (checkUser.error) {
        const { details } = checkUser.error;
        for (let i = 0; i < details.length; i += 1) {
          errors.push(details[i].message.replace('"', "").replace('"', ""));
        }
        return res.status(400).json({ error: errors });
      }
      // checks for password confirmation
      if (user.password !== user.confirmPassword) {
        errors.push("password don't match");
        return res.status(400).json({ error: errors });
      }
      // checks if username is already taken
      const usernameExist = await UserService.findUser(user.username);
      if (usernameExist)
        return res.status(409).json({
          error: "username already taken, Please choose another!",
        });
      next();
    } catch (error) {
      return res.status(500).json({ error: "server error" });
    }
  }

  //  validation for user signin
  static async signinValidator(req, res, next) {
    try {
      const credentials = {
        username: req.body.username.trim(),
        password: req.body.password,
      };
      const checkCredentials = signinSchema.validate(credentials, {
        abortEarly: false,
      });
      const errors = [];
      
      // group validation erros together
      if (checkCredentials.error) {
        const { details } = checkCredentials.error;
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
export default UserValidation;
