import { Schema, Types, model } from "mongoose";
import Joi, { string } from "joi";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

const dateRegexp = /^\d{2}-\d{2}-\d{4}$/;

// 1. Create an interface representing a document in MongoDB.
interface ICat {
  name: string;
  birthday: string;
  breed?: string;
  forSale?: boolean;
  owner: Types.ObjectId;
  catImageURL: string;
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
    owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
    catImageURL: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

export const joiAddCatSchema = Joi.object({
  name: Joi.string().required(),
  birthday: Joi.string().pattern(dateRegexp).required(),
  breed: Joi.string(),
  forSale: Joi.boolean(),
});

export const joiCatForSaleSchema = Joi.object({
  forSale: Joi.boolean().required(),
});

catSchema.post("save", handleMongooseError);

export const Cat = model<ICat>("cat", catSchema);
