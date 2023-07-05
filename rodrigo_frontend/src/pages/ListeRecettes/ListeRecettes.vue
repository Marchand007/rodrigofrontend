<template>
 <h2 class="d-flex justify-center">Les recettes de</h2>
    <v-flex class="d-flex justify-center">
       
  <v-img
max-width="75%"
    src="http://logos.textgiraffe.com/logos/logo-name/Rodrigo-designstyle-friday-m.png"
  />
    </v-flex>
    <v-sheet class="ma-2">
        <ResumeRecette v-for="recette in recettes" :key="recette.id" :id="recette.id"
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