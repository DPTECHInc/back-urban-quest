//const Post = require("../models/Post");

let fakeDatas = require("../fakeDatas/posts.json");

/**
 * Liste des Posts "public"
 */
const listAllPost = function (req, res) {
    res.status(200).json(fakeDatas);
};

module.exports = {
    list: listAllPost,
};
