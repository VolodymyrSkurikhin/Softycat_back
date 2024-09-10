import { findSocket } from "../chat/usersFns.js";
import { HttpError } from "../helpers/HttpError.js";

export const preparePrivateMsg = async (req, _res, next) => {
  const { peer, message } = req.body;
  const peerSocket = findSocket(peer);
  if (!peerSocket) {
    next(
      HttpError(
        404,
        "You correspondent is not available right now, try later, please"
      )
    );
  }
  next();
};
