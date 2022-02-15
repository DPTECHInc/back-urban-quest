const mongoose = require("mongoose");

// const postSchema = new mongoose.Schema({});

const registerSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    naissance: Date,
    pseudo: String,
    mail: String,
    password: String,
});

module.exports = mongoose.model("data", registerSchema);
