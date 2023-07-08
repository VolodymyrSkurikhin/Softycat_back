import express from "express";
import cors from "cors";

import { router as catRouter } from "./routes/api/cats.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/cats", catRouter);

app.use((_req, res) => {
  res.status(404).json({ messge: "Not found" });
});

app.use((err, _req, res, _next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
