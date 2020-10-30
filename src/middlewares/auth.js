import TokenHandler from "../helpers/tokenHandler";

class Auth {
  // A middle-ware to verify if the user has a valid access token
  static async verifyAuth(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization ? authorization.replace("Bearer ", "") : null;
    const authenticatedUser = await TokenHandler.verifyToken(token);
    if (!authenticatedUser)
      return res.status(401).json({
        message: "please login or signup",
      });

    req.user = authenticatedUser;
    next();
  }
}
export default Auth;
