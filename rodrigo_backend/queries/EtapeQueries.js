const pool = require('./DBPool');

const getEtapesByRecetteId = async (recetteId) =>
{
    const result = await pool.query(
        `SELECT etape_id, ordre, description
        FROM Etape 
        WHERE recette_id = $1
        ORDER BY ordre`,
        [recetteId]
    );

    return result.rows.map(row =>
    {
        const etape = {
            id: row.etape_id,
            ordre: row.ordre,
            description: row.description,
        };
        return etape;
    });
};
exports.getEtapesByRecetteId = getEtapesByRecetteId;


const insertEtape = async (etape) =>
{
    const result = await pool.query(
        `INSERT INTO Etape (recette_id, ordre, description)
        VALUES ($1, $2, $3)`,
        [etape.recetteId, etape.ordre, etape.description]
    );

    return result;
};
exports.insertEtape = insertEtape;


const updateEtape= async (recetteId) =>
{
    const result = await pool.query(
        `UPDATE Recette SET nom = $2, desc_court = $3, desc_long = $4, long_desc = $5, temps_prep_min = $6, temps_cuisson_min = $6, nb_portions = $7
        WHERE recette_id = $1`,
        [recetteId]
    );

    if (result.rowCount === 0)
    {
        // Aucune rangée modifiée, veut dire que l'id n'existe pas
        return undefined;
    }

    return getRecetteById(recetteId);
};
exports.updateEtape = updateEtape;
