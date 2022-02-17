//const Post = require("../models/Post");

let Post = require("../model/post");

module.exports = {
    /**
     * Lister les posts
     */
    list(req, res) {
        Post.find({})
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

        newPost.save((error, data) => {
            if (error) {
                console.log(error);
                res.status(500).json({ message: "Une erreur s'est produite" });
            } else {
                res.status(200).json({ message: "Votre post à été ajouté" });
            }
        });
    },

    delete(req, res, next) {
        // controle que l'on ai bien un id de fournit
        if (!req.body.id) {
            res.status(422).json({ message: "l'un des champ requis est vide" });
            // nothing else to do
            return;
        }

        // l'id du post à supprimer
        const postIdToDel = req.body.id;

        // recherche en BDD de ce post
        Post.findOne({ _id: postIdToDel }, (error, postToDel) => {
            if (error) {
                console.log("Une erreur s'est produite (lors de la verif de l'existance du post)");
                console.log(error);
                res.status(500).json({
                    message: "Une erreur s'est produite (lors de la verif de l'existance du post)",
                });
            } else if (postToDel === null) {
                res.status(404).json({
                    message: "Impossible de retrouver le post à supprimer.. Ce post n'existe pas(ou plus)",
                });
            } else {
                // le post existe .. plus qu'à le supprimer
                console.log("Les infos sur le post à supprimer:");
                console.log(postToDel);

                Post.deleteOne({ _id: postIdToDel }, (error, queryInfos) => {
                    if (error) {
                        console.log("Une erreur s'est produite (lors de la suppression du post)");
                        console.log(error);
                        res.status(500).json({ message: "Une erreur s'est produite (lors de la suppression du post)" });
                    } else {
                        // le post a été supprimé !?
                        if (queryInfos.deletedCount === 1) {
                            // on attend dans "queryInfos":
                            // { deletedCount: 1 }
                            res.status(200).json({ message: "Un post à bien été supprimé" });
                        } else {
                            res.status(200).json({
                                message:
                                    "il n'y a pas d'erreur, mais " +
                                    queryInfos.deletedCount +
                                    " posts ont étés supprimés ??",
                            });
                        }
                    }
                });
            }
        });

        // just to test [start]

        return;
        Post.findByIdAndRemove(postIdToDel, (error, deletedPost) => {
            if (error) {
                res.status(500).json({
                    message: "Une erreur s'est produite (lors de la recherche/suppression du post)",
                });
            } else if (deletedPost === null) {
                res.status(404).json({
                    message: "Impossible de retrouver le post à supprimer.. Ce post n'existe pas(ou plus)",
                });
            } else {
                res.status(200).json({ message: "Le post à bien été supprimé", deletedPost });
            }
        });
        // just to test [end]
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

        // just to test [start]
        return;
        const filters = { _id: postIdToLike };
        // https://docs.mongodb.com/manual/reference/operator/update/inc/
        const updates = { $inc: { likes: 1 } };

        Post.updateOne(filters, updates, (error, queryInfos) => {
            if (error) {
                res.status(500).json({ message: "Une erreur s'est produite" });
            } else {
                console.log(queryInfos);
                // https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#mongodb-method-db.collection.updateOne
                //         The method returns a document that contains:
                // matchedCount containing the number of matched documents
                // modifiedCount containing the number of modified documents
                // upsertedId containing the _id for the upserted document.
                // A boolean acknowledged as true if the operation ran with write concern or false if write concern was disabled
                //
                // exemple momgoose : non pas "modifiedCount" mais "nModified"
                //if (queryInfos.modifiedCount == 0) {
                if (queryInfos.nModified == 0) {
                    res.status(404).json({ message: "Aucun post ne semble correspondre." });
                } else {
                    res.status(200).json({ message: "il y " + queryInfos.nModified + " posts mis à jour." });
                }
            }
        });
        // another try (again)
        const options = { new: true };
        Post.findOneAndUpdate(filters, updates, options, (error, updatedPost) => {
            if (error) {
                res.status(500).json({ message: "Une erreur s'est produite" });
            } else {
                if (updatedPost === null) {
                    res.status(404).json({ message: "Aucun post ne semble correspondre." });
                } else {
                    res.status(200).json({ message: "Un post à été mis à jour.", post: updatedPost });
                }
            }
        });

        // just to test [end]
    },

    comment(req, res, next) {
        const postIdToComment = req.body.id;
        // une petite variable contenant le texte/commentaire à ajouter

        Post.findOne({ _id: postIdToComment }, (error, data) => {
            if (error) {
                res.status(500).json({ message: "Une erreur s'est produite" });
                console.log(error);
            } else if (!data) {
                res.status(422).json({ message: "Le post n'existe pas" });
            } else {
                // un bout de code à addapter :
                // https://docs.mongodb.com/manual/reference/operator/update/push/#append-a-value-to-an-array
                // students.updateOne(
                //      { _id: 1 },
                //      { $push: { scores: 89 } }
                // )

                data.comments;
                $push: {
                    [""];
                }
                data.save((error) => {
                    if (error) {
                        res.status(500).json({ message: "Une erreur s'est produite" });
                    } else {
                        console.log(data.comments);
                        res.send({ message: "good job", comment: data.comments });
                    }
                });
            }
        });
    },
};
