import { CommonChat, PrivateChat } from "../models/chat.js";
// import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllCommonMsgs = async (_, res) => {
  // const { _id: owner } = req.user;
  // const { ownerId: owner } = req.params;
  // const { page = 1, limit = 10 } = req.query;
  // const skip = (page - 1) * limit;
  const count = await CommonChat.count();
  let skip: number;
  if (count < 5) {
    skip = 0;
  } else {
    skip = 5;
  }
  const result = await CommonChat.find().skip(skip);
  res.json(result);
};

const addCommonChatMsgs = async (content) => {
  const result = await CommonChat.create(content);
  return result;
};

const getAllPrivateMsgs = async (_, res) => {
  const count = await PrivateChat.count();
  let skip: number;
  if (count < 5) {
    skip = 0;
  } else {
    skip = 5;
  }
  const result = await PrivateChat.find({}).skip(skip);
  res.json(result);
};

const addPrivateChatMsgs = async (content) => {
  const result = await PrivateChat.create(content);
  return result;
};
export default {
  getAllCommonMsgs: ctrlWrapper(getAllCommonMsgs),
  getAllPrivateMsgs: ctrlWrapper(getAllPrivateMsgs),
  addCommonChatMsgs,
  addPrivateChatMsgs,
};
