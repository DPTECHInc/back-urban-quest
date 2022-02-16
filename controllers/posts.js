//const Post = require("../models/Post");

let Post = require("../model/post");

/**
 * Liste des Posts "public"
 */
let listAllPost = function (req, res) {
    Post.find()
        .then((posts) => {
            res.status(200).json(posts);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ msg: "Error while fetching posts" });
        });

    //res.status(200).json(fakeDatas);
};

module.exports = {
    list: listAllPost,
};
