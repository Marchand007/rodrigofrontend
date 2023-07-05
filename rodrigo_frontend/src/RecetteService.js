import session from './session';

class ServiceError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

async function getResponseMessage(response) {
    try {
        const obj = await response.json();
        return obj.message ? obj.message : "Erreur inconnue";
    } catch (err) {
        return "" + err;
    }
}

async function createServiceError(response) {
    return new ServiceError(response.status, await getResponseMessage(response));
}

const convertToRecette = jsonRecette => {
    return {
        id: jsonRecette.id,
        nom: jsonRecette.nom,
        descCourt: jsonRecette.descCourt,
        descLong: jsonRecette.descLong,
        image: jsonRecette.image,
        tempsPrepMin: jsonRecette.tempsPrepMin,
        tempsCuissonMin: jsonRecette.tempsCuissonMin,
        nbPortions: jsonRecette.nbPortions,
        isActive: jsonRecette.isActive
    };
};

/**
 * Récupère depuis l'API back-end la liste de tous les produits du catalogue
 * 
 * @returns Promesse permettant d'obtenir la liste des produits
 */
export async function fetchRecettes() {
    const response = await fetch('/api/recettes');

    if (response.ok) {
        const respJson = await response.json();
        return respJson.map(r => convertToRecette(r));
    } else {
        throw await createServiceError(response);
    }
}

/**
 * Récupère depuis l'API back-end un produit individuel du catalogue
 * 
 * @param {String} recetteId L'identifiant du produit à récupérer
 * @returns Promesse permettant d'obtenir le produit demandé
 */
export async function fetchRecette(recetteId) {
    const response = await fetch(`/api/recettes/${recetteId}`);

    if (response.ok) {
        return convertToRecette(await response.json());
    } else {
        throw await createServiceError(response);
    }
};

export async function updateRecette(recette) {
    const response = await fetch(`/api/recettes/${recette.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(recette)
    });

    if (response.ok) {
        return convertToRecette(await response.json());
    } else {
        throw await createServiceError(response);
    }
}

export async function createRecette(recette) {
    const response = await fetch(`/api/recettes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(recette)
    });

    if (response.ok) {
        return convertToProduct(await response.json());
    } else {
        throw await createServiceError(response);
    }
}


export async function updateRecetteImage(recetteId, formData) {
    const response = await fetch(`/api/recettes/${recetteId}/image`, {
        method: "POST",
        headers: {
            ...session.getAuthHeaders()
        },
        body: formData
    });

    if (response.ok) {
        return;
    } else {
        throw await createServiceError(response);
    }
}

export async function fetchEtapesByRecetteId(recetteId) {
    const response = await fetch(`/api/etapes/${recetteId}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw await createServiceError(response);
    }
}

export async function fetchIngredientsByRecetteId(recetteId) {
    const response = await fetch(`/api/ingredients/${recetteId}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw await createServiceError(response);
    }
}

export async function fetchAppreciationByRecetteId(recetteId) {
    const response = await fetch(`/api/appreciation/${recetteId}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw await createServiceError(response);
    }
}




export async function fetchCommentairesByRecetteId(recetteId) {
    const response = await fetch(`/api/comments/${recetteId}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw await createServiceError(response);
    }
}
