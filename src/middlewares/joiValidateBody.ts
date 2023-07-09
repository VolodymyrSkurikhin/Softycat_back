import { HttpError } from "../helpers/HttpError.js";

export const joiValidateBody = (schema) => {
  const func = (req, _res, next) => {
    const { err } = schema.validate(req.body);
    if (err) {
      next(HttpError(400, err.message));
    }
    next();
  };
  return func;
};
