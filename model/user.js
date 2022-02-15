const mongoose = require("mongoose");

// const postSchema = new mongoose.Schema({});

const UserSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    naissance: Date,
    pseudo: String,
    mail: String,
    password: String,
});

module.exports = User = mongoose.model("users", UserSchema);
