const pool = require('./DBPool');
const { DateTime } = require('luxon');

const getCommentByRecetteId = async (recetteId) => {
    const result = await pool.query(
        `SELECT C.courriel_utilisateur, C.texte, C.date_publication, U.nom_complet
        FROM commentaire as C
        JOIN Utilisateur as U ON U.courriel_utilisateur = C.courriel_utilisateur
        WHERE recette_id = $1
        ORDER BY date_publication ASC`,
        [recetteId]
    );
    return result.rows.map(row => {
        const commentaire = {
            nomUtilisateur: row.nom_complet,
            courrielUtilisateur: row.courriel_utilisateur,
            commentUtilisateur: row.texte,
            commentDatePublication: row.date_publication
        };
        return commentaire;
    });
};

exports.getCommentByRecetteId = getCommentByRecetteId;

const getUserCommentByRecetteId = async (recetteId, courriel_utilisateur, clientParam) => {
    const client = clientParam || await pool.connect();

    if(!clientParam){
        await client.query('BEGIN');
    }

    try {
        const result = await client.query(
            `SELECT COUNT(courriel_utilisateur) as result
        FROM commentaire
        WHERE courriel_utilisateur = $1 AND recette_id = $2`,
            [courriel_utilisateur, recetteId]
        );

        const row = result.rows[0];

        if (row.result > 0) {
            const resultCommentaire = await client.query(
                `SELECT texte
                FROM commentaire
                WHERE courriel_utilisateur = $1 AND recette_id = $2`,
                [courriel_utilisateur, recetteId]
            );

            const userTexte = resultCommentaire.rows[0];
            return userTexte;
        }

        await client.query("COMMIT");

        return row;

    } catch (error) {
        await client.qwery("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }


};

exports.getUserCommentByRecetteId = getUserCommentByRecetteId;


const insertCommentToRecipe = async (comment) => {

    //TRY CATCH
    const commentDateTime = DateTime.now();

    const result = await pool.query(
        `INSERT INTO commentaire (courriel_utilisateur, recette_id, texte, date_publication)
        VALUES ($1, $2, $3, $4)`,
        [comment.courrielUtilisateur, comment.recetteId, comment.texte, commentDateTime]
    );

    return {
        message: "Le commentaire a bien été enregistré!"
    };
};

exports.insertCommentToRecipe = insertCommentToRecipe;