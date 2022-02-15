var express = require("express");
var router = express.Router();

router.post("/register", function (req, res, next) {
    res.status(200).json("soon Register user");
});

router.post("/login", function (req, res, next) {
    res.status(200).json("soon log-in");
});

router.get("/profil", function (req, res, next) {
    res.status(200).json("soon your account infos");
});

router.put("/profil", function (req, res, next) {
    res.status(200).json("soon update your account infos");
});

module.exports = router;
