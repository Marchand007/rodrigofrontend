const pool = require('./DBPool');

const getCommentByRecetteId = async (recetteId) => {
    const result = await pool.query(
        `SELECT courriel_utilisateur, texte, date_publication
        FROM commentaire
        WHERE recette_id = $1
        ORDER BY date_publication ASC`,
        [recetteId]
    );
    return result.rows.map(row => {
        const commentaire = {
            courrielUtilisateur: row.courriel_utilisateur,
            commentUtilisateur: row.texte,
            commentDatePublication: row.date_publication
        };
        return commentaire;
    });
};

exports.getCommentByRecetteId = getCommentByRecetteId;


const insertCommentToRecipe = async (recetteId, comment) => {
    const commentDateTime = DateTime.now().toString();
    const result = await pool.query(
        `INSERT INTO commentaire (courriel_utilisateur, recette_id, texte, date_publication)
        VALUES ($1, $2, $3, $4)`,
        [comment.courriel_utilisateur, recetteId, comment.texte, commentDateTime]
    );
};

exports.insertCommentToRecipe = insertCommentToRecipe;