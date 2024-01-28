import express from "express";
import cors from "cors";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";

import { router as catRouter } from "./routes/api/cats.js";
import { router as authRouter } from "./routes/api/auth.js";
import { router as catImageRouter } from "./routes/api/image.js";

import { User } from "./models/user.js";
import { findUser, addUser } from "./chat/usersFns.js";
import { nanoid } from "nanoid";

interface JwtPayload {
  id: string;
}

export const app = express();
export const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let secret_key: string;
if (process.env.SECRET_KEY) {
  secret_key = process.env.SECRET_KEY;
} else {
  throw new Error("SECRET_KEY is not set");
}

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/auth", authRouter);
app.use("/api/cats", catRouter);
app.use("/api/image", catImageRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _req, res, _next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

io.on("connection", async (socket) => {
  let message: string;
  socket.on("joinCommon", async (name, token) => {
    try {
      const { id } = jwt.verify(token, secret_key) as JwtPayload;
      const user = await User.findById(id);
      if (!user || !user.token || user.token !== token) {
        message = "401";
        socket.emit("joinCommon", message);
        return;
      }
      const isPresent = findUser(name);
      if (isPresent) {
        message = "You are already in chat!";
        socket.emit("joinCommon", message);
      }
      message = "You are in chat!";
      // const newUserId = await computeUserIdFromHeaders(socket);
      addUser(name, nanoid(), "");
    } catch {
      message = "Something went wrong, try later, please!";
      socket.emit("joinCommon", message);
    }
  });
  socket.on("chat-message", (content) => {
    socket.broadcast.emit("chat-message", content);
  });
});
