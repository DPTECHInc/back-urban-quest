const mongoose = require("mongoose");

// const postSchema = new mongoose.Schema({});

const UserSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    naissance: Date,
    pseudo: String,
    email: String,
    password: String,
});

module.exports = User = mongoose.model("users", UserSchema);
