import express from "express";

import { joiValidateBody } from "../../middlewares/joiValidateBody.js";
import { joiAddCatSchema, joiCatForSaleSchema } from "../../models/cat.js";
import catCtrl from "../../controllers/cats.js";
import { isValidId } from "../../middlewares/isValidId.js";

export const router = express.Router();

router.get("/", catCtrl.getAll);

router.get("/:id", isValidId, catCtrl.getById);

router.post("/", joiValidateBody(joiAddCatSchema), catCtrl.add);

router.put(
  "/:id",
  isValidId,
  joiValidateBody(joiAddCatSchema),
  catCtrl.updateById
);

router.patch(
  "/:id/forSale",
  isValidId,
  joiValidateBody(joiCatForSaleSchema),
  catCtrl.updateForSale
);

router.delete("/:id", isValidId, catCtrl.deleteById);

// router.delete("/:id", (_, res) => {
//   res.json(testData[0]);
// });
