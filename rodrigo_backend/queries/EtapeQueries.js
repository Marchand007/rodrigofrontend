const pool = require('./DBPool');

const getEtapesByRecetteId = async (recetteId) => {
    const result = await pool.query(
        `SELECT etape_id, ordre, description
        FROM Etape 
        WHERE recette_id = $1
        ORDER BY ordre`,
        [recetteId]
    );

    return result.rows.map(row => {
        const etape = {
            id: row.etape_id,
            ordre: row.ordre,
            description: row.description,
        };
        return etape;
    });
};
exports.getEtapesByRecetteId = getEtapesByRecetteId;