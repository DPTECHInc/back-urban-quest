var express = require("express");
var router = express.Router();

const postControler = require("../controllers/posts");

/* Liste des post */
router.get("/", postControler.list);

router.post("/posts", function (req, res, next) {
    res.status(200).json("soon un ajout de post");
});

router.delete("/posts", function (req, res, next) {
    res.status(200).json("soon un delete de post");
});

router.post("/posts/like", function (req, res, next) {
    res.status(200).json("soon un ajout de like de post");
});

router.post("/posts/comment", function (req, res, next) {
    res.status(200).json("soon un ajout de comment de post");
});

module.exports = router;
