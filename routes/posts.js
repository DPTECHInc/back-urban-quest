var express = require("express");
var router = express.Router();

const postControler = require("../controllers/posts");

/* Liste des post */
router.get("/", postControler.list);

router.post("/posts", postControler.create);

router.delete("/posts", postControler.delete);

router.post("/posts/like", postControler.like);

router.post("/posts/comment", postControler.comment);

module.exports = router;
