import express from "express";
import cors from "cors";

import { router as catRouter } from "./routes/api/cats.js";

export const app = express();

app.use(cors());
app.use("/api/cats", catRouter);
