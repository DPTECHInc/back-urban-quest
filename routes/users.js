var express = require("express");
var router = express.Router();

const userController = require("../controllers/user");

router.post("/register", userController.RegisterDataPost);

router.post("/login", userController.loginDataGet);

router.get("/profil", userController.profilDataGet);

router.put("/profil", userController.profilDataPut);

module.exports = router;
