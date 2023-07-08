import { Cat } from "../models/cat.js";
// import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAll = async (_, res) => {
  const result = await Cat.find({}, "-createdAt -updatedAt");
  res.json(result);
};

const add = async (req, res) => {
  const result = await Cat.create(req.body);
  res.status(201).json(result);
};

export default { getAll: ctrlWrapper(getAll), add: ctrlWrapper(add) };
