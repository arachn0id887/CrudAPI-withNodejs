const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT;
const KEY = process.env.DBKEY;
const useRouter = require("./routes.js");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");

//MIDDLEWARE
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", useRouter);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// MONGODB CONNECTION
mongoose
  .connect(
    `mongodb+srv://vivaanjha:${KEY}@r3t3-crudapi.qkgv8pw.mongodb.net/?retryWrites=true&w=majority&appName=R3T3-CRUDAPI`
  )
  .then(() => {
    console.log("Connected to MongoDB.");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}.`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
