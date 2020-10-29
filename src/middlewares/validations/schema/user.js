import joi from "joi";

export const signupSchema = joi.object().keys({
  firstName: joi.string().min(4).alphanum().required(),
  lastName: joi.string().min(4).alphanum().required(),
  username: joi
    .string()
    .regex(/^\S+$/)
    .message("please remove spaces between word!")
    .min(4)
    .required(),
  email: joi.string().email().insensitive(),
  password: joi
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
    .message(
      "password must contain atleast 8 characters(upper/lower case, number & symbol)!"
    )
    .required(),
  confirmPassword: joi.string().required(),
});