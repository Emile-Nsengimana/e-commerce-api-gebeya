import express from "express";
import userController from "../controllers/user";
import userValidation from "../middlewares/validations/userValidation";

const router = express.Router();

router.post("/signup", userValidation.signupValidator, userController.signup);
router.post("/signin", userValidation.signinValidator, userController.signin);

export default router;
