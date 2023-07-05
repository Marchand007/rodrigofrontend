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


const insertEtapes = async (recetteId) =>
{
    const result = await pool.query(
        `INSERT INTO Recette (recette_id, nom, desc_court, desc_long, temps_prep_min, temps_cuisson_min, nb_portions, is_active) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [recetteId]
    );

    return getRecetteById(recetteId);
};
exports.insertEtapes = insertEtapes;


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
