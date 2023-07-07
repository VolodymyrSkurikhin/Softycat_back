import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface ICat {
  name: string;
  birthday: string;
}

const catSchema = new Schema<ICat>({
  name: { type: String, required: true },
  birthday: { type: String, required: true },
});

export const Cat = model<ICat>("cat", catSchema);
