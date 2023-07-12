const express = require('express');
const router = express.Router();
const passport = require('passport');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const HttpError = require("../HttpError");

const recetteQueries = require("../queries/RecetteQueries");

router.get('/', (req, res, next) =>
{
    recetteQueries.getAllRecettes().then(recettes =>
    {
        res.json(recettes);
    }).catch(err =>
    {
        return next(err);
    });
});

router.get('/:id', (req, res, next) =>
{


    const recetteId = req.params.id;
    recetteQueries.getRecetteById(recetteId).then(recette =>
    {
        if (recette)
        {
            res.json(recette);
        } else
        {
            return next(new HttpError(404, `Recette ${recetteId} inexistante ou introuvable`));
        }
    }).catch(err =>
    {
        return next(err);
    });
});

const onePixelTransparentPngImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=", "base64");

router.get('/:id/image', (req, res, next) =>
{
    const recetteId = req.params.id;

    recetteQueries.getRecetteById(recetteId).then(recette =>
    {
        if (!recette)
        {
            return next(new HttpError(404, `La recette ${recetteId} est inexistante ou introuvable`));
        }
    }).catch(err =>
    {
        return next(err);
    });

    recetteQueries.getRecetteImageContent(recetteId).then(imageInfo =>
    {
        if (imageInfo && imageInfo.imageContent)
        {
            if (imageInfo.imageContentType)
            {
                res.header('Content-Type', imageInfo.imageContentType);
            }
            res.send(imageInfo.imageContent);
        } else
        {
            res.header('Content-Type', 'image/png');
            res.send(onePixelTransparentPngImage);
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
        const user = req.user;

        if (!user || !user.isAdmin)
        {
            return next(new HttpError(403, "Droit administrateur requis"));
        }
        const recetteId = req.body.recetteId;
        if (!recetteId || recetteId === '')
        {
            return next(new HttpError(400, 'Le champ recetteId est requis'));
        }

        recetteQueries.getRecetteById(recetteId).then(recette =>
        {
            if (recette)
            {
                throw new HttpError(409, `Une recette avec le id ${recetteId} existe déjà`);
            }

            const nouvRecette = {
                recetteId: "" + req.body.recetteId,
                nom: "" + req.body.nom,
                image: "" + req.body.image,
                descCourt: "" + req.body.descCourt,
                descLong: "" + req.body.descLong,
                tempsPrepMin: "" + req.body.tempsPrepMin,
                tempsCuissonMin: "" + req.body.tempsCuissonMin,
                nbPortions: "" + req.body.nbPortions,
                ingredients: req.body.ingredients,
                etapes: req.body.etapes
            };

            return recetteQueries.insertRecette(nouvRecette);
        }).then(result =>
        {
            if (!result)
            {
                return next(new HttpError(404, `Recette ${recetteId} introuvable`));
            }
            res.json(result);
        }).catch(err =>
        {
            next(err);
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

        const recetteId = req.params.id;
        if (!recetteId || recetteId === '')
        {
            return next(new HttpError(400, 'Le paramètre recetteId est requis'));
        }

        recetteQueries.getRecetteById(recetteId).then(recette =>
        {
            if (!recette)
            {
                return next(new HttpError(404, `La recette ${recetteId} est inexistante ou introuvable`));
            }
            if (recetteId != req.body.id)
            {
                return next(new HttpError(400, `Le paramètre spécifie l'id ${recetteId} alors que la recette fourni a l'id ${req.body.id}`));
            }
        }).catch(err =>
        {
            return next(err);
        });

        const nouvRecette = {
            recetteId: "" + recetteId,
            nom: "" + req.body.nom,
            image: "" + req.body.image,
            descCourt: "" + req.body.descCourt,
            descLong: "" + req.body.descLong,
            tempsPrepMin: "" + req.body.tempsPrepMin,
            tempsCuissonMin: "" + req.body.tempsCuissonMin,
            nbPortions: "" + req.body.nbPortions,
            ingredients: req.body.ingredients,
            etapes: req.body.etapes
        };

        recetteQueries.updateRecette(nouvRecette).then(result =>
        {
            if (!result)
            {
                return next(new HttpError(404, `Recette ${recetteId} introuvable`));
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

        const recetteId = req.params.id;
        if (!recetteId || recetteId === '')
        {
            return next(new HttpError(400, 'Le paramètre recetteId est requis'));
        }

        recetteQueries.getRecetteById(recetteId).then(recette =>
        {
            if (!recette)
            {
                return next(new HttpError(404, `La recette ${recetteId} est inexistante ou introuvable`));
            }
        }).catch(err =>
        {
            return next(err);
        }).then(result =>
        {
            recetteQueries.deleteRecette(recetteId).then(result =>
            {
                if (!result)
                {
                    return next(new HttpError(400, `Erreur lors de la suppresion de la recette`));
                }
                res.json(result);
            }).catch(err =>
            {
                return next(err);
            });
        })



    });


router.post('/:id/image',
    passport.authenticate('basic', { session: false }),
    upload.single('recette-image'),
    (req, res, next) =>
    {
        const recetteId = req.params.id;
        if (!recetteId || recetteId === '')
        {
            return next(new HttpError(400, 'Le champ recetteId est requis'));
        }

        recetteQueries.getRecetteById(recetteId).then(recette =>
        {
            if (!recette)
            {
                throw new HttpError(404, `La recette ${recetteId} est inexistante ou introuvable`);
            }
            return recetteQueries.updateRecetteImage(recetteId, req.file.buffer, req.file.mimetype);
        }).then(imageInfo =>
        {
            res.send("");
        }).catch(err =>
        {
            next(err);
        });

    });

module.exports = router;
