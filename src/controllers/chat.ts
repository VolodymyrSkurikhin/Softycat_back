import { CommonChat } from "../models/chat.js";
// import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllCommonMsgs = async (_, res) => {
  // const { _id: owner } = req.user;
  // const { ownerId: owner } = req.params;
  // const { page = 1, limit = 10 } = req.query;
  // const skip = (page - 1) * limit;
  const result = await CommonChat.find().skip((await CommonChat.count()) - 5);
  res.json(result);
};

const addCommonChatMsgs = async (content) => {
  const result = await CommonChat.create(content);
  return result;
};

export default {
  getAllCommonMsgs: ctrlWrapper(getAllCommonMsgs),
  addCommonChatMsgs,
};
