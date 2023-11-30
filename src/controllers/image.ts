import { nanoid } from "nanoid";
import { Image } from "../models/image.js";
import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { uploadToS3, deleteFromS3 } from "../helpers/uploadToS3.js";
import { Cat } from "../models/cat.js";

const S3URL = "https://softycatbucket.s3.eu-central-1.amazonaws.com/";

const addImage = async (req, res) => {
  const { sentCatID } = req.params;
  const { _id: dbOwnerID } = req.user;
  const dbCat = await Cat.findById(sentCatID);
  if (!dbCat) {
    throw HttpError(404, "Not found");
  }
  if (!dbCat.owner.equals(dbOwnerID)) {
    console.log(dbCat);
    console.log(dbOwnerID);
    throw HttpError(403, "Forbidden");
  }
  const { size, buffer } = req.file;
  if (size > 10000000) {
    throw HttpError(400, "Photo of cat must be less than 10Megabytes");
  }
  const photoId = nanoid();
  // const fileName = `${id}_${originalname}`;
  await uploadToS3(photoId, buffer);
  // const catImageURL = `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`;
  // const catImageURL = [photoId];
  const catDetailedImageURL = `${S3URL}${photoId}`;
  const result = await Image.create({
    owner: dbOwnerID,
    catDetailedImageURL,
    cat: sentCatID,
  });
  res.status(201).json(result);
};

const getAll = async (req, res) => {
  const { sentCatID: cat } = req.params;
  console.log(cat);
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Image.find({ cat }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("cat", "name");
  res.json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const ownerID = req.user._id;
  const resObj = await Image.findById(id);
  if (!resObj) {
    throw HttpError(404, "Not found");
  }
  if (!resObj.owner.equals(ownerID)) {
    throw HttpError(403, "Forbidden");
  }
  const imgDeleteResult = await deleteFromS3(resObj.catDetailedImageURL);
  if (!imgDeleteResult) {
    throw HttpError(500, "Server error");
  }
  if (imgDeleteResult.$metadata.httpStatusCode !== 204) {
    res.json({ message: "Something went wrong,try later, please!" });
    return;
  }
  const result = await Image.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "Successfully removed", S3: imgDeleteResult });
};

export default {
  addImage: ctrlWrapper(addImage),
  getAll: ctrlWrapper(getAll),
  deleteById: ctrlWrapper(deleteById),
};
