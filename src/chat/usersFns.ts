interface IChatUser {
  name: string;
  userID: string;
  room: string;
}

export const trimStr = (str: string) => str.trim().toLowerCase();

const users: IChatUser[] = [];

const findUser = (user: string) => {
  const userName = trimStr(user);
  // const userRoom = trimStr(user.room);

  return users.find((u) => trimStr(u.name) === userName);
};

export const addUser = (user: string, userID: string, room = "") => {
  const isExist = findUser(user);
  if (isExist) {
    return isExist;
  }
  const currentUser: IChatUser = {
    name: user,
    userID,
    room,
  };
  users.push(currentUser);
  return currentUser;

  // !isExist && users.push(user);

  // const currentUser = isExist || user;

  // return { isExist: !!isExist, user: currentUser };
};
