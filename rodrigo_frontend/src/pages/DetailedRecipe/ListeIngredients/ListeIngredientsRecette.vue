<template>
    <v-col cols="4">
        <v-list>
            <v-list-subheader>
                <h2><u>Ingrédients</u></h2>
            </v-list-subheader>
            <v-sheet class="ma-2">
                <IngredientRecette v-for="(ingredient, i) in this.ingredients" :key="i" :ingredient="ingredient"> </IngredientRecette>
            </v-sheet>
        </v-list>
    </v-col>
</template>

<script>
import { fetchIngredientsByRecetteId } from '../../../RecetteService';
import IngredientRecette from './IngredientRecette.vue';

export default {
    props: {
        id: String
    },
    components: {
        IngredientRecette
    },
    data() {
        return {
            ingredients: [],
            show: false
        };
    },
    mounted() {
        fetchIngredientsByRecetteId(this.id).then(ingredients => {
            this.ingredients = ingredients;
        }).catch(err => {
            console.error(err);
        });
    },
    computed: {
        recetteDetailUrl() {
            return "/recettes/" + this.id;
        },
    }
}
</script>