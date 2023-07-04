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
        nom: jsonRecette.name,
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
export async function fetchProducts() {
    const response = await fetch('/api/products');

    if (response.ok) {
        const respJson = await response.json();
        return respJson.map(p => convertToProduct(p));
    } else {
        throw await createServiceError(response);
    }
}

/**
 * Récupère depuis l'API back-end un produit individuel du catalogue
 * 
 * @param {String} productId L'identifiant du produit à récupérer
 * @returns Promesse permettant d'obtenir le produit demandé
 */
export async function fetchProduct(productId) {
    const response = await fetch(`/api/products/${productId}`);

    if (response.ok) {
        return convertToProduct(await response.json());
    } else {
        throw await createServiceError(response);
    }
};

export async function updateProduct(product) {
    const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(product)
    });

    if (response.ok) {
        return convertToProduct(await response.json());
    } else {
        throw await createServiceError(response);
    }
}

export async function createProduct(product) {
    const response = await fetch(`/api/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(product)
    });

    if (response.ok) {
        return convertToProduct(await response.json());
    } else {
        throw await createServiceError(response);
    }
}


export async function updateProductImage(productId, formData) {
    const response = await fetch(`/api/products/${productId}/image`, {
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
