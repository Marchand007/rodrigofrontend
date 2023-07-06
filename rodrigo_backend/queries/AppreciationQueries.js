const pool = require('./DBPool');

const getAppreciationByRecetteId = async (recetteId) =>
{
    const result = await pool.query(
        `SELECT COUNT(appreciation_id), AVG(note)
        FROM Appreciation 
        WHERE recette_id = $1`,
        [recetteId]
    );
    
    const row = result.rows[0];
    if (row)
    {
        const appreciation = {
            moyenneAppreciation: row.avg,
            nombreAppreciation: row.count
        };
        return appreciation;

    };
};

exports.getAppreciationByRecetteId = getAppreciationByRecetteId;

const getUserAppreciationByRecetteId = async(courriel_utilisateur, recetteId) => {
    const result = await pool.query(
        `SELECT COUNT(courriel_utilisateur)
        FROM Appreciation
        WHERE courriel_utilisateur = $1 AND recette_id = $2`,
        [courriel_utilisateur, recetteId]
    );
}
exports.getUserAppreciationByRecetteId = getUserAppreciationByRecetteId;

const insertAppreciationToRecipe = async (appreciation) => {
    //TRY CATCH
    const result = await pool.query(
        `INSERT INTO appreciation(courriel_utilisateur, recette_id, note)
        VALUES ($1, $2, $3)`,
        [appreciation.courrielUtilisateur, appreciation.recetteId, appreciation.note]
    );
    
    return {
        message : "L'ajout de l'appreciation a bien été fait"
    };
};

exports.insertAppreciationToRecipe = insertAppreciationToRecipe;