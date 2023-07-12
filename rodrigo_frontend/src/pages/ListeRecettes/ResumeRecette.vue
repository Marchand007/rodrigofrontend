<template>
    <!-- <v-card class="mx-2 pa-2" elevation="5" border>
        <v-img class="ma-4" :src="imageSrc" height="5rem" />
        <router-link :to="recetteDetailUrl">{{ nom }}</router-link>
        <v-card-text class="pa-0 pb-2 px-2">{{ descCourt }}</v-card-text>
    </v-card> -->

    <v-card class="ma-4" width="340">

        <v-img class="ma-4" :src="imageSrc" height="200px" />

        <v-card-title>
            <router-link :to="recetteDetailUrl">{{ nom }}</router-link>
        </v-card-title>

        <!-- 
        <v-card-subtitle>
           
        </v-card-subtitle>
    -->

        <v-card-actions>
            <v-btn color="blue-lighten-2" variant="text">
                Voir Plus
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="this.show = !this.show"></v-btn>
        </v-card-actions>

        <v-expand-transition>
            <div v-show="show">
                <v-divider></v-divider>

                <v-card-text>
                    {{ descCourt }}
                </v-card-text>
                <v-sheet align="center">
                    <v-rating v-model="moyenneAppreciation" density="compact" hover half-increments readonly>
                    </v-rating> ({{ nombreAppreciation }})
                </v-sheet>
                <v-sheet align="center">
                    <v-btn v-if="session.user && session.user.isAdmin" @click="goToUpdatePage" class="ma-2"
                        size="x-small">Modifier la recette</v-btn>
                    <v-dialog v-model="dialog" persistent width="auto">
                        <template v-slot:activator="{ props }">
                            <v-btn v-if="session.user && session.user.isAdmin" class="ma-2" v-bind="props"
                                size="x-small">Supprimer la recette</v-btn>
                        </template>
                        <v-card>
                            <v-card-title class="text-h5">
                                Supprimer {{ nom }}
                            </v-card-title>
                            <v-card-text>Voulez-vous vraiment supprimer la recette {{ nom }}</v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green-darken-1" variant="text" @click="dialog = false">
                                    Annuler
                                </v-btn>
                                <v-btn color="green-darken-1" variant="text" @click="deleteRecette">
                                    Confirmer
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-sheet>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script>
import { addApiPrefixToPath } from '../../../src/api_utils.js';
import session from '../../../src/session';

import { deleteRecetteById, fetchAppreciationByRecetteId } from '../../RecetteService';


export default {
    inject: ['loadRecettes'],
    props: {
        id: String,
        nom: String,
        descCourt: String,
        image: String,
    },
    data: function ()
    {
        return {
            session: session,
            dialog: false,
            show: false,
            nombreAppreciation: 0,
            moyenneAppreciation: 0
        };
    },
    methods: {
        goToUpdatePage()
        {
            this.$router.push("/admin/update-recipe/" + this.id);
        },
        deleteRecette()
        {
            this.dialog = false
            deleteRecetteById(this.id).then(result =>
            {
                this.loadRecettes();
            })
        },
        chargerAppreciations()
        {
            fetchAppreciationByRecetteId(this.id).then(appreciation =>
            {
                this.nombreAppreciation = appreciation.nombreAppreciation;
                this.moyenneAppreciation = appreciation.moyenneAppreciation;
            }).catch(err =>
            {
                console.error(err);
            });
        }
    },
    computed: {
        recetteDetailUrl()
        {
            return "/recettes/" + this.id;
        },
        imageSrc()
        {
            return addApiPrefixToPath(this.image);
        }
    },
    mounted() {
        this.chargerAppreciations();
    }
}
</script>
