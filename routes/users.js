var express = require("express");
var router = express.Router();

const userController = require("../controllers/user");

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get("/profil", userController.profilDataGet);

router.put("/profil", userController.profilDataPut);

module.exports = router;
