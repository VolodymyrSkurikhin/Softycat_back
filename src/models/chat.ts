import { Schema, model, Types } from "mongoose";
import { handleMongooseError } from "../helpers/handleMongooseError.js";
// import { string } from "joi";

interface ICommonChat {
  author: string;
  id: string;
  message: string;
  time: string;
}

// interface IInterlocutors {
//   starter: string;
//   corresp: string;
// }

interface IPrivateChat {
  user: Types.ObjectId;
  starter: string;
  corresp: string;
  author: string;
  id: string;
  message: string;
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

const privateChatSchema = new Schema<IPrivateChat>(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    starter: { type: String, required: true },
    corresp: { type: String, required: true },
    author: { type: String, required: true },
    // corresp: { type: String, required: true },
    id: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

commonChatSchema.post("save", handleMongooseError);
privateChatSchema.post("save", handleMongooseError);

export const CommonChat = model<ICommonChat>(
  "common message",
  commonChatSchema
);

export const PrivateChat = model<IPrivateChat>(
  "private message",
  privateChatSchema
);
