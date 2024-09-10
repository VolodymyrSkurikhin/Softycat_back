import express from "express";
import cors from "cors";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

import { router as catRouter } from "./routes/api/cats.js";
import { router as authRouter } from "./routes/api/auth.js";
import { router as catImageRouter } from "./routes/api/image.js";
import { router as chatRouter } from "./routes/api/chat.js";

import chatCtrl from "./controllers/chat.js";

import { IUser, User } from "./models/user.js";
import {
  addUserSocket,
  findSocket,
  removeUserSocket,
} from "./chat/usersFns.js";
// import { findUser, addUser } from "./chat/usersFns.js";
// import { nanoid } from "nanoid";

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
app.use("/api/chat", chatRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _req, res, _next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("invalid token"));
  }
  try {
    const { id } = jwt.verify(token, secret_key) as JwtPayload;
    User.findById(id).then(
      (user) => {
        if (!user || !user.token || user.token !== token) {
          return next(new Error("invalid token"));
        }
        (socket as any).user = user;
        next();
      },
      () => {
        return next(new Error("invalid token"));
      }
    );
  } catch {
    return next(new Error("Could not enter chat.Please,try later"));
  }
});

io.on("connection", async (socket) => {
  const socketUser: IUser = (socket as any).user;
  console.log("socket User", socketUser);

  addUserSocket(socketUser.name, socket);
  socket.on("disconnect", () => {
    removeUserSocket(socketUser.name);
  });

  socket.on("chat-message", async (content) => {
    socket.broadcast.emit("chat-message", content);
    const result = await chatCtrl.addCommonChatMsgs(content);
    if (!result) {
      socket.broadcast.emit(
        "chat-message",
        "Last message is not saved in history"
      );
    }
  });
  socket.on("joinPrivate", async (peer, message) => {
    console.log(peer);
    if (!peer || !message) {
      socket.emit("joinPrivate", "Fill in all fields, please!");
      return;
    }
    const sender = socketUser.name;
    const newPeer = findSocket(peer);
    if (!newPeer) {
      socket.emit(
        "joinPrivate",
        "Your correspondent is not available right now. Please, try later"
      );
      return;
    }
    const newRoom = nanoid();
    socket.join(`${newRoom}`);
    newPeer.join(`${newRoom}`);
    socket.to(`${newRoom}`).emit("private-message", {
      id: nanoid(),
      author: sender,
      message,
    });
    await chatCtrl.addPrivateChatMsgs({
      starter: sender,
      corresp: peer,
      author: sender,
      message: message,
      time: new Date().toLocaleString(),
    });
    io.to(`${newRoom}`).emit("sendRoomId", newRoom);

    const onPrivateMessage = (authorSocket) => async (content) => {
      console.log("content is", content);
      authorSocket.to(`${newRoom}`).emit("private-message", content);
      await chatCtrl.addPrivateChatMsgs({
        starter: sender,
        corresp: peer,
        author: content.author,
        message: content.message,
        time: new Date().toLocaleString(),
      });
    };
    socket.on("private-message", onPrivateMessage(socket));
    newPeer.on("private-message", onPrivateMessage(newPeer));

    const onLeavePrivateChat = (authorSocket) => async (author, room) => {
      authorSocket.leave(room);
      authorSocket.removeAllListeners("private-message");
      io.to(`${room}`).emit("private-message", {
        message: `${author} has left private chat`,
      });
    };

    socket.on("leavePrivateChat", onLeavePrivateChat(socket));
    newPeer.on("leavePrivateChat", onLeavePrivateChat(newPeer));
  });
});
