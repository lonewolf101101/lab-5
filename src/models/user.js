const bcrypt = require("bcrypt");
const User = require("./userModel");
const { deletePlaceByUID } = require("./place");
const mongoose = require("mongoose");

const getAllUsers = async () => {
  // console.log("getAllUsers", User.find());
  return await User.find();
};

const getUserById = async (uid) => {
  return await User.findOne({ uid }); // Query by the 'uid' field directly
};

const addUser = async (newUser) => {
  if (!newUser.username) {
    throw new Error("Name is required");
  }

  newUser.password = await bcrypt.hash(newUser.password, 12);
  const user = new User(newUser);

  return await user.save();
};

const updateUser = async (id, updatedUser) => {
  if (updatedUser.password) {
    updatedUser.password = await bcrypt.hash(updatedUser.password, 12);
  }
  return await User.findByIdAndUpdate(id, updatedUser, { new: true });
};

const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (user) {
    const deleteSuccess = await deletePlaceByUID(user.uid);
    if (deleteSuccess) {
      return await User.findByIdAndDelete(id);
    }
  }
  return null;
};

module.exports = { getAllUsers, getUserById, addUser, updateUser, deleteUser };
