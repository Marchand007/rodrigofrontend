<template>
    <h2 class="d-flex justify-center">Les recettes de</h2>
    <div class="d-flex justify-center">
        <v-img max-width="75%" src="http://logos.textgiraffe.com/logos/logo-name/Rodrigo-designstyle-friday-m.png" />
    </div>

    <v-container>
        <v-row class="justify-space-evenly">
            <v-sheet class="d-flex" v-for="recette in recettes" xs2>
                <ResumeRecette :key="recette.id" :id="recette.id" :nom="recette.nom" :descCourt="recette.descCourt"
                    :image="recette.image" />
            </v-sheet>
        </v-row>
    </v-container>
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
        };
    },
    provide() {
        return {
            loadRecettes: this.loadRecettes
        };
    },
    methods: {
        loadRecettes() {
            fetchRecettes().then(recettes => {
                this.recettes = recettes;
            }).catch(err => {
                console.error(err);
            });
        }
    },
    mounted() {
        this.loadRecettes();
    }
}
</script>