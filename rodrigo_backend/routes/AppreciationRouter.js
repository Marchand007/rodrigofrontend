const express = require('express');
const router = express.Router();
const passport = require('passport');

const HttpError = require("../HttpError");

const appreciationQueries = require("../queries/AppreciationQueries");


router.get('/:id', (req, res, next) =>
{
    const id = req.params.id;
    if (id == null || id === "")
    {
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


router.get('/:id/:user', (req, res, next) =>
{
    const id = req.params.id;
    const user = req.params.user;

    if (id == null || id === "")
    {
        return next(new HttpError(400, `Le parametre Id est requis`));
    }
    if (user == null || user === "")
    {
        return next(new HttpError(400, `Le parametre user est requis`));
    }

    appreciationQueries.getUserAppreciationByRecetteId(id, user).then(appreciation =>
    {
        if (appreciation)
        {
            res.json(appreciation);
        } else
        {
            return next(new HttpError(404, `Appreciation de ${user} pour la recette ${recetteId} introuvable`));
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

        const recetteId = req.body.recetteId;
        if (!recetteId || recetteId === "")
        {
            return next(new HttpError(400, 'Le champ recetteId est requis'));
        }

        const user = req.user;
        if (!user)
        {
            return next(new HttpError(403, "Vous devez avoir un compte utilisateur pour ajouter une appreciation"));
        }

        appreciationQueries.getUserAppreciationByRecetteId(recetteId, user.courrielUtilisateur).then(result =>
        {
            if (result.note > 0)
            {
                return next(new HttpError(400, `${user.courrielUtilisateur} a deja donne une appreciation sur la recette ${recetteId}`));
            }

            const nouvAppreciation = {
                courrielUtilisateur: "" + user.courrielUtilisateur,
                recetteId: "" + recetteId,
                note: "" + req.body.note
            };

            return appreciationQueries.insertAppreciationToRecipe(nouvAppreciation);
        }).then(result =>
        {
            res.json(result);
        }).catch(err =>
        {
            next(err);
        });
    });


module.exports = router;
