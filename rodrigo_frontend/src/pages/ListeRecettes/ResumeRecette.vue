<template>
    <v-card class="ma-2">
        <v-sheet class="d-flex flex-no-wrap">
            <v-sheet class="w-25">
                    <v-img :src="imageSrc" max-height="5rem" />
            </v-sheet>
            <v-sheet>
                <v-card-title><router-link :to="recetteDetailUrl">{{ nom }}</router-link></v-card-title>
                <v-card-text>
                    <div class="text-body-1">{{ descCourt }}</div>
                </v-card-text>
            </v-sheet>
            <v-sheet v-if="session.user && session.user.isAdmin">
                <v-card-actions>
                    <v-btn @click="goToUpdatePage">Editer</v-btn>
                </v-card-actions>
            </v-sheet>
        </v-sheet>
    </v-card>
</template>

<script>
import { addApiPrefixToPath } from '../../../src/api_utils.js';
import session from '../../../src/session';

export default {
    props: {
        id: String,
        nom: String,
        descCourt: String,
        image: String
    },
    data: function ()
    {
        return {
            session: session
        };
    },
    methods : {
        goToUpdatePage() {
        this.$router.push("/admin/update-recipe/" + this.id);
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
