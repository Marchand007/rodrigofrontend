const pool = require('./DBPool');

const getIngredientsByRecetteId = async (recetteId) =>
{
    const result = await pool.query(
        `SELECT ingredient_id, ordre, quantite, unite_mesure, nom
        FROM ingredient
        WHERE recette_id = $1
        ORDER BY ordre`,
        [recetteId]
    );

    return result.rows.map(row =>
    {
        const ingredient = {
            id: row.ingredient_id,
            ordre: row.ordre,
            quantite: row.quantite,
            uniteMesure: row.unite_mesure,
            nom: row.nom,
        };
        return ingredient;
    });
};
exports.getIngredientsByRecetteId = getIngredientsByRecetteId;


const insertIngredients = async (recetteId) =>
{
    const result = await pool.query(
        `INSERT INTO Recette (recette_id, nom, desc_court, desc_long, temps_prep_min, temps_cuisson_min, nb_portions, is_active) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [recetteId]
    );

    return getRecetteById(recetteId);
};
exports.insertIngredients = insertIngredients;


const updateIngredients= async (recetteId) =>
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
exports.updateIngredients = updateIngredients;
