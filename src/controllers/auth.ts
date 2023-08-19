import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { User } from "../models/user.js";
import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { uploadToS3, region, bucket } from "../helpers/uploadToS3.js";

// const region = "eu-central-1";
// const client = new S3Client({ region });
// const bucket = "softycatbucket";

// export const uploadToS3 = async (key: string, body: string) => {
//   const command = new PutObjectCommand({
//     Bucket: bucket,
//     Key: key,
//     Body: body,
//   });

//   const response = await client.send(command);

//   console.log(response);
// };

let secret_key: string;
if (process.env.SECRET_KEY) {
  secret_key = process.env.SECRET_KEY;
} else {
  throw new Error("SECRET_KEY is not set");
}

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email is already in use");
  }
  const hashedPassword = await bcryptjs.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    avatarURL,
  });
  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is not valid");
  }
  const passwordCompare = await bcryptjs.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is not valid");
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, secret_key, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({ name: user.name, token });
};

const getCurrent = async (req, res) => {
  const { name, email } = req.user;
  res.json({ name, email });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({ message: "Success logout" });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { originalname, buffer, size } = req.file;
  console.log(req.file);
  if (size > 10000000) {
    throw HttpError(400, "Avatar must be less than 10Megabytes");
  }
  const fileName = `${_id}_${originalname}`;
  await uploadToS3(fileName, buffer);
  const avatarURL = `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`;
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
