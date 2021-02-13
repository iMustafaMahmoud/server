const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const userRoutes = require("./routes/user-routes");
const orderRoutes = require("./routes/order-routes");
const HttpError = require("./models/http-error");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/users", userRoutes);
app.use("/orders", orderRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    }); // delete it from it's path
  }
  //speical
  if (res.headerSent) {
    //is sent
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

mongoose
  .connect("mongodb://localhost:27017/cratena", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT))
  .catch((err) => {
    console.log(err);
  });

// mongoose
//   .connect(
//     "mongodb+srv://mustafa:passwordd@cluster0.lzaby.mongodb.net/<dbname>?retryWrites=true&w=majority",
//     { useNewUrlParser: true, useUnifiedTopology: true }
//   )
//   .then(() => app.listen(PORT))
//   .catch((err) => {
//     console.log(err);
//   });

console.log("Server is running on port", PORT);
