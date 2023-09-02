import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleMongooseError } from "../helpers/handleMongooseError.js";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  token: string;
  avatarURL: string;
  isShown: boolean;
}

const userSchema = new Schema<IUser>(
  {
    _id: String,
    name: { type: String, required: true },
    email: { type: String, required: true, match: emailRegexp, unique: true },
    password: { type: String, required: true, minlength: 6 },
    token: { type: String, default: "" },
    avatarURL: { type: String, required: true },
    isShown: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

export const User = model("user", userSchema);

export const joiRegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const joiLoginSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
});
