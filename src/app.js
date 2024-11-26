const express = require("express");
const session = require("express-session");
const app = express();
const bodyParser = require("body-parser");
const PORT = 3300;
const cors = require("cors");

const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://undrahbatg:uk04241031@mongodbtest.glq2k.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(
  cors({
    origin: "http://localhost:3000", // Your React app URL
    credentials: true, // Allow cookies to be sent
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/", (req, res) => {
  res.send("Hello World!");
});
app.put("/", (req, res) => {
  res.send("Hello World!");
});
app.delete("/", (req, res) => {
  res.send("Hello World!");
});

const loggerMiddleware = require("./middleware/logger");
const { UserRouter, AuthorizedUserRouter } = require("./routes/UserRoute");
const { PlaceRouter, AuthorizedPlaceRouter } = require("./routes/PlaceRoute");
const { sessionMiddleware } = require("./middleware/authentication");

// Set up session management
app.use(
  session({
    secret: "0e71b9b989e2c3161037404a05b5d6638931fb02f384ea84b870d8a4317ec054", // Replace with your own secret
    resave: false,
    saveUninitialized: true,
  })
);

//general middleware importing
app.use(bodyParser.json());

// Routes for users
app.use("/api", UserRouter);
app.use("/api", AuthorizedUserRouter);

// Routes for places
app.use("/api", PlaceRouter);
app.use("/api", AuthorizedPlaceRouter);

app.use(loggerMiddleware);
// server starting
const server = app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});

server.on("error", (err) => {
  console.error("Server encountered an error:", err);
});
