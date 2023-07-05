const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const HttpError = require('./HttpError');

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const crypto = require('crypto');


const recetteRouter = require('./routes/recetteRouter');

const commentRouter = require('./routes/commentRouter');

const etapeRouter = require('./routes/EtapeRouter');

const ingredientRouter = require('./routes/IngredientRouter');

const userAccountQueries = require("./queries/UserAccountQueries");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

// Pour servir les images et autres contenus statiques:
app.use(express.static(path.join(__dirname, 'public')));

// Classe qui surcharge la méthode _challenge() de BasicStrategy
// afin de modifier l'en-tête Www-Authenticate retourné lorsque l'authentification
// basic échoue. Si l'en-tête comporte la chaîne "Basic realm="..."", le comportement
// des navigateurs est de présenter un dialogue demandant de s'authentifier. On veut
// éviter cela, donc on ajoute un "x" au début.
class BasicStrategyModified extends BasicStrategy {
  constructor(options, verify) {
    return super(options, verify);
  }

  _challenge() {
    return 'xBasic realm="' + this._realm + '"';
  }
}



passport.use(new BasicStrategyModified((user_email, password, cb) => {
  userAccountQueries.getLoginByUserAccountEmail(user_email).then(login => {
    if (!login || !login.isActive) {
      // L'utilisateur est introuvable ou inactif, on appelle le callback cb
      // avec false en 2e paramètre
      return cb(null, false);
    }

    const iterations = 100000;
    const keylen = 64;
    const digest = "sha512";

    // Utilisation de la fonction pbkdf2() de la librairie crypto pour calculer le "hash"
    // du mot de passe:
    crypto.pbkdf2(password, login.passwordSalt, iterations, keylen, digest, (err, hashedPassword) => {
      if (err) {
        return cb(err);
      }

      // La colonne mot_de_passe_hash dans la BD contient le "hash" du mot de passe encodé
      // en base64, on le reconvertit en un buffer binaire pour l'utiliser avec la fonction
      // crypto.timingSafeEqual() :
      const passwordHashBuffer = Buffer.from(login.passwordHash, "base64");

      // timingSafeEqual() fait la comparaison de deux buffers dans un temps constant, afin
      // de prévenir les attaques temporelles (où on cherche à découvrir une information secrète
      // selon le temps de calcul que nécessite une opération) :
      if (!crypto.timingSafeEqual(passwordHashBuffer, hashedPassword)) {
        // Le mot de passe est incorrect, on appelle le callback cb
        // avec false en 2e paramètre
        return cb(null, false);
      }

      // L'authentification a réussi, on appelle le callback cb avec l'objet représentant
      // le compte utilisateur en 2e paramètre
      return cb(null, login);
    });
  }).catch(err => {
    return cb(err);
  });
}));


app.use('/recettes', recetteRouter);

app.use('/comments', commentRouter);

app.use('/etapes', etapeRouter);

app.use('/ingredients', ingredientRouter);


app.get('/login',
  passport.authenticate('basic', { session: false }),
  (req, res, next) => {
    // Une fois l'authentification effectuée, l'objet req contiendra
    // une propriété user avec l'objet représentant le compte utilisateur,
    // tel que défini dans la fonction de vérification passée au
    // constructeur de BasicStrategy(...) plus haut:
    if (req.user) {
      // On crée un nouvel objet pour la réponse en JSON, afin de ne pas
      // retourner le hash et salt du mot de passe:
      const userDetails = {
        courrielUtilisateur: req.user.courrielUtilisateur,
        nomComplet: req.user.nomComplet,
        isAdmin: req.user.isAdmin,
        isActive: req.user.isActive
      };

      res.json(userDetails);
    } else {
      return next({ status: 500, message: "Propriété user absente" });
    }
  }
);

// *** GESTION DES ERREURS ***

// Gestionnaire d'erreur, sera invoqué si on appelle next(...) en passant
// un objet d'erreur.
app.use((err, req, res, next) => {
  console.log("error handler: ", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500)
  if (err instanceof HttpError) {
    res.json(err.getJsonMessage());
  } else {
    res.json(err);
  }
});

module.exports = app;
