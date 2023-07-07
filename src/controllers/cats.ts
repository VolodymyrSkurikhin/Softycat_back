import { Cat } from "../models/cat.js";

export const getAll = async (_, res) => {
  const result = await Cat.find({}, "-createdAt -updatedAt");
  res.json(result);
};
