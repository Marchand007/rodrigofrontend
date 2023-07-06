const express = require('express');
const router = express.Router();
const passport = require('passport');

const HttpError = require("../HttpError");

const etapeQueries = require("../queries/EtapeQueries");


router.get('/:id', (req, res, next) =>
{
    const id = req.params.id;
    console.log("id:", id);
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
        if (req.body.description == "")
        {
            return next(new HttpError(400, 'Le champ description est requis'));
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
        const nouvEtape = {
            recetteId: "" + req.body.recetteId,
            ordre: "" + req.body.ordre,
            description: "" + req.body.description
        };

        return etapeQueries.insertEtape(nouvEtape);
    });

module.exports = router;
