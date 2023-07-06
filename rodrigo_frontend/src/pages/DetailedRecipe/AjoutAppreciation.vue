<template>
    <v-col cols="4">
        <div class="text-center">
            <v-rating v-model="rating" hover></v-rating>
            <pre>{{ rating }}</pre>
        </div>
        <v-card-action>
            <v-btn v-on:click="this.addAppreciation()">Envoyer Appréciation</v-btn>
        </v-card-action>
    </v-col>
</template>

<script>

import session from '../../session';
import { addAppreciationToRecipeId } from '../../RecetteService';

export default {
    props: {
        id: String
    },
    data() {
        return {
            session: session,
            rating: 0
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
                console.log("RESULT", response.message); //INSERE DANS LA BD ET AU FRONT-END, MAIS ERREUR AVEC LA REPONSE (pas de "Alert")
                alert(response.message);
            });

            this.reinitialiserSectionAppreciation();
        },
        reinitialiserSectionAppreciation() {
            this.rating = 0;
        }
    }
}

</script>