const mongoose = require("mongoose");

// const postSchema = new mongoose.Schema({});

const UserSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    naissance: String,
    pseudo: String,
    email: String,
    password: String,
    // https://mongoosejs.com/docs/schematypes.html
    updated: { type: Date, default: Date.now },
});

module.exports = User = mongoose.model("users", UserSchema);
