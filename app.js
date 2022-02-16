var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");

// reccup des infos contenu dans notre fichier de config ".env"
require("dotenv").config({ path: "./.env" });

var postsRouter = require("./routes/posts");
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

// sets up CORS for Cross-Origin-Resource-Sharing
// coller ICI le bout de code de Guillaume
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", true);
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use(postsRouter);
app.use(usersRouter);

module.exports = app;
