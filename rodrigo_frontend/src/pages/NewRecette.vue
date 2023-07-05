<template>
    <div class="boxed-center">
        <h2>Creation d'une nouvelle recette</h2>
        <v-sheet v-if="session.user && session.user.isAdmin" class="d-flex flex-4-1">
            <v-sheet class="w-50 ma-4">
                <v-form @submit.prevent="submitNewProduct" validate-on="submit lazy" ref="productform">
                    <v-text-field v-model="recettetId" label="Identifiant unique de la recette (exemple : poulet_curry)"
                        density="compact" :rules="[rules.required, rules.recetteIdUnique]"></v-text-field>
                    <v-text-field v-model="recetteName" label="Nom du produit" density="compact"
                        :rules="[rules.required]"></v-text-field>
                    <v-container>
                        <v-row>
                            <v-col cols="3" sm="4">
                                <v-text-field class="mr-2" v-model="tempsPrepMin" label="Temps de preparation"
                                    density="compact" type="number" step="1" :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="3" sm="4">
                                <v-text-field v-model="tempsCuissMin" label="Temps de cuisson" density="compact"
                                    type="number" step="1" :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="3" sm="4">
                                <v-text-field v-model="nbPortions" label="Nombre de portions" density="compact"
                                    type="number" step="1" :rules="[rules.required]"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-text-field v-model="DescCourt" label="Description Courte" density="compact"
                        :rules="[rules.required]"></v-text-field>
                    <v-textarea id="description" v-model="DescLong" label="Description longue" :rules="[]"
                        auto-grow></v-textarea>

                    <v-btn type="submit">Ajouter</v-btn>
                </v-form>
            </v-sheet>
        </v-sheet>
        <v-sheet v-else class="ma-2">Vous n'avez pas les permissions pour voir cette page</v-sheet>
    </div>
</template>


<script>

import session from '../session';

export default {
    props: {
        id: String,
    },
    data()
    {
        return {
            session: session,
            recette: {},
            ingredients: [],
            etapes: [],
            recettetId: "",
            recetteName: "",
            tempsPrepMin: 0,
            tempsCuissMin: 0,
            nbPortions: 0,
            DescCourt: "",
            DescLong: "",
            rules: {
                required: value => !!value || "Le champ est requis",
                productIdUnique: () => this.productIdUnique || "Cet identifiant est déjà utilisé, veuillez en enter un autre"
            },
        };
    },


}
</script>

<style scoped>
.boxed-center {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    margin: 1rem auto;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
    width: 100%;
    max-width: 80rem;
}
</style>
