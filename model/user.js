const mongoose = require("mongoose");

// const postSchema = new mongoose.Schema({});

const UserSchema = new mongoose.Schema(
    {
        nom: String,
        prenom: String,
        naissance: String,
        pseudo: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        // https://mongoosejs.com/docs/schematypes.html
        updated: { type: Date, default: Date.now },
    },
    {
        collection: "users",
    }
);

module.exports = User = mongoose.model("users", UserSchema);
