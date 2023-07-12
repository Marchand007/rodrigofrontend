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

    recetteQueries.getRecetteById(recetteId).then(recette => {
        if (!recette) {
            return next(new HttpError(404, `La recette ${recetteId} est inexistante ou introuvable`));
        }
    }).catch(err => {
        return next(err);
    });

    commentQueries.getCommentByRecetteId(recetteId).then(comment => {
        if (comment) {
            console.log("commentRouter commentaire value : ", comment);
           
            res.json(comment);
        }

    }).catch(err => {
        return next(err);
    });
});

router.post('/',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {

        const recetteId = req.body.recetteId;
        if (!recetteId || recetteId == "") {
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

            const nouvCommentaire = {
                courrielUtilisateur: "" + user.courrielUtilisateur,
                recetteId: "" + recetteId,
                texte: "" + req.body.texte,
                datePublication: "" + req.body.date_publication
            };

            commentQueries.insertCommentToRecipe(nouvCommentaire).then(result => {
            res.json(result);
        }).catch(err => {
            next(err);
        });
    });

module.exports = router;