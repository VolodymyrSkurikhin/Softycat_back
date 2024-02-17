// import { Socket } from "socket.io";
// import { io } from "../app.js";

// interface IChatUser {
//   name: string;
//   userID: string;
//   room: string;
//   socket: any;
// }

// export const trimStr = (str: string) => str.trim().toLowerCase();

// const users: IChatUser[] = [];

// export const findUser = (user: string) => {
//   const userName = trimStr(user);
//   // const userRoom = trimStr(user.room);

//   return users.find((u) => trimStr(u.name) === userName);
// };

// export const addUser = (
//   user: string,
//   userID: string,
//   room = "",
//   socket: any
// ) => {
//   const isExist = findUser(user);
//   if (isExist) {
//     return isExist;
//   }
//   const currentUser: IChatUser = {
//     name: user,
//     userID,
//     room,
//     socket,
//   };
//   users.push(currentUser);
//   return currentUser;
// };

const socketList: any[] = [];

export const findUserSocket = (newSocket: any) => {
  return socketList.find((s) => s.user.name === newSocket.user.name);
};
export const findPeer = (peer: string) => {
  return socketList.find((s) => s.user.name === peer);
};
export const addUserSocket = (newSocket: any): void => {
  socketList.push(newSocket);
};
