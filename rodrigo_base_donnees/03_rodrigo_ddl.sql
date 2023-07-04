DROP TABLE IF EXISTS Recette;
DROP TABLE IF EXISTS Etape;
DROP TABLE IF EXISTS Ingredient;
DROP TABLE IF EXISTS Utilisateur;
DROP TABLE IF EXISTS Commentaire;
DROP TABLE IF EXISTS Appreciation;


CREATE TABLE Recette (
	id text PRIMARY KEY,
	nom text NOT NULL UNIQUE,
	desc_long text NOT NULL,
	desc_court text NOT NULL,
	temps_prep_min integer,
	temps_cuisson_min integer,
	nb_portions integer,
	image_content bytea,
	is_active boolean NOT NULL DEFAULT true
);


CREATE TABLE Utilisateur (
	courriel text PRIMARY KEY,
	nom_complet text,
	password_hash text,
	password_salt text,
	is_active boolean NOT NULL DEFAULT true,
	is_admin boolean NOT NULL DEFAULT false
);


CREATE TABLE Commentaire (
	id serial PRIMARY KEY,
	courriel_utilisateur text NOT NULL REFERENCES Utilisateur (courriel) ON DELETE CASCADE,
	recette_id text NOT NULL REFERENCES Recette (id) ON DELETE CASCADE,
	texte text NOT NULL,
	date_publication date NOT NULL
);

CREATE TABLE Appreciation (
	id serial PRIMARY KEY,
	courriel_utilisateur text NOT NULL REFERENCES Utilisateur (courriel) ON DELETE CASCADE,
	recette_id text NOT NULL REFERENCES Recette (id) ON DELETE CASCADE,
	note integer NOT NULL
);


CREATE TABLE Ingredient (
	id serial PRIMARY KEY,
	recette_id text NOT NULL REFERENCES Recette (id) ON DELETE CASCADE,
	quantite decimal,
	unite_mesure text,
	nom text NOT NULL
);

CREATE TABLE Etape (
	id serial PRIMARY KEY,
	recette_id text NOT NULL REFERENCES Recette (id) ON DELETE CASCADE,
	ordre integer NOT NULL,
	description text NOT NULL
);
