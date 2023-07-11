import express from "express";
import { joiValidateBody } from "../../middlewares/joiValidateBody.js";
import { joiRegisterSchema, joiLoginSchema } from "../../models/user.js";
import userCtrl from "../../controllers/auth.js";

export const router = express.Router();

router.post("/register", joiValidateBody(joiRegisterSchema), userCtrl.register);
router.post("/login", joiValidateBody(joiLoginSchema), userCtrl.login);
