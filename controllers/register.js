var express = require("express");
var router = express.Router();
var data = require("../model/modelPost");

const registerPost = {
    RegisterDataPost: (req, res, next) => {
        console.log(req.body);

        let RegisterData = `
        " Nom : " ${req.body.nom}
        " Prenom : " ${req.body.prenom}
        " Date de Naissance : " ${req.body.dateOfBirth}
        " Pseudo : " ${req.body.pseudo}
        " Adresse E-mail " ${req.body.mail}
        " Mot de Passe " ${req.body.password}`;

        res.status(200).json("soon Register user");
    },

    loginDataGet: (req, res, next) => {
        console.log("login is working");

        let loginGet = {
            email: String,
            password: String,
        };

        //if (loginGet === )
    },
};

module.exports = registerPost;
