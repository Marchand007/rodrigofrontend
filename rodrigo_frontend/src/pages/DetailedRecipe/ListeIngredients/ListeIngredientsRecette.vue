<template>
    <v-col cols="4">
        <v-list>
            <v-list-subheader>
                <h2><u>Ingredients</u></h2>
            </v-list-subheader>
            <IngredientRecette v-for="(ingredient, i) in this.ingredients" :key="i" :ingredient="ingredient">
            </IngredientRecette>

        </v-list>
    </v-col>
</template>


<script>
import { fetchIngredientsByRecetteId } from '../../../RecetteService';
import IngredientRecette from './IngredientRecette.vue';


export default {
    props: {
        id: String,
    },
    components: {
        IngredientRecette
    },
    data()
    {
        return {
            ingredients: [],
            loading: true,
            loadError: false
        };
    },
    mounted()
    {
        fetchIngredientsByRecetteId(this.id).then(ingredients =>
        {
            this.ingredients = ingredients;
            this.loading = false;
            this.loadError = false;
        }).catch(err =>
        {
            console.error(err);
            this.loading = false;
            this.loadError = true;
        })
    },
    computed: {
        recetteDetailUrl()
        {
            return "/recettes/" + this.id;
        },
    }
}
</script>