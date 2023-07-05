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
            nombreAppreciation: row.count,
        };
        return appreciation;

    };
}
    exports.getAppreciationByRecetteId = getAppreciationByRecetteId;