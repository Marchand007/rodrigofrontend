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


module.exports = router;
