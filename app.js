var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// initializes our database using the credentials (from .env)
mongoose
    .connect(process.env.mongoURI)
    .then(() => console.log("Mongo Database connected to " + process.env.mongoURI))
    .catch((err) => console.log(err));

app.use("/", indexRouter);
app.use("/", usersRouter);

module.exports = app;
