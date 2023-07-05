<template>
    <v-sheet class="ma-2">
        <InfosRecette :id="id"></InfosRecette>
        <v-container>
            <v-row no-gutters>
                <ListeIngredientsRecette :id="id"></ListeIngredientsRecette>
                <ListeEtapesRecette :id="id"></ListeEtapesRecette>
            </v-row>
        </v-container>
        
        <v-card class="ma-2" v-if="session.user"> //VA FALLOIR GOSSER AVEC CA POUR AFFICHAGE
                <v-card-title>Ajouter un commentaire</v-card-title>
                <div>
                    <v-row no-gutters>
                        <v-col cols="8">
                            <v-sheet class="ma-2">
                                <textarea v-model="textCommentaire" name="commentText" id="commentText" cols="80" rows="10"></textarea>
                            </v-sheet>
                        </v-col>
                        <v-card-actions>
                            <v-btn class="ma-2" v-on:click="this.addCommentaire()">Envoyer votre commentaire</v-btn>
                        </v-card-actions>

                        <v-col cols="4">
                            <div class="text-center">
                                <v-rating v-model="rating" hover></v-rating>
                                <pre>{{ rating }}</pre>
                            </div>
                            <v-card-action>
                                <v-btn v-on:click="this.addAppreciation()">Envoyer Appréciation</v-btn>
                            </v-card-action>
                        </v-col>
                        
                    </v-row>
                </div>
            </v-card>
            <v-card v-else>
                <v-card-title>Ajouter un commentaire</v-card-title>
                <h5 class="ma-2">Vous devez avoir un compte utilisateur pour ajouter un commentaire et/ou une appréciation</h5>
            </v-card>
        
        <ListeCommentaires :id="id"></ListeCommentaires>
    </v-sheet>
</template>

<script>


import session from '../../session';

import InfosRecette from './InfosRecette.vue';
import ListeIngredientsRecette from './ListeIngredients/ListeIngredientsRecette.vue';
import ListeEtapesRecette from './ListeEtapes/ListeEtapesRecette.vue';
import ListeCommentaires from './Commentaires/ListeCommentaires.vue';

import { addCommentaireToRecipeId, addAppreciationToRecipeId } from '../.././RecetteService';

export default {
    props: {
        id: String,
    },
    components: {
    InfosRecette,
    ListeIngredientsRecette,
    ListeEtapesRecette,
    ListeCommentaires
},
    data()
    {
        return {
            loading: true,
            loadError: false,
            session: session,
            rating: 0,
            textCommentaire: ""
        };

    },
    
    methods: {
        addCommentaire(){
            if(!session.user){
                alert("Impossible de soumettre le commentaire sans connexion");
            }

            const commentaire = {
                courrielUtilisateur: session.user.courrielUtilisateur,
                recetteId: this.id,
                texte: this.textCommentaire
            };

            addCommentaireToRecipeId(commentaire).then((response) => {
                if(response.ok){
                    alert("Merci de votre commentaire !");
                    this.reinitialiserSectionCommentaire();
                } else{
                    throw new Error(`Erreur : ${response.status}`)
                }
            }).catch((error) => {
                console.error("Erreur", error);
            })
        },
        addAppreciation(){
            if(!session.user){
                alert("Impossible de soumettre le commentaire sans connexion");
            }

            const appreciation = {
                courrielUtilisateur: session.user.courrielUtilisateur,
                recetteId: this.id,
                note: this.rating
            };
            addAppreciationToRecipeId(appreciation).then(response => {
                console.log("RESULT", response); //INSERE DANS LA BD ET AU FRONT-END, MAIS ERREUR AVEC LA REPONSE (pas de "Alert")
                if(response.ok){
                    alert("Merci de pour votre note!");
                }
            }).catch((error) => {
                console.error("Erreur", error);
            });

            this.reinitialiserSectionAppreciation();
        },
        reinitialiserSectionCommentaire() {
            this.textCommentaire = "";
        },
        reinitialiserSectionAppreciation() {
            this.rating = 0;
        }
    }
}
</script>