import jwt from "jsonwebtoken";

import { HttpError } from "../helpers/HttpError.js";
import { User } from "../models/user.js";

interface JwtPayload {
  id: string;
}

let secret_key: string;
if (process.env.SECRET_KEY) {
  secret_key = process.env.SECRET_KEY;
} else {
  throw new Error("SECRET_KEY is not set");
}

export const authenticate = async (req, _res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401, "No bearer"));
  }
  try {
    const { id } = jwt.verify(token, secret_key) as JwtPayload;
    const user = await User.findById(id);
    if (!user) {
      next(HttpError(401, "Not authoriz"));
    }
    next();
  } catch {
    next(HttpError(401, "Not authorized"));
  }
};
