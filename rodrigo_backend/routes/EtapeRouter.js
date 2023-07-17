const express = require('express');
const router = express.Router();

const HttpError = require("../HttpError");

const etapeQueries = require("../queries/EtapeQueries");
const recetteQueries = require("../queries/RecetteQueries");


router.get('/:id', (req, res, next) => {
    const recetteId = req.params.id;
    if (recetteId == null || recetteId === "") {
        return next(new HttpError(400, `Le parametre recetteId est requis`));
    }

    recetteQueries.getRecetteById(recetteId).then(recette => {
        if (!recette) {
            return next(new HttpError(404, `La recette ${recetteId} est inexistante ou introuvable`));
        }
    }).catch(err => {
        return next(err);
    });

    etapeQueries.getEtapesByRecetteId(recetteId).then(etapes => {
        if (etapes) {
            res.json(etapes);
        } else {
            return next(new HttpError(404, `Liste d'étapes pour la recette ${recetteId} inexistante ou introuvable`));
        }
    }).catch(err => {
        return next(err);
    });
});

module.exports = router;
