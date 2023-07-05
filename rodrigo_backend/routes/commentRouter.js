const express = require('express');
const router = express.Router();
const passport = require('passport');

const HttpError = require("../HttpError");

const commentQueries = require("../queries/CommentQueries");

router.get('/:id', (req,res,next) => {
    const recetteId = req.params.id;
    console.log("recetteId :", recetteId);
    if (!recetteId || recetteId === '') {
        return next(new HttpError(400, 'Le champ recetteId est requis'));
    }
    commentQueries.getCommentByRecetteId(recetteId).then(comment =>{
        if(comment){
            res.json(comment);
        }

    }).catch(err => {
        return next(err);
    });
});

router.post('/:id',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => 
    {
        const recetteId = req.params.id;
        if (recetteId || recetteId === '') {
            return next(new HttpError(400, 'Le champ recetteId est requis'));
        }

        const user = req.user;
        if (!user) {
            return next(new HttpError(403, "Vous avoir un compte utilisateur pour publier un commentaire"));
        }

        recetteId.getCommentByRecetteId(id).then(comment => {

            if(comment.courrielUtilisateur === user.courrielUtilisateur){
                return next(new HttpError(400, `${user.courrielUtilisateur} a déjà fait une publication sur la recette ${recetteId}`));
            }
            const nouvCommentaire = {
                courrielUtilisateur: "" + req.body.courriel_utilisateur,
                recetteId: "" + id,
                texte: "" + req.body.texte,
                datePublication: "" + req.body.date_publication
            };

            return commentQueries.insertCommentToRecipe(id, nouvCommentaire);
        }).then(result => {
            res.json(result);
        }).catch(err => {
            next(err);
        });
    });

    module.exports = router;