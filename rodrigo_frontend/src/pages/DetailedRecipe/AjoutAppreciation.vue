<template>
    <v-col cols="4">
        <div class="text-center">
            <v-rating v-model="rating" hover></v-rating>
            <pre>{{ rating }}</pre>
            <v-btn v-on:click="this.addAppreciation()">Envoyer Appréciation</v-btn>
        </div>
    </v-col>
</template>

<script>

import session from '../../session';
import { addAppreciationToRecipeId } from '../../RecetteService';

export default {
    inject:['refresh'],
    props: {
        id: String,
        refreshCounter: Number
    },
    data()
    {
        return {
            session: session,
            rating: 0
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
                this.rating = 0;
                this.refresh();
            });
            //this.$router.push('/recettes/' + this.id); DEMANDER AU PROF DEMAIN !!!
        }
    }
}

</script>