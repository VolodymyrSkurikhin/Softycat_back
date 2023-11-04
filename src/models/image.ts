import { Schema, Types, model } from "mongoose";
// import Joi from "joi";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

// 1. Create an interface representing a document in MongoDB.
interface IImage {
  owner: Types.ObjectId;
  cat: Types.ObjectId;
  catDetailedImageURL: string;
}

const imageSchema = new Schema<IImage>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
    cat: { type: Schema.Types.ObjectId, ref: "cat", required: true },
    catDetailedImageURL: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

imageSchema.post("save", handleMongooseError);

export const Image = model<IImage>(
  "image",
  imageSchema
);
