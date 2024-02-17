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

import { User } from "./models/user.js";
import { addUserSocket, findPeer, findUserSocket } from "./chat/usersFns.js";
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
  console.log("socket User", (socket as any).user);
  const isPresent = findUserSocket(socket);
  if (!isPresent) {
    addUserSocket(socket);
  }

  // let message: string;
  // socket.on("join", async (name, token) => {
  //   if (!name && !token) {
  //     return;
  //   }
  //   try {
  //     const { id } = jwt.verify(token, secret_key) as JwtPayload;
  //     const user = await User.findById(id);
  //     if (!user || !user.token || user.token !== token) {
  //       message = "Register or login to join chat!";
  //       socket.emit("join", message);
  //       return;
  //     }
  //     const isPresent = findUser(name);
  //     if (isPresent) {
  //       message = "You are already in chat!";
  //       socket.emit("join", message);
  //       return;
  //     }
  //     message = "You are in chat!";
  //     socket.emit("join", message);
  //     // const newUserId = await computeUserIdFromHeaders(socket);
  //     addUser(name, nanoid(), "", socket);
  //   } catch {
  //     message = "Something went wrong, try to join chat later, please!";
  //     socket.emit("join", message);
  //   }
  // });
  socket.on("chat-message", (content) => {
    socket.broadcast.emit("chat-message", content);
  });
  socket.on("joinPrivate", async (peer, message, sender, token) => {
    let reply: string;
    if (!sender && !token && peer && message) {
      socket.emit("joinPrivate", "Fill in all fields, please!");
      return;
    }
    const newPeer = findPeer(peer);
    if (!newPeer) {
      reply =
        "Your correspondent is not available right now. Please, try later";
      socket.emit("joinPrivate", reply);
      return;
    }
    const newRoom = nanoid();
    socket.join(`${newRoom}`);
    newPeer.join(`${newRoom}`);
    socket
      .to(`${newRoom}`)
      .emit("private-message", { author: sender, id: nanoid(), message });
    socket.on("private-message", (content) => {
      socket.to(`${newRoom}`).emit("private-message", content);
    });

    // try {
    //   const { id } = jwt.verify(token, secret_key) as JwtPayload;
    //   const user = await User.findById(id);
    //   if (!user || !user.token || user.token !== token) {
    //     reply = "Register or login to join chat!";
    //     socket.emit("joinPrivate", reply);
    //     return;
    //   }
    // if (!findUserSocket(socket)) {
    //   addUserSocket(socket);
    // }

    // } catch {
    //   reply = "Something went wrong, try to join chat later, please!";
    //   socket.emit("joinPrivate", reply);
    // }
  });
});
