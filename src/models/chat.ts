import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

interface ICommonChat {
  author: string;
  id: string;
  message: string;
  // type: "my" | "yours";
  time: string;
}

const commonChatSchema = new Schema<ICommonChat>(
  {
    author: { type: String, required: true },
    id: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

commonChatSchema.post("save", handleMongooseError);

export const CommonChat = model<ICommonChat>(
  "common message",
  commonChatSchema
);
