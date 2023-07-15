import express from "express";
import { joiValidateBody } from "../../middlewares/joiValidateBody.js";
import { joiRegisterSchema, joiLoginSchema } from "../../models/user.js";
import userCtrl from "../../controllers/auth.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { upload } from "../../middlewares/upload.js";

export const router = express.Router();

router.post("/register", joiValidateBody(joiRegisterSchema), userCtrl.register);
router.post("/login", joiValidateBody(joiLoginSchema), userCtrl.login);
router.get("/current", authenticate, userCtrl.getCurrent);
router.post("/logout", authenticate, userCtrl.logout);
router.patch(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  userCtrl.updateAvatar
);
