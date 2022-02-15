const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    nom: String,
    contenu: String,
    categorie: String,
    location: {},
    likes: Number,
    comments: Array,
});

module.exports = Post = mongoose.model("posts", PostSchema);
