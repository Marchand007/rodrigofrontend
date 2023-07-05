const express = require('express');
const router = express.Router();
const passport = require('passport');

// Le module multer sert à gérer les téléversements (upload) de fichiers
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const HttpError = require("../HttpError");

const etapeQueries = require("../queries/EtapeQueries");


router.get('/:id', (req, res, next) =>
{
    const id = req.params.id;
    console.log("id:", id);
    if (id == null || id === "") {
        return next(new HttpError(400, `Le parametre Id est requis`));
    }
    etapeQueries.getEtapesByRecetteId(id).then(ingredients =>
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


router.put('/:id',
    passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        const user = req.user;

        if (!user || !user.isAdmin)
        {
            return next(new HttpError(403, "Droit administrateur requis"));
        }

        const id = req.params.id;
        if (!id || id === '')
        {
            return next(new HttpError(400, 'Le paramètre id est requis'));
        }

        if (id !== req.body.id)
        {
            return next(new HttpError(400, `Le paramètre spécifie l'id ${id} alors que la recette fourni a l'id ${req.body.id}`));
        }

        const nouvRecette = {
            id: "" + id,
            nom: "" + req.body.nom,
            image: "" + req.body.image,
            descCourt: "" + req.body.descCourt,
            descLong: "" + req.body.descLong,
            tempsPrepMin: "" + req.body.tempsPrepMin,
            tempsCuissonMin: "" + req.body.tempsCuissonMin,
            nbPortions: "" + req.body.nbPortions,
            isActive: "" + req.body.isActive
        };

        recetteQueries.updateRecette(nouvRecette).then(result =>
        {
            if (!result)
            {
                return next(new HttpError(404, `Recette ${id} introuvable`));
            }

            res.json(result);
        }).catch(err =>
        {
            return next(err);
        });

    });


router.delete('/:id',
    passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        const user = req.user;

        if (!user || !user.isAdmin)
        {
            return next(new HttpError(403, "Droit administrateur requis"));
        }

        const id = req.params.id;
        if (!id || id === '')
        {
            return next(new HttpError(400, 'Le paramètre id est requis'));
        }
        recetteQueries.hideRecette(id).then(result =>
        {
            if (!result)
            {
                return next(new HttpError(404, `Recette ${id} introuvable`));
            }

            res.json(result);
        }).catch(err =>
        {
            return next(err);
        });
    });


module.exports = router;
