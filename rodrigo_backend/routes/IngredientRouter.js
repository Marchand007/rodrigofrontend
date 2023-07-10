const express = require('express');
const router = express.Router();
const passport = require('passport');

const HttpError = require("../HttpError");

const ingredientQueries = require("../queries/IngredientQueries");

router.get('/:id', (req, res, next) =>
{
    const id = req.params.id;
    if (id == null || id === "")
    {
        return next(new HttpError(400, `Le parametre Id est requis`));
    }
    ingredientQueries.getIngredientsByRecetteId(id).then(ingredients =>
    {

        if (ingredients)
        {
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

module.exports = router;
