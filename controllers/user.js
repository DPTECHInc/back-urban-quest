var express = require("express");
var router = express.Router();
var User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../model/user");
const app = require("../app");

const registerPost = {
    register: async (req, res, next) => {
        console.log(req.body);

        let registerData = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            naissance: req.body.naissance,
            pseudo: req.body.pseudo,
            email: req.body.email,
            password: req.body.password,
        };

        if (
            !registerData.nom ||
            !registerData.prenom ||
            !registerData.naissance ||
            !registerData.pseudo ||
            !registerData.email ||
            !registerData.password
        ) {
            return res.status(422).json({ message: "l'un des champ requis est vide" });
        }

        registerData.password = await bcrypt.hash(registerData.password, 10);

        const userToRegister = new User(registerData);
        userToRegister.save({}, (error, savedUserInDB) => {
            if (error) {
                if (/*error.name === "ValidationError" && */ error.keyPattern.email) {
                    // error.keyValue == "email" => email déjà enregistré
                    // exemple d'erreur
                    // Object
                    //      index	0
                    //      code	11000
                    //      keyPattern	{
                    //              email: 1                    <===== GRrrr !
                    // }
                    //      email	1
                    //      keyValue	Object { email: "ps@mail.com" }
                    //      email	"ps@mail.com"
                    return res.status(422).json({ message: "Cet email est déjà enregistré" });
                }
                return res.status(500).json({ message: "Une erreur s'est produite", error });
            }
            // need create a token for this new user
            // Génération du JWT
            jwt.sign({ userId: savedUserInDB._id }, process.env.SECRET, { expiresIn: "1h" }, (err, token) => {
                if (err) {
                    return res.status(500).json({ message: "Une erreur s'est produite" });
                }
                return res.status(200).json({ message: "User Registered", user: savedUserInDB, token });
            });
        });
    },

    login: (req, res, next) => {
        /* Body */
        let { email, password } = req.body;

        /* Recherche de l'utilisateur */
        User.findOne({ email: email }, async (error, data) => {
            if (error) {
                return res.status(500).json({ message: "Une erreur s'est produite" });
            }
            if (data === null) {
                // user non trouvé (email non enregistré dans la DB)
                return res.status(422).json({ message: "Email ou mot de pass invalide" });
            }
            if (!(await bcrypt.compare(password, data.password))) {
                // en vrai on sait que c'est le mot qui est faux (chut: "silent is golden")
                return res.status(422).json({ message: "Email ou mot de pass invalide" });
            }

            // Génération du JWT
            jwt.sign({ userId: data._id }, process.env.SECRET, { expiresIn: "1h" }, (err, token) => {
                if (err) {
                    return res.status(500).json({ message: "Une erreur s'est produite" });
                }
                return res.status(200).json({ message: "You are now logged in", user: data, token });
            });
        });
    },

    /**
     * PS : on verras comment retrouver le user courrant en fonction d'une clef
     * autre que le mail. yes carrément on peut lui mettre un ID c'est plus propre ^^
     * ça viendra avec le cours "gestion de connextion use" :P
     * mais oui sans doute un ID (mais pas directement celui du user (trop simple :/ ))
     */
    profilDataGet: (req, res, next) => {
        // Récupération du token dans le header Authoriztion
        const token = req.get("Authorization");

        // Vérification de la validité du token
        jwt.verify(token, process.env.SECRET, (error, decoded) => {
            // Token invalide
            if (error) {
                return res.status(401).json({ message: "Token invalide" });
            }

            console.log(decoded);

            // Recherche de l'utilisateur à partir du userId présent dans le token
            User.findOne({ _id: decoded.userId }, (err, data) => {
                console.log(data);
                res.status(200).json(data);
            });
        });
    },

    profilDataPut: (req, res, next) => {
        //METHODE 1

        // let newValueNom = req.body.nom;
        // let newValuePrenom = req.body.prenom;
        // let newValueNaissance = req.body.naissance;
        // let newValuePseudo = req.body.pseudo;

        // // récupérer l'id dans le token :)

        // User.updateOne( {_id: id},
        //     {$set: { nom: newValueNom, prenom: newValuePrenom, naissance: newValueNaissance, pseudo: newValuePseudo }},
        //     (error, data) => {
        //         if (error) {
        //             res.status(500).json({ message: "Une erreur s'est produite" });
        //         } else if (data === null) {
        //             res.status(422).json({ message: "L'un des champ requis est vide" });
        //         } else {
        //             res.status(200).json({ message: "Votre profil a bien été modifié", ProfilUpdated: req.body });
        //         }
        //     }
        // );

        //METHODE 2

        const { nom, prenom, naissance, pseudo } = req.body;
        const token = req.get("Authorization").split(" ")[1];

        jwt.verify(token, "querty-1234", async (err, decoded) => {
            if (err) {
                res.status(500).json({ message: "Une erreur s'est produite" });
                return;
            }
            const user = await User.findOne({ _id: decoded.userId });
            if (!user) {
                res.status(401).json({ message: " Votre nom d'utilisateur est invalide " });
                return;
            }
            user.nom = nom;
            user.prenom = prenom;
            user.naissance = naissance;
            user.pseudo = pseudo;
            await user.save();
        });
    },
};

module.exports = registerPost;
