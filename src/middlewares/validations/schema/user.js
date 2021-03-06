import joi from "joi";

// signup schema for validation
export const signupSchema = joi.object().keys({
  fullName: joi.string().min(4).required(),
  username: joi
    .string()
    .regex(/^\S+$/)
    .message("please remove spaces between word!")
    .min(4)
    .alphanum()
    .required(),
  email: joi.string().email().insensitive(),
  gender: joi.any().valid("male", "female"),
  role: joi.any().valid("buyer", "vendor"),
  password: joi
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
    .message(
      "password must contain atleast 8 characters(upper/lower case, number & symbol)!"
    )
    .required(),
  confirmPassword: joi.string().required(),
});

// signin schema for validation
export const signinSchema = joi.object().keys({
  username: joi
    .string()
    .regex(/^\S+$/)
    .message("please remove spaces!")
    .min(4)
    .required(),
  password: joi.string().required(),
});
