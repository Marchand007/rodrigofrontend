const express = require('express');
const router = express.Router();
const passport = require('passport');

const HttpError = require("../HttpError");

const etapeQueries = require("../queries/EtapeQueries");


router.get('/:id', (req, res, next) =>
{
    const id = req.params.id;
    if (id == null || id === "")
    {
        return next(new HttpError(400, `Le parametre Id est requis`));
    }
    etapeQueries.getEtapesByRecetteId(id).then(etapes =>
    {

        if (etapes)
        {

            res.json(etapes);
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
