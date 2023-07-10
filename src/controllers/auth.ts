import { User } from "../models/user.js";
import { HttpError, ctrlWrapper } from "../helpers/HttpError.js";

const register = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email is already in use");
  }

  const newUser = await User.create(req.body);
  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
};

export default { register: ctrlWrapper(register) };
