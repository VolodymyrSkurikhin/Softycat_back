import express from "express";

// import { joiValidateBody } from "../../middlewares/joiValidateBody.js";
// import { joiAddCatSchema, joiCatForSaleSchema } from "../../models/cat.js";
import catImageCtrl from "../../controllers/image.js";
// import { isValidId } from "../../middlewares/isValidId.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { isValidId } from "../../middlewares/isValidId.js";
import { upload } from "../../middlewares/upload.js";

export const router = express.Router();

router.post(
  "/:sentCatID",
  authenticate,
  // joiValidateBody(joiAddCatSchema),
  upload.single("photo"),
  catImageCtrl.addImage
);

router.get("/:sentCatID", catImageCtrl.getAll);

router.delete("/:id", authenticate, isValidId, catImageCtrl.deleteById);
