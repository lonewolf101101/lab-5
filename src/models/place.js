const Place = require("./placeModel");
const { getUserById } = require("./user");

const getPlaceByPID = async (id) => {
  return await Place.findOne({ pid: id });
};

const getPlaceByUID = async (uid) => {
  if (isNaN(uid)) {
    throw new Error("Invalid UID: must be a number");
  }
  const user = uid;
  console.log("user", user);
  return await Place.find({ user });
};

const addplace = async (newPlace) => {
  const user = await getUserById(newPlace.user);
  if (!user) throw new Error("User not found");

  const placeCount = await Place.countDocuments();
  newPlace.pid = placeCount + 1;
  const place = new Place(newPlace);
  return await place.save();
};

const editPlaceByPID = async (id, updatedData) => {
  return await Place.findOneAndUpdate({ pid: id }, updatedData, { new: true });
};

const deletePlaceByPID = async (id) => {
  const result = await Place.deleteOne({ pid: id });
  return result.deletedCount > 0;
};

const deletePlaceByUID = async (uid) => {
  const result = await Place.deleteMany({ user: uid });
  return result.deletedCount > 0;
};

module.exports = {
  getPlaceByPID,
  getPlaceByUID,
  addplace,
  editPlaceByPID,
  deletePlaceByPID,
  deletePlaceByUID,
};
