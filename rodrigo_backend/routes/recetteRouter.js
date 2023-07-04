const express = require('express');
const router = express.Router();
const passport = require('passport');

// Le module multer sert à gérer les téléversements (upload) de fichiers
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const HttpError = require("../HttpError");

const recetteQueries = require("../queries/RecetteQueries");

// GET de la liste des produits
// (Ne requiert pas d'authentification)
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


// GET d'un produit individuel
// (Ne requiert pas d'authentification)
router.get('/:id', (req, res, next) =>
{
    const id = req.params.id;
    console.log("id:", id);
    recetteQueries.getRecetteById(id).then(recette =>
    {
        if (recette)
        {
            res.json(recette);
        } else
        {
            return next(new HttpError(404, `Produit ${id} introuvable`));
        }
    }).catch(err =>
    {
        return next(err);
    });
});

const onePixelTransparentPngImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=", "base64");

// GET de l'image d'un produit
// (Ne requiert pas d'authentification)
router.get('/:id/image', (req, res, next) =>
{
    const id = req.params.id;
    console.log("id:", id);
    recetteQueries.getRecetteImageContent(id).then(imageInfo =>
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
            // Si le produit n'a pas d'image, on va retourner une image transparente de 1 pixel
            // afin d'éviter d'avoir une image brisée dans le front-end
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

        const id = req.body.id;
        if (!id || id === '')
        {
            // Le return fait en sorte qu'on n'exécutera pas le reste de la fonction
            // après l'appel à next(...).
            return next(new HttpError(400, 'Le champ id est requis'));
        }

        recetteQueries.getRecetteById(id).then(recette =>
        {
            if (recette)
            {
                throw new HttpError(409, `Un produit avec l'id ${id} existe déjà`);
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

            return recetteQueries.insertRecette(nouvRecette);
        }).then(result =>
        {
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

        const id = req.params.id;
        if (!id || id === '')
        {
            return next(new HttpError(400, 'Le paramètre id est requis'));
        }

        if (id !== req.body.id)
        {
            return next(new HttpError(400, `Le paramètre spécifie l'id ${id} alors que le produit fourni a l'id ${req.body.id}`));
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
                return next(new HttpError(404, `Produit ${id} introuvable`));
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
            return next(HttpError(403, "Droit administrateur requis"));
        }

        const id = req.params.id;
        if (!id || id === '')
        {
            return next(new HttpError(400, 'Le paramètre id est requis'));
        }
if (req.hide)
        recetteQueries.hideRecette(id).then(result =>
        {
            if (!result)
            {
                return next(new HttpError(404, `Produit ${id} introuvable`));
            }

            res.json(result);
        }).catch(err =>
        {
            return next(err);
        });
    });


router.post('/:id/image',
    passport.authenticate('basic', { session: false }),
    // Fonction middleware de multer pour gérer l'upload d'un fichier dans ce endpoint.
    // Cet appel de middleware doit venir après celui de l'authentification.
    upload.single('recette-image'), // doit correspondre à l'id du champ dans le formulaire html
    (req, res, next) =>
    {
        const id = req.params.id;
        if (!id || id === '')
        {
            // Le return fait en sorte qu'on n'exécutera pas le reste de la fonction
            // après l'appel à next(...).
            return next(new HttpError(400, 'Le champ id est requis'));
        }

        recetteQueries.getRecetteById(id).then(recette =>
        {
            if (!recette)
            {
                throw new HttpError(404, `Produit id ${id} introuvable`);
            }

            // Le middleware upload.single(...) rendra accessible le contenu binaire du fichier
            // téléversé dans req.file.buffer et le type de fichier (p.ex. "image/jpeg")
            // dans req.file.mimetype:
            return recetteQueries.updateRecetteImage(id, req.file.buffer, req.file.mimetype);
        }).then(imageInfo =>
        {
            res.send("");
        }).catch(err =>
        {
            next(err);
        });

    });

module.exports = router;
