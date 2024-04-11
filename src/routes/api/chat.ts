import express from "express";

import chatCtrl from "../../controllers/chat.js";
import { authenticate } from "../../middlewares/authenticate.js";

export const router = express.Router();

router.get("/commonMsgs", authenticate, chatCtrl.getAllCommonMsgs);
