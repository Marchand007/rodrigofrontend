<template>
    <v-col cols="4">
        <div class="text-center">
            <v-rating @click="enableBtn" :readonly="disabledAppr" v-model="rating" hover></v-rating>
            <pre>{{ rating }}</pre>
            <v-btn :disabled="disabledBtn" v-on:click="this.addAppreciation()">Envoyer Appréciation</v-btn>
        </div>
    </v-col>
</template>

<script>

import session from '../../session';
import { addAppreciationToRecipeId, fetchAppreciationForUserByRecetteId } from '../../RecetteService';

export default {
    inject: ['refresh'],
    props: {
        id: String,
        refreshCounter: Number
    },
    data() {
        return {
            session: session,
            rating: 0,
            disabledBtn: true,
            disabledAppr: false
        }
    },
    methods: {
        addAppreciation() {
            if (!session.user) {
                alert("Impossible de soumettre le commentaire sans connexion");
            }

            const appreciation = {
                courrielUtilisateur: session.user.courrielUtilisateur,
                recetteId: this.id,
                note: this.rating
            };
            addAppreciationToRecipeId(appreciation).then(response => {
                alert(response.message);
                this.rating = response.note;
                this.disabledAppr = true;
                this.disabledBtn = true;
                this.refresh();
            });
        },
        loadAppreciation() {
            fetchAppreciationForUserByRecetteId(this.id).then(response => {

                if (response.note > 0) {
                    this.rating = response.note;
                    this.disabledAppr = true;
                }
            });
        },
        enableBtn() {
            this.disabledBtn = false;
        }
    },
    mounted() {
        this.loadAppreciation();

    }
}

</script>