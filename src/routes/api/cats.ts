import express from "express";

import { testData } from "../../data.js";

export const router = express.Router();

router.get("/", (_, res) => {
  res.json(testData);
});

router.get("/:id", (_, res) => {
  res.json(testData[0]);
});

router.post("/", (_, res) => {
  res.json(testData[0]);
});

router.put("/:id", (_, res) => {
  res.json(testData[0]);
});

router.delete("/:id", (_, res) => {
  res.json(testData[0]);
});
