<template>
    <div>
        <v-sheet class="ma-2">
            <InfosRecette :id="id" :refreshCounter="refreshCounter"></InfosRecette>
            <v-container>
                <v-row no-gutters>
                    <ListeIngredientsRecette :id="id"></ListeIngredientsRecette>
                    <ListeEtapesRecette :id="id"></ListeEtapesRecette>
                </v-row>
            </v-container>
            <v-card class="ma-2" v-if="session.user">
                <v-card-actions>
                    <v-btn :icon="showAjout ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                        @click="this.showAjout = !this.showAjout"></v-btn>
                    <v-card-title>
                        Ajouter un commentaire / appréciation
                    </v-card-title>
                </v-card-actions>
                <v-expand-transition>
                    <div v-show="showAjout">
                        <v-row no-gutters>
                            <AjoutCommentaire class="mt-4" :id="id"></AjoutCommentaire>
                            <AjoutAppreciation class="mt-4" :id="id"></AjoutAppreciation>
                        </v-row>
                    </div>
                </v-expand-transition>
            </v-card>
            <v-card v-else align="center">
                <v-card-text>Vous devez avoir un compte utilisateur pour ajouter un commentaire et/ou une appréciation
                </v-card-text>
            </v-card>
            <v-card class="ma-2">
                <v-card-actions>
                    <v-btn :icon="showListeCommentaire ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                        @click="this.showListeCommentaire = !this.showListeCommentaire"></v-btn>
                    <v-card-title>
                        Liste des commentaires
                    </v-card-title>
                </v-card-actions>
                <v-expand-transition>
                    <div v-show="showListeCommentaire">
                        <ListeCommentaires :id="id" :refreshCounter="refreshCounter"></ListeCommentaires>
                    </div>
                </v-expand-transition>
            </v-card>
        </v-sheet>
    </div>
</template>
<script>


import session from '../../session';

import InfosRecette from './InfosRecette.vue';
import ListeIngredientsRecette from './ListeIngredients/ListeIngredientsRecette.vue';
import ListeEtapesRecette from './ListeEtapes/ListeEtapesRecette.vue';
import ListeCommentaires from './Commentaires/ListeCommentaires.vue';
import AjoutCommentaire from './AjoutCommentaire.vue';
import AjoutAppreciation from './AjoutAppreciation.vue';

export default {
    props: {
        id: String
    },
    components: {
        InfosRecette,
        ListeIngredientsRecette,
        ListeEtapesRecette,
        ListeCommentaires,
        AjoutCommentaire,
        AjoutAppreciation
    },
    data() {
        return {
            session: session,
            refreshCounter: 0,
            showAjout: false,
            showListeCommentaire: false,
        };
    },
    provide() {
        return {
            refresh: this.refreshPageDetaillee
        };
    },
    methods: {
        refreshPageDetaillee() {
            this.refreshCounter++;
        }
    }
}
</script>