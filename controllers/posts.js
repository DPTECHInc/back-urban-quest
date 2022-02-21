//const Post = require("../models/Post");

let Post = require("../model/post");
const jwt = require("jsonwebtoken");

module.exports = {
    /**
     * Lister les posts
     */
    list(req, res) {
        Post.find({})
            .sort({ updated: -1 })
            .exec()
            .then((posts) => {
                res.status(200).json(posts);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ msg: "Error while fetching posts" });
            });
    },

    /**
     * Créer un post
     */
    create(req, res, next) {
        let { nom, contenu, categorie, location } = req.body;

        if (!nom || !contenu || !categorie) {
            res.status(422).json({ message: 'l\'un des champ requis "nom", "contenu" ou "categorie", est vide' });
            return;
        }
        // les "likes" et les "comments" seront toujours vides lors de la création de post
        // c'est donc le model qui definit les valeurs par defaut de
        //    "likes" à 0
        //    "comments" à [] (tableau vide)

        const newPost = new Post({
            nom,
            contenu,
            categorie,
            location,
        });

        //Verification de connexion pour acceder à création de post
        const token = req.get("Authorization").split(" ")[1];

        jwt.verify(token, process.env.SECRET, (error, decoded) => {
            if (error) {
                return res.status(401).json({ message: "Token invalide" });
            }

            User.findOne({ _id: decoded.userId }, (userFetchedFromDB) => {
                // Authentification Autorisé => Sauvegarde du post
                // TODO : ajout de l'auteur du post (model à maj)
                // newPost.author = userFetchedFromDB._id;

                newPost.save((error, data) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: "Une erreur s'est produite" });
                    }
                    res.status(200).json({ message: "Votre post à été ajouté", newPost });
                });
            });
        });
    },

    delete(req, res, next) {
        // controle que l'on ai bien un id de fournit
        if (!req.body.id) {
            res.status(422).json({ message: "l'un des champ requis est vide" });
            // nothing else to do
            return;
        }

        //Verification de connexion pour acceder à suppression de post//
        const token = req.get("Authorization").split(" ")[1];

        jwt.verify(token, process.env.SECRET, (error, decoded) => {
            if (error) {
                return res.status(401).json({ message: "Token invalide" });
            }

            Post.findOne({ _id: decoded.userId }, (data, postToDel) => {
                if (error) {
                    console.log("Une erreur s'est produite (lors de la verification de l'existence du post)");
                    console.log(error);
                    return res.status(500).json({
                        message: "Une erreur s'est produite (lors de la verification de l'existence du post)",
                    });
                }
                if (postToDel === null) {
                    return res.status(404).json({
                        message: "Impossible de retrouver le post à supprimer. Ce post n'existe pas(ou plus)",
                    });
                }
                // le post existe .. plus qu'à le supprimer
                console.log("Les infos sur le post à supprimer: ");
                console.log(postToDel);

                Post.deleteOne({ _id: decoded.userId }, (error, queryInfos) => {
                    if (error) {
                        console.log("Une erreur s'est produite (lors de la suppression du post)");
                        console.log(error);
                        return res
                            .status(500)
                            .json({ message: "Une erreur s'est produite (lors de la suppression du post)" });
                    }
                    // le post a été supprimé !?
                    if (queryInfos.deletedCount === 1) {
                        // on attend dans "queryInfos":
                        // { deletedCount: 1 }
                        return res.status(200).json({ message: "Un post à bien été supprimé" });
                    }
                    return res.status(200).json({
                        message:
                            "il n'y a pas d'erreur, mais " + queryInfos.deletedCount + " posts ont étés supprimés ??",
                    });
                });
            });
        });
    },

    like(req, res, next) {
        const postIdToLike = req.body.id;

        Post.findOne({ _id: postIdToLike }, (error, post) => {
            if (error) {
                res.status(500).json({ message: "Une erreur s'est produite" });
                console.log(error);
            } else if (!post) {
                res.status(422).json({ message: "Le post n'existe pas" });
            } else {
                post.likes++;
                post.save((error) => {
                    if (error) {
                        res.status(500).json({ message: "Une erreur s'est produite" });
                    } else {
                        console.log(post.likes);
                        res.send({ likeCount: post.likes });
                    }
                });
            }
        });
    },

    comment(req, res, next) {
        const postIdToComment = req.body.id;
        const newComment = String(req.body.comment);

        if (!postIdToComment || !newComment || newComment.length === 0) {
            return res.status(422).json({ message: "Tout les champs ne sont pas remplis" });
        }

        // exemple de header :
        //      "bearer truuuuuuuc"
        const authHeader = req.get("Autorization");
        if (
            !authHeader || // header vide
            authHeader.indexOf(" ") === -1 // ne contient pas d'espace
        ) {
            // go fcuk yourself
            return res.status(403).json({ message: "Vous devez etre connecté." });
        }
        // transformation de:
        //      "bearer truuuuuuuc"
        // en :
        //      "truuuuuuuc"
        const authToken = authHeader.split(" ")[1];

        // Verification de la validité du token
        jwt.verify(authToken, process.env.SECRET, (error, decoded) => {
            if (error) {
                // verif du token fail
                return res.status(401).json({ message: "Token invalide" });
            }

            User.findOne({ _id: decoded.userId }, (userFetchedFromDB) => {
                const filters = { _id: postIdToComment };
                // https://docs.mongodb.com/manual/reference/operator/update/inc/
                const updates = { $push: { comments: newComment } };
                const options = { new: true };
                Post.findOneAndUpdate(filters, updates, options, (error, updatedPost) => {
                    // `updatedPost` is the document _after_ `update` was applied because of
                    // `new: true`
                    // Mongoose's findOneAndUpdate() is slightly different from the MongoDB Node.js driver's findOneAndUpdate()
                    // because it returns the document itself, not a result object
                    if (error) {
                        return res.status(500).json({ message: "Une erreur s'est produite" });
                    }
                    if (updatedPost === null) {
                        return res.status(404).json({ message: "Aucun post ne semble correspondre." });
                    }
                    return res.status(200).json({ message: "Un post à été mis à jour.", post: updatedPost });
                });
            });
        });
    },
};
