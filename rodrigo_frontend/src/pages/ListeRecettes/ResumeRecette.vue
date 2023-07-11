<template>
    <v-card v-if="(session.user && session.user.isAdmin == true) || isActive == true" class="ma-2" :color="bgcolor">
            <v-sheet class="w-100" color="transparent">
                <v-img class="ma-4" :src="imageSrc" max-height="5rem" />
            </v-sheet>
            <v-sheet align="center" color="transparent">
                <v-card-title>
                    <router-link :to="recetteDetailUrl">{{ nom }}</router-link>
                    <div v-if="isActive == false" class="text-body-1">(recette desactive)</div>
                </v-card-title>
                <v-card-text>

                    <div class="text-body-1">{{ descCourt }}</div>
                </v-card-text>
            </v-sheet>
            <v-sheet align="center" v-if="session.user && session.user.isAdmin" color="transparent">
                    <v-btn @click="goToUpdatePage" class="ma-4">Editer</v-btn>
                    <v-btn v-if="isActive == true" class="ma-4" @click="deleteRecette()">Supprimer la recette</v-btn>
                    <v-btn v-if="false" class="ma-4" @click="goToUpdatePage">Réactiver la recette</v-btn>
            </v-sheet>
    </v-card>
</template>

<script>
import { addApiPrefixToPath } from '../../../src/api_utils.js';
import session from '../../../src/session';

import { deleteRecetteById } from '../../RecetteService';


export default {
    props: {
        id: String,
        nom: String,
        descCourt: String,
        image: String,
        isActive: Boolean
    },
    data: function ()
    {
        return {
            session: session,
            bgcolor: this.isActive ? "transparent" : "#ffc0a4"
        };
    },
    methods: {
        goToUpdatePage()
        {
            this.$router.push("/admin/update-recipe/" + this.id);
        },
        deleteRecette() {
            deleteRecetteById(this.id).then(result => {
                this.$router.push('/');
            })
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
    }
}
</script>
