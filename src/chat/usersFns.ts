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

let socketMap: { [key: string]: any } = {};

// export const findUserSocket = (newSocket: any) => {
//   return socketList.find((s) => s.user.name === newSocket.user.name);
// };
export const findSocket = (name: string) => {
  return socketMap[name];
};
export const addUserSocket = (newSocket: any): void => {
  socketMap[newSocket.user.name] = newSocket;
  console.log("socketMap after addUserSocket ", socketMap);
};
export const removeUserSocket = (name: string): void => {
  const newSocketMap = Object.fromEntries(
    Object.entries(socketMap).filter(([key]) => key !== name)
  );
  socketMap = newSocketMap;
  console.log("socketMap after removeUserSocket ", socketMap);
};
