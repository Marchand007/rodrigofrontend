<template>
    <v-sheet class="ma-2">
        <h2 class="text-h4">Liste des recettes</h2>
        <ResumeRecette v-if="!loading" v-for="recette in recettes" :key="recette.id" :id="recette.id"
            :nom="recette.nom" :descCourt="recette.descCourt" :image="recette.image" />
    </v-sheet>
</template>

<script>
import ResumeRecette from './ResumeRecette.vue';
import { fetchRecettes } from '../../RecetteService';

export default {
    components: {
        ResumeRecette: ResumeRecette
    },
    data() {
        return {
            recettes: [],
            loading: true,
            loadError: false
        };
    },
    mounted() {
        fetchRecettes().then(recettes => {
            this.recettes = recettes;
            this.loading = true;
            this.loadError = false;
        }).catch(err => {
            console.error(err);
            this.loading = false;
            this.loadError = true;
        });
    }
}
</script>