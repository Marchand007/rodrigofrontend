<template>
    <v-btn @click="goToUpdatePage()" size="x-small" v-if="session.user && session.user.isAdmin">Modifier la recette</v-btn>

    <v-dialog v-model="dialog" persistent width="auto">
                <template v-slot:activator="{ props }">
                    <v-btn v-if="session.user && session.user.isAdmin" class="ma-4" v-bind="props" size="x-small">Supprimer la recette</v-btn>
                </template>
                <v-card>
                    <v-card-title class="text-h5">
                        Supprimer {{ nom }}
                    </v-card-title>
                    <v-card-text>Voulez-vous vraiment supprimer la recette {{ nom }}</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                            Annuler
                        </v-btn>
                        <v-btn color="blue-darken-1" variant="text" @click="deleteRecette()">
                            Confirmer
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

    <h2 class="text-h4">{{ recette.nom }}</h2>
    <v-rating v-model="moyenneAppreciation" density="compact" hover half-increments readonly>
    </v-rating>
    <span>({{ nombreAppreciation }})</span>
    <v-card class="ma-2">
        <v-sheet class="d-flex">
            <v-sheet class="ma-4">
                <v-img :src="imageSrc" width="600px" /> 
            </v-sheet>
            <v-sheet>
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
import { fetchRecette, fetchAppreciationByRecetteId, deleteRecetteById } from '../../RecetteService';
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
            loadError: false,
            dialog : false
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
        },
        deleteRecette() {
            this.dialog = true;
            deleteRecetteById(this.id).then(result => {
                this.$router.push('/');
            })
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
            this.chargerAppreciations();
        }).catch(err => {
            console.error(err);
            this.loading = false;
            this.loadError = true;
        })
        
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
