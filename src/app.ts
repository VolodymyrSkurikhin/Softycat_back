import express from "express";
import cors from "cors";
import logger from "morgan";

import { router as catRouter } from "./routes/api/cats.js";
import { router as authRouter } from "./routes/api/auth.js";

export const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/cats", catRouter);

app.use((_req, res) => {
  res.status(404).json({ messge: "Not found" });
});

app.use((err, _req, res, _next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
