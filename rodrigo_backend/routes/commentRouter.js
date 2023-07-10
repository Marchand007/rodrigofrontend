const express = require('express');
const router = express.Router();
const passport = require('passport');

const HttpError = require("../HttpError");

const commentQueries = require("../queries/CommentQueries");

router.get('/:id', (req, res, next) => {
    const recetteId = req.params.id;
    if (!recetteId || recetteId === '') {
        return next(new HttpError(400, 'Le champ recetteId est requis'));
    }
    commentQueries.getCommentByRecetteId(recetteId).then(comment => {
        if (comment) {
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

    commentQueries.getUserCommentByRecetteId(id, user).then(commentaire => {
        if (commentaire) {
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
        if (recetteId == "") {
            return next(new HttpError(400, 'Le champ recetteId est requis'));
        }

        const user = req.user;
        if (!user) {
            return next(new HttpError(403, "Vous devez avoir un compte utilisateur pour publier un commentaire"));
        }

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