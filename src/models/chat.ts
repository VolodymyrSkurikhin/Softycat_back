import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/handleMongooseError.js";
import { string } from "joi";

interface ICommonChat {
  author: string;
  id: string;
  message: string;
  // type: "my" | "yours";
  time: string;
}

interface IInterlocutors {
  starter: string;
  corresp: string;
}

interface IPrivateChat {
  both: IInterlocutors;
  author: string;
  // corresp: string;
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

const privateChatSchema = new Schema<IPrivateChat>(
  {
    both: {
      starter: { type: string, required: true },
      corresp: { type: string, required: true },
    },
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
