import joi from "joi";

// item schema for validation
export const itemSchema = joi.object().keys({
  name: joi.string().min(3).required(),
  status: joi.any().valid("available", "sold", "expired"),
  quantity: joi.number().integer().required(),
  price: joi.number().required().min(0),
  description: joi.string(),
});


// item schema for validation on update
export const updateItemSchema = joi.object().keys({
  name: joi.string().min(3),
  status: joi.any().valid("available", "sold", "expired"),
  quantity: joi.number().integer(),
  price: joi.number().min(0),
  description: joi.string(),
});
