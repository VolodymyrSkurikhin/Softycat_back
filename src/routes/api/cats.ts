import express from "express";

import { joiValidateBody } from "../../middlewares/joiValidateBody.js";
import { joiAddCatSchema, joiCatForSaleSchema } from "../../models/cat.js";
import catCtrl from "../../controllers/cats.js";
import { isValidId } from "../../middlewares/isValidId.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { upload } from "../../middlewares/upload.js";

export const router = express.Router();

router.get("/:ownerId", catCtrl.getAll);

router.get("/:id", authenticate, isValidId, catCtrl.getById);

router.post(
  "/",
  authenticate,
  joiValidateBody(joiAddCatSchema),
  upload.single("photo"),
  catCtrl.add
);

router.put(
  "/:id",
  authenticate,
  isValidId,
  joiValidateBody(joiAddCatSchema),
  upload.single("image"),
  catCtrl.updateById
);

router.patch(
  "/:id/forSale",
  authenticate,
  isValidId,
  joiValidateBody(joiCatForSaleSchema),
  catCtrl.updateForSale
);

router.patch(
  "/:id/catImage",
  authenticate,
  isValidId,
  upload.single("image"),
  catCtrl.updateCatImage
);

router.delete("/:id", authenticate, isValidId, catCtrl.deleteById);

// router.delete("/:id", (_, res) => {
//   res.json(testData[0]);
// });
