import { Cat } from "../models/cat.js";
import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { uploadToS3, region, bucket } from "../helpers/uploadToS3.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Cat.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name email");
  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await Cat.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const { size, originalname, buffer } = req.file;
  if (size > 10000000) {
    throw HttpError(400, "Avatar must be less than 10Megabytes");
  }
  const fileName = `${owner}_${originalname}`;
  await uploadToS3(fileName, buffer);
  const catImageURL = `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`;
  const result = await Cat.create({ ...req.body, owner, catImageURL });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const result = await Cat.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateForSale = async (req, res) => {
  const { id } = req.params;
  const result = await Cat.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const result = await Cat.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "Successfully removed" });
};

export default {
  getAll: ctrlWrapper(getAll),
  add: ctrlWrapper(add),
  getById: ctrlWrapper(getById),
  updateById: ctrlWrapper(updateById),
  updateForSale: ctrlWrapper(updateForSale),
  deleteById: ctrlWrapper(deleteById),
};
