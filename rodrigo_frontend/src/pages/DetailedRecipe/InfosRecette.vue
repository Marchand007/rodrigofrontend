<template>
    <v-btn @click="goToUpdatePage()" size="x-small" v-if="session.user && session.user.isAdmin">Modifier la recette</v-btn>
    <h2 class="text-h4">{{ recette.nom }}</h2>
    <v-rating v-model="moyenneAppreciation" density="compact" hover half-increments readonly>
    </v-rating>
    <span>({{ nombreAppreciation }})</span>
    <v-card class="ma-2">
        <v-sheet class="d-flex flex-no-wrap">
            <v-sheet class="w-75 ma-4">
                <v-img :src="imageSrc" max-height="60rem" max-width="60rem" />
            </v-sheet>
            <v-sheet>
                <v-card-title>Mais c'est quoi du {{ recette.nom }} ??</v-card-title>
                <v-card-text>
                    <div class="text-body-1 pre-wrap">{{ recette.descLong }}</div>
                </v-card-text>
            </v-sheet>
        </v-sheet>


        <v-container>
            <v-card class="ma-2">
                <v-row no-gutters>
                    <v-col>
                        <v-sheet class="pa-2 ma-2">
                            <span>Temps de préparation : </span>
                            <span v-if="recette.tempsPrepMin != null && recette.tempsPrepMin > 0">
                                {{ recette.tempsPrepMin }} minutes</span>
                            <span v-else>N/A </span>
                        </v-sheet>
                    </v-col>

                    <v-col>
                        <v-sheet class="pa-2 ma-2">
                            <span>Temps de cuisson : </span>
                            <span v-if="recette.tempsCuissonMin != null && recette.tempsCuissonMin > 0">
                                {{ recette.tempsCuissonMin }} minutes</span>
                            <span v-else> N/A </span>
                        </v-sheet>
                    </v-col>

                    <v-col>
                        <v-sheet class="pa-2 ma-2">
                            <span>Nombre de portions : </span>
                            <span v-if="recette.nbPortions != null && recette.nbPortions > 0">
                                {{ recette.nbPortions }} portions</span>
                            <span v-else> N/A </span>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-card>
        </v-container>
    </v-card>
</template>


<script>
import { addApiPrefixToPath } from '../../../src/api_utils.js';
import { fetchRecette, fetchAppreciationByRecetteId } from '../../RecetteService';
import session from '../../session';

export default {
    props: {
        id: String,
        refreshCounter: Number
    },
    data() {
        return {
            session: session,
            recette: {},
            moyenneAppreciation: 0,
            nombreAppreciation: 0,
            loading: true,
            loadError: false
        };
    },
    methods: {
        goToUpdatePage() {
            this.$router.push("/admin/update-recipe/" + this.id);
        },
        chargerAppreciations() {
            fetchAppreciationByRecetteId(this.id).then(appreciation => {
                this.nombreAppreciation = appreciation.nombreAppreciation;
                this.moyenneAppreciation = appreciation.moyenneAppreciation;
            }).catch(err => {
                console.error(err);
            });
        }
    },
    computed: {
        imageSrc() {
            return this.recette.image ? addApiPrefixToPath(this.recette.image) : null;
        }
    },
    mounted() {
        fetchRecette(this.id).then(recette => {
            this.recette = recette;
            this.loading = false;
            this.loadError = false;
        }).catch(err => {
            console.error(err);
            this.loading = false;
            this.loadError = true;
        }),
        this.chargerAppreciations();
    },
    watch: {
        refreshCounter() {
            console.log("VALUE :", this.refreshCounter);
            this.chargerAppreciations();
        }
    }
}
</script>

<style scoped>
.pre-wrap {
    white-space: pre-wrap;
}
</style>
