<template>
    <v-col cols="8">
        <v-textarea class="ml-2" v-model="texteCommentaire" label="Text"></v-textarea>
        <v-btn class="ma-2" @click="this.addCommentaire()">Envoyer votre commentaire</v-btn>
    </v-col>
</template>

<script>

import session from '../../session';
import { addCommentaireToRecipeId } from '../.././RecetteService';


export default {
    props: {
        id: String,
    },
    data()
    {
        return {
            session: session,
            texteCommentaire: ""
        }
    },

    methods: {
        addCommentaire()
        {
            if (!session.user)
            {
                alert("Impossible de soumettre le commentaire sans connexion");
            }

            const commentaire = {
                courrielUtilisateur: session.user.courrielUtilisateur,
                recetteId: this.id,
                texte: this.texteCommentaire
            };

            addCommentaireToRecipeId(commentaire).then((response) =>
            {
                alert(response.message);
                this.texteCommentaire = "";
            });
            //this.$router.push('/recettes/' + this.id); DEMANDER AU PROF DEMAIN !!!
        }
    }
}



</script>