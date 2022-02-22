const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    nom: String,
    contenu: String,
    categorie: String,
    location: String,
    likes: { type: Number, default: 0 },
    comments: { type: Array, default: [] },
    img: String,
    // pictures: ,
    // https://mongoosejs.com/docs/schematypes.html
    updated: { type: Date, default: Date.now },
});

module.exports = Post = mongoose.model("posts", PostSchema);
