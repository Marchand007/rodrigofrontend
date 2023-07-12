const pool = require('./DBPool');

const getIngredientsByRecetteId = async (recetteId) => {
    const result = await pool.query(
        `SELECT ingredient_id, ordre, quantite, unite_mesure, nom
        FROM ingredient
        WHERE recette_id = $1
        ORDER BY ordre`,
        [recetteId]
    );

    return result.rows.map(row => {
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
