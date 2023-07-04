const pool = require('./DBPool');

const getImagePathForRecetteId = recetteId => `/recettes/${recetteId}/image`;
exports.getImagePathForRecetteId = getImagePathForRecetteId;

const addImagePathToRecette = recette =>
{
    return {
        id: recette.id,
        nom: recette.nom,
        descCourt: recette.descCourt,
        descLong: recette.descLong,
        image: getImagePathForRecetteId(recette.id),
        tempsPrepMin: recette.tempsPrepMin,
        tempsCuissonMin: recette.tempsCuissonMin,
        nbPortions: recette.nbPortions,
        isActive: recette.isActive
    };
};


const getAllRecettes = async () =>
{
    const result = await pool.query(
        `SELECT recette_id, nom, desc_court, desc_long, temps_prep_min, temps_cuisson_min, nb_portions, is_active
        FROM Recette 
        ORDER BY recette_id`
    );

    return result.rows.map(row =>
    {
        if (row.is_active)
        {
            const recette = {
                id: row.recette_id,
                nom: row.nom,
                descLong: row.desc_long,
                descCourt: row.desc_court,
                tempsPrepMin: row.temps_prep_min,
                tempsCuissonMin: row.temps_cuisson_min,
                nbPortions: row.nb_portions,
                isActive: row.is_active
            };

            const recetteWithImagePath = addImagePathToRecette(recette);
            return recetteWithImagePath;
        }
    });
};
exports.getAllRecettes = getAllRecettes;


const getRecetteById = async (recetteId) =>
{
    const result = await pool.query(
        `SELECT recette_id, nom, desc_court, desc_long, temps_prep_min, temps_cuisson_min, nb_portions, is_active
        FROM Recette
        WHERE recette_id = $1`,
        [recetteId]
    );

    const row = result.rows[0];
    if (row)
    {
        if (!row.is_active)
        {
            throw new Error("Impossible de charger cette recette car elle est supprimée");
        }
        const recette = {
            id: row.recette_id,
            nom: row.nom,
            descLong: row.desc_long,
            descCourt: row.desc_court,
            tempsPrepMin: row.temps_prep_min,
            tempsCuissonMin: row.temps_cuisson_min,
            nbPortions: row.nb_portions,
            isActive: row.is_active
        };

        return addImagePathToRecette(recette);
    }
    return undefined;
};
exports.getRecetteById = getRecetteById;


/**
 * Fonction permettant d'obtenir le contenu binaire de la colonne image_content et son type
 * (colonne image_content_type). Utilisé par un endpoint qui offre le téléchargement d'une image
 * de produit stockée dans la table product de la BD.
 * 
 * @param {string} recetteId 
 * @returns Promesse pour un objet avec deux propriétés :
 *          imageContent : un Buffer avec le contenu binaire de l'image
 *          imageContentType : une chaîne de caractères avec le Content-Type de l'image (p.ex. "image/jpeg")
 */
const getRecetteImageContent = async (recetteId) =>
{
    const result = await pool.query(
        `SELECT image_content, image_content_type FROM Recette WHERE recette_id = $1`,
        [recetteId]
    );

    const row = result.rows[0];
    if (row)
    {
        return {
            imageContent: row.image_content,
            imageContentType: row.image_content_type
        };
    }

    return undefined;
};
exports.getRecetteImageContent = getRecetteImageContent;


const insertRecette = async (recette) =>
{
    const result = await pool.query(
        `INSERT INTO Recette (recette_id, nom, desc_court, desc_long, temps_prep_min, temps_cuisson_min, nb_portions, is_active) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [recette.id, recette.nom, recette.descCourt, recette.descLong, recette.tempsPrepMin, recette.tempsCuissonMin, recette.nbPortions, true]
    );

    return getRecetteById(recette.id);
};
exports.insertRecette = insertRecette;


const updateRecette = async (recette) =>
{
    const result = await pool.query(
        `UPDATE Recette SET nom = $2, desc_court = $3, desc_long = $4, long_desc = $5, temps_prep_min = $6, temps_cuisson_min = $6, nb_portions = $7
        WHERE recette_id = $1`,
        [recette.id, recette.nom, recette.descCourt, recette.descLong, recette.tempsPrepMin, recette.tempsCuissonMin, recette.nbPortions]
    );

    if (result.rowCount === 0)
    {
        // Aucune rangée modifiée, veut dire que l'id n'existe pas
        return undefined;
    }

    return getRecetteById(recette.id);
};
exports.updateRecette = updateRecette;


const hideRecette = async (recetteId) =>
{
    const result = await pool.query(
        `UPDATE Recette SET is_active = false
        WHERE recette_id = $1`,
        [recetteId]
    );

    if (result.rowCount === 0)
    {
        // Aucune rangée modifiée, veut dire que l'id n'existe pas
        return undefined;
    }

    return {};
};
exports.hideRecette = hideRecette;


const updateRecetteImage = async (recetteId, imageBuffer, imageContentType) =>
{
    const result = await pool.query(
        `UPDATE Recette SET image_content = $2, image_content_type = $3
        WHERE recette_id = $1`,
        [recetteId, imageBuffer, imageContentType]
    );

    if (result.rowCount === 0)
    {
        throw new Error("Erreur lors de la mise-à-jour de l'image");
    }

    return getRecetteImageContent(recetteId);
};
exports.updateRecetteImage = updateRecetteImage;
