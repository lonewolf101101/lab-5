const {
  getPlaceByPID,
  getPlaceByUID,
  addplace,
  editPlaceByPID,
  deletePlaceByPID,
} = require("../models/place");
// const multer = require("multer");
// const path = require("path");

const getPlaceByPId = async (req, res) => {
  const place = await getPlaceByPID(parseInt(req.params.pid));
  if (place) {
    res.json(place);
  } else {
    res.status(404).json({ error: "Place not found" });
  }
};

const getPlaceByUId = async (req, res) => {
  const place = await getPlaceByUID(parseInt(req.params.uid));
  if (place) {
    res.json(place);
  } else {
    res.status(404).json({ error: "Place not found" });
  }
};

const addPlace = async (req, res) => {
  const { name, description, location, user, image } = req.body;

  const newPlace = {
    name,
    description,
    location,
    user,
    image,
  };

  try {
    const addedPlace = await addplace(newPlace);
    res.status(201).json(addedPlace);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error });
  }
};

const updatePlaceById = async (req, res) => {
  const updatedPlace = await editPlaceByPID(parseInt(req.params.pid), req.body);
  if (updatedPlace) {
    res.json(updatedPlace);
  } else {
    res.status(404).json({ error: "Place not found" });
  }
};

const deletePlaceById = async (req, res) => {
  const deletedPlace = await deletePlaceByPID(parseInt(req.params.pid));
  if (deletedPlace) {
    res.json({ message: "Place deleted" });
  } else {
    res.status(404).json({ error: "Place not found" });
  }
};

module.exports = {
  getPlaceByPId,
  getPlaceByUId,
  addPlace,
  updatePlaceById,
  deletePlaceById,
};
