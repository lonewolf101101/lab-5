const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  pid: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  user: { type: Number, required: true },
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
