import jwt from "json-web-token";
import dotenv from "dotenv";

dotenv.config();

class TokenHandler {
  static async generateToken(payload) {
    try {
      const accessToken = await jwt.encode(
        process.env.ACCESS_TOKEN_SECRET,
        payload
      );
      return accessToken.value;
    } catch (error) {
      return error;
    }
  }

  //  verifys the validity of the token
  static async verifyToken(accessToken) {
    const payload = await jwt.decode(
      process.env.ACCESS_TOKEN_SECRET,
      accessToken
    );
    if (payload.error) return false;
    return payload.value;
  }
}
export default TokenHandler;
