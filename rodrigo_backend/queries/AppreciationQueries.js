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

const getUserAppreciationByRecetteId = async (recetteId, courriel_utilisateur, clientParam) =>
{
    const client = clientParam || await pool.connect();


    try
    {
        if (!clientParam)
        {
            await client.query('BEGIN');
        }
        const result = await client.query(
            `SELECT COUNT(courriel_utilisateur) as note
        FROM Appreciation
        WHERE courriel_utilisateur = $1 AND recette_id = $2`,
            [courriel_utilisateur, recetteId]
        );
        const row = result.rows[0];

        if (row.note > 0)
        {
            const resultAppreciation = await client.query(
                `SELECT note
            FROM Appreciation
            WHERE courriel_utilisateur = $1 AND recette_id = $2`,
                [courriel_utilisateur, recetteId]
            );
            const row = resultAppreciation.rows[0];
            return row; 
        }

        await client.query("COMMIT");

        return row;

    }
    catch (error)
    {
        await client.query("ROLLBACK");
        throw error;
    }
    finally
    {
        client.release();

    }
}
exports.getUserAppreciationByRecetteId = getUserAppreciationByRecetteId;

const insertAppreciationToRecipe = async (appreciation) =>
{
    console.log("appreciation recu : ", appreciation.courrielUtilisateur, appreciation.recetteId, appreciation.note)
    //TRY CATCH
    const result = await pool.query(
        `INSERT INTO appreciation(courriel_utilisateur, recette_id, note)
        VALUES ($1, $2, $3)`,
        [appreciation.courrielUtilisateur, appreciation.recetteId, appreciation.note]
    );
    return {
        message: "L'ajout de l'appreciation a bien été fait",
        note: appreciation.note
    };
};

exports.insertAppreciationToRecipe = insertAppreciationToRecipe;