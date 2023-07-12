const express = require('express');
const router = express.Router();
const passport = require('passport');

const HttpError = require("../HttpError");

const commentQueries = require("../queries/CommentQueries");
const recetteQueries = require("../queries/RecetteQueries");

router.get('/:id', (req, res, next) => {
    const recetteId = req.params.id;
    if (!recetteId || recetteId === '') {
        return next(new HttpError(400, 'Le champ recetteId est requis'));
    }

    recetteQueries.getRecetteById(id).then(recette => {
        if (!recette) {
            return next(new HttpError(404, `La recette ${id} est inexistante ou introuvable`));
        }
    }).catch(err => {
        return next(err);
    });

    commentQueries.getCommentByRecetteId(recetteId).then(comment => {
        if (comment) {
            console.log("commentRouter commentaire value : ", comment);
            if(comment.length == 0){
                return next(new HttpError(404, `La recette ${recetteId} est introuvable ou n'existe pas`));
            }
            res.json(comment);
        }

    }).catch(err => {
        return next(err);
    });
});

router.get('/:id/:user', (req, res, next) => {
    const id = req.params.id;
    const user = req.params.user;

    if (id == null || id === "") {
        return next(new HttpError(400, `Le parametre Id est requis`));
    }
    if (user == null || user === "") {
        return next(new HttpError(400, `Le parametre user est requis`));
    }

    recetteQueries.getRecetteById(id).then(recette => {
        if (!recette) {
            return next(new HttpError(404, `La recette ${id} est inexistante ou introuvable`));
        }
    }).catch(err => {
        return next(err);
    });

    if (user != req.user.courrielUtilisateur) {
        return next(new HttpError(403, `Vous devez être le même utilisateur pour voir l'appréciation`));
    }

    commentQueries.getUserCommentByRecetteId(id, user).then(commentaire => {
        if (commentaire) {
            if(commentaire.result == 0){
                return next(new HttpError(404, `La recette ${id} est introuvable ou n'existe pas`));
            }
            res.json(commentaire);
        } else {
            return next(new HttpError(404, `Commentaire de ${user} pour la recette ${id} introuvable`));
        }
    }).catch(err => {
        return next(err);
    });
});

router.post('/',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {

        const recetteId = req.body.recetteId;
        if (!recetteId ||recetteId == "") {
            return next(new HttpError(400, 'Le champ recetteId est requis'));
        }
        
        recetteQueries.getRecetteById(recetteId).then(recette => {
            if (!recette) {
                return next(new HttpError(404, `La recette ${recetteId} est inexistante ou introuvable`));
            }
        }).catch(err => {
            return next(err);
        });

        const user = req.user;

        commentQueries.getUserCommentByRecetteId(user.courrielUtilisateur, recetteId).then(result => {

            if (result == 1) {
                return next(new HttpError(400, `${user.courrielUtilisateur} a déjà fait une publication sur la recette ${recetteId}`));
            }

            const nouvCommentaire = {
                courrielUtilisateur: "" + user.courrielUtilisateur,
                recetteId: "" + recetteId,
                texte: "" + req.body.texte,
                datePublication: "" + req.body.date_publication
            };

            return commentQueries.insertCommentToRecipe(nouvCommentaire);
        }).then(result => {
            res.json(result);
        }).catch(err => {
            next(err);
        });
    });

module.exports = router;