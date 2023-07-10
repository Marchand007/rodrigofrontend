<template>
    <v-col cols="4">
        <div class="text-center">
            <v-rating :readonly="disabled" v-model="rating" hover></v-rating>
            <pre>{{ rating }}</pre>
            <v-btn :disabled="disabled" v-on:click="this.addAppreciation()">Envoyer Appréciation</v-btn>
        </div>
    </v-col>
</template>

<script>

import session from '../../session';
import { addAppreciationToRecipeId, fetchAppreciatioForUserByRecetteId } from '../../RecetteService';

export default {
    inject: ['refresh'],
    props: {
        id: String,
        refreshCounter: Number
    },
    data()
    {
        return {
            session: session,
            rating: 0,
            disabled : false
        }
    },
    methods: {
        addAppreciation()
        {
            if (!session.user)
            {
                alert("Impossible de soumettre le commentaire sans connexion");
            }

            const appreciation = {
                courrielUtilisateur: session.user.courrielUtilisateur,
                recetteId: this.id,
                note: this.rating
            };
            addAppreciationToRecipeId(appreciation).then(response =>
            {
                alert(response.message);
                this.refresh();
                this.loadAppreciation();
            });
        },
        loadAppreciation() {
            fetchAppreciatioForUserByRecetteId(this.id).then(reponse =>
        {
           
            if (reponse.note > 0)
            {
                this.rating = reponse.note;
                this.disabled = true;
            }
        });
        }
    },
    mounted()
    {
        this.loadAppreciation();
    }
}

</script>