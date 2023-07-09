import express from "express";

import { joiValidateBody } from "../../middlewares/joiValidateBody.js";
import { joiCatSchema } from "../../models/cat.js";
import catCtrl from "../../controllers/cats.js";

export const router = express.Router();

// router.get("/", (_, res) => {
//   res.json(testData);
// });

// router.get("/:id", (_, res) => {
//   res.json(testData[0]);
// });

router.post("/", joiValidateBody(joiCatSchema), catCtrl.add);

// router.put("/:id", (_, res) => {
//   res.json(testData[0]);
// });

// router.delete("/:id", (_, res) => {
//   res.json(testData[0]);
// });
