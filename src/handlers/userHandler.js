const { deletePlaceByUID } = require("../models/place");
const {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("../models/user");

const getuserById = (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id)); // Change this line if your logic is different
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

const getAlluser = async (req, res) => {
  const data = await getAllUsers();
  res.json(data);
};

const signup = (req, res) => {
  const newUser = req.body;
  const addedUser = addUser(newUser);
  res.status(201).json(addedUser);
};

const updateUserById = (req, res) => {
  const { password, ...rest } = req.body;

  const updatedUser = updateUser(parseInt(req.params.id), rest);
  if (updatedUser) {
    res.json(updatedUser);
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

const deleteUserById = (req, res) => {
  const deletedUser = deleteUser(parseInt(req.params.id));
  const deletedplaces = deletePlaceByUID(parseInt(req.params.id));
  if (deletedUser && deletedplaces) {
    res.json({ message: "User deleted" });
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

module.exports = {
  getuserById,
  getAlluser,
  signup,
  updateUserById,
  deleteUserById,
};
