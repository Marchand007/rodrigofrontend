const express = require('express');
const router = express.Router();
const passport = require('passport');

const HttpError = require("../HttpError");

const appreciationQueries = require("../queries/AppreciationQueries");
const recetteQueries = require("../queries/RecetteQueries");
const userAccountQueries = require("../queries/UserAccountQueries");


router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    if (id == null || id === "") {
        return next(new HttpError(400, `Le parametre Id est requis`));
    }
    recetteQueries.getRecetteById(id).then(recette => {
        if (!recette) {
            return next(new HttpError(404, `La recette ${id} est inexistante ou introuvable`));
        }
    }).catch(err => {
        return next(err);
    });

    appreciationQueries.getAppreciationByRecetteId(id).then(appreciation => {
        if (appreciation) {
            res.json(appreciation);
        } else {
            return next(new HttpError(404, `Recette ${id} n'a pas encore reçu de notes d'appréciation`));
        }
    }).catch(err => {
        return next(err);
    });
});


router.get('/:id/:user',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        const recetteId = req.params.id;
        const user = req.params.user;

        if (recetteId == null || recetteId === "") {
            return next(new HttpError(400, `Le parametre recetteId est requis`));
        }
        if (user == null || user === "") {
            return next(new HttpError(400, `Le parametre user est requis`));
        }

        recetteQueries.getRecetteById(recetteId).then(recette => {
            if (!recette) {
                return next(new HttpError(404, `La recette ${recetteId} est inexistante ou introuvable`));
            }
        }).catch(err => {
            return next(err);
        });

        userAccountQueries.getLoginByUserAccountEmail(user).then(userEmail => {
            console.log("USEREMAIL :", userEmail);
            if (userEmail) {
                if (userEmail.courrielUtilisateur != req.user.courrielUtilisateur) {
                    return next(new HttpError(403, `Vous devez être le même utilisateur pour voir l'appréciation`));
                }
            } else {
                return next(new HttpError(404, `Le compte utilisateur ${user} est inexistant ou introuvable`));
            }
        }).catch(err => {
            return next(err);
        });

        appreciationQueries.getUserAppreciationByRecetteId(id, user).then(appreciation => {
            if (appreciation) {
                if (appreciation.note == 0) {
                    return next(new HttpError(404, `${user} n'a pas encore donné une note d'appréciation sur la recette ${id}`));
                }
                res.json(appreciation);
            } else {
                return next(new HttpError(404, `Appreciation de ${user} pour la recette ${recetteId} introuvable`));
            }
        }).catch(err => {
            return next(err);
        });
    });

router.post('/',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {

        const recetteId = req.body.recetteId;

        if (!recetteId || recetteId === "") {
            return next(new HttpError(400, 'Le champ recetteId est requis'));
        }

        recetteQueries.getRecetteById(recetteId).then(recette => {
            if (!recette) {
                return next(new HttpError(404, `La recette ${recetteId} est inexistante ou introuvable`));
            }
        }).catch(err => {
            return next(err);
        });

        const user = req.user;

        appreciationQueries.getUserAppreciationByRecetteId(recetteId, user.courrielUtilisateur).then(result => {
            if (result.note > 0) {
                return next(new HttpError(400, `${user.courrielUtilisateur} a déjà donné une note d'appréciation de ${result.note} sur la recette ${recetteId}`));
            }

            const nouvAppreciation = {
                courrielUtilisateur: "" + user.courrielUtilisateur,
                recetteId: "" + recetteId,
                note: "" + req.body.note
            };

            return appreciationQueries.insertAppreciationToRecipe(nouvAppreciation);
        }).then(result => {
            res.json(result);
        }).catch(err => {
            next(err);
        });
    });


module.exports = router;
