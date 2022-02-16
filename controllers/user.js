var express = require("express");
var router = express.Router();
var user = require("../model/user");

const registerPost = {
    RegisterDataPost: (req, res, next) => {
        console.log(req.body);

        let RegisterData = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            naissance: req.body.naissance,
            pseudo: req.body.pseudo,
            email: req.body.email,
            password: req.body.password,
        };

        if (
            !RegisterData.nom ||
            !RegisterData.prenom ||
            !RegisterData.naissance ||
            !RegisterData.pseudo ||
            !RegisterData.email ||
            !RegisterData.password
        ) {
            res.status(422).json({ message: "l'un des champ requis est vide" });
        } else {
            user.findOne({ email: RegisterData.email }, (error, data) => {
                if (error) {
                    res.status(500).json({ message: "Une erreur s'est produite" });
                } else if (data != null) {
                    res.status(422).json({ message: "Cet email est déjà enregistré" });
                } else {
                    const userToRegister = new user(RegisterData);

                    userToRegister.save({}, (error, data) => {
                        if (error) {
                            res.status(500).json({ message: "Une erreur s'est produite" });
                        } else {
                            res.status(200).json({ message: "User Register", newUser: data });
                        }
                    });
                }
            });
        }
    },

    loginDataGet: (req, res, next) => {
        let email = req.body.email;
        let password = req.body.password;

        user.findOne({ email: email, password: password }, (error, data) => {
            if (error) {
                res.status(500).json({ message: "Une erreur s'est produite" });
            } else if (data === null) {
                res.status(401).json({ message: "Email ou mot de passe invalide" });
            } else {
                res.status(200).json(data);
            }
        });
    },

    /**
     * PS : on verras comment retrouver le user courrant en fonction d'une clef
     * autre que le mail. yes carrément on peut lui mettre un ID c'est plus propre ^^
     * ça viendra avec le cours "gestion de connextion use" :P
     * mais oui sans doute un ID (mais pas directement celui du user (trop simple :/ ))
     */
    profilDataGet: (req, res, next) => {
        let valeurClefPourTrouverLeUser = req.body.email;

        user.findOne({ email: valeurClefPourTrouverLeUser }, (error, data) => {
            res.status(200).json(data);
        });
    },

    profilDataPut: (req, res, next) => {
        let newValue = req.body.plop;

        user.update(
            { _id: req.params.id },
            {
                nom: req.body.nom,
                prenom: req.body.prenom,
                naissance: req.body.naissance,
            }
        );
        res.status(200).json({ message: "TO DO//EN COURS" });
    },
};

module.exports = registerPost;
