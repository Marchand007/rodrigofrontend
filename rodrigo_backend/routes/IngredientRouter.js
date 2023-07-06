const express = require('express');
const router = express.Router();
const passport = require('passport');

const HttpError = require("../HttpError");

const ingredientQueries = require("../queries/IngredientQueries");

router.get('/:id', (req, res, next) =>
{
    const id = req.params.id;
    console.log("id:", id);
    if (id == null || id === "")
    {
        return next(new HttpError(400, `Le parametre Id est requis`));
    }
    ingredientQueries.getIngredientsByRecetteId(id).then(ingredients =>
    {

        if (ingredients)
        {
            console.log("liste ingredient backened avant envoie : ", ingredients);
            res.json(ingredients);
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
    passport.authenticate('basic', { session: false }),
    (req, res, next) => 
    {
        if (req.body.recetteId == "")
        {
            return next(new HttpError(400, 'Le champ recetteId est requis'));
        }
        if (req.body.ordre == "")
        {
            return next(new HttpError(400, 'Le champ ordre est requis'));
        }
        if (req.body.texte == "")
        {
            return next(new HttpError(400, 'Le champ texte est requis'));
        }

        const user = req.user;
        if (!user)
        {
            return next(new HttpError(403, "Vous devez avoir un compte utilisateur pour publier un commentaire"));
        }
        else if (user && !user.isAdmin)
        {
            return next(new HttpError(404, "Vous n'avez pas les droits d'acces requis"));
        }
        const nouvIngredient = {
            recetteId: "" + req.body.recetteId,
            ordre: "" + req.body.ordre,
            nom: "" + req.body.nom,
            quantite: "" + req.body.quantite,
            uniteMesure: "" + req.body.uniteMesure
        };

        return ingredientQueries.insertIngredient(nouvIngredient);
    });


module.exports = router;
