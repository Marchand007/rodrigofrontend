const express = require('express');
const router = express.Router();
const passport = require('passport');

const HttpError = require("../HttpError");

const appreciationQueries = require("../queries/AppreciationQueries");


router.get('/:id', (req, res, next) =>
{
    const id = req.params.id;
    console.log("id:", id);
    if (id == null || id === "") {
        return next(new HttpError(400, `Le parametre Id est requis`));
    }
    appreciationQueries.getAppreciationByRecetteId(id).then(appreciation =>
    {
        
        if (appreciation)
        {
           
            res.json(appreciation);
        } else
        {
            return next(new HttpError(404, `Recette ${id} introuvable`));
        }
    }).catch(err =>
    {
        return next(err);
    });
});

router.post('/',
    passport.authenticate('basic', {session: false}),
    (req,res,next) => {

        const recetteId = req.body.recetteId;
        if(!recetteId || recetteId === ""){
            return next(new HttpError(400, 'Le champ recetteId est requis'));
        }

        const user = req.user;
    
        if(!user){
            return next(new HttpError(403, "Vous devez avoir un compte utilisateur pour ajouter une appreciation"));
        }

        appreciationQueries.getUserAppreciationByRecetteId(user.courrielUtilisateur, recetteId).then(result => {

            if(result == 1){
                return next(new HttpError(400, `${user.courrielUtilisateur} a deja donne une appreciation sur la recette ${recetteId}`));
            }

            const nouvAppreciation = {
                courrielUtilisateur: "" + user.courrielUtilisateur,
                recetteId: "" + recetteId,
                note: "" + req.body.note
            };

            return appreciationQueries.insertAppreciationToRecipe(nouvAppreciation);
        }).then(result => {
            res.json(result);
        }).catch(err => {
            next(err);
        });
    });


module.exports = router;
