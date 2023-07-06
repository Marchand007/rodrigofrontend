<template>
    <v-col cols="8">
        <v-sheet class="ma-2">
            <textarea v-model="texteCommentaire" name="commentText" id="commentText" cols="80" rows="10"></textarea>
        </v-sheet>
    </v-col>
    <v-card-actions>
        <v-btn class="ma-2" v-on:click="this.addCommentaire()">Envoyer votre commentaire</v-btn>
    </v-card-actions>
</template>

<script>

import session from '../../session';
import { addCommentaireToRecipeId } from '../.././RecetteService';


export default {
    props: {
        id: String,
    },
    data() {
        return {
            session: session,
            texteCommentaire: ""
        }
    },

    methods: {
        addCommentaire() {
            if (!session.user) {
                alert("Impossible de soumettre le commentaire sans connexion");
            }

            const commentaire = {
                courrielUtilisateur: session.user.courrielUtilisateur,
                recetteId: this.id,
                texte: this.texteCommentaire
            };

            addCommentaireToRecipeId(commentaire).then((response) => {
                console.log("RESULT", response.message);
                alert(response.message);
                
            });
            this.reinitialiserSectionCommentaire();  
        },
        reinitialiserSectionCommentaire() {
              this.textCommentaire = "";
        } 
    }
}



</script>