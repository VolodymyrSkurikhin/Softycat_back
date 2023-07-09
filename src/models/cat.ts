import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

const dateRegexp = /^\d{2}-\d{2}-\d{4}$/;

// 1. Create an interface representing a document in MongoDB.
interface ICat {
  name: string;
  birthday: string;
  breed?: string;
  forSale?: boolean;
}

const catSchema = new Schema<ICat>(
  {
    name: { type: String, required: true },
    birthday: { type: String, match: dateRegexp, required: true },
    breed: {
      type: String,
      default: "street cat",
    },
    forSale: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

export const joiCatSchema = Joi.object({
  name: Joi.string().required(),
  birthday: Joi.string().pattern(dateRegexp).required(),
  breed: Joi.string(),
  forSale: Joi.boolean(),
});

catSchema.post("save", handleMongooseError);

export const Cat = model<ICat>("cat", catSchema);
