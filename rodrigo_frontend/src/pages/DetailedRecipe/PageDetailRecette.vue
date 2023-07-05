<template>
    <v-sheet class="ma-2">
        <InfosRecette :id="id"></InfosRecette>
        <v-container>
            <v-row no-gutters>
                <ListeIngredientsRecette :id="id"></ListeIngredientsRecette>
                <ListeEtapesRecette :id="id"></ListeEtapesRecette>
            </v-row>
        </v-container>
        
        <v-card class="ma-2">
                <v-card-title>Ajouter un commentaire</v-card-title>
                <div v-if="session.user">
                    <v-row no-gutters>
                        <v-col cols="8">
                            <v-sheet class="ma-2">
                                <textarea v-model="textCommentaire" name="commentText" id="commentText" cols="80" rows="10"></textarea>
                            </v-sheet>
                        </v-col>
                        <v-col cols="4">
                            <div class="text-center">
                                <v-rating v-model="rating" hover half-increments></v-rating>
                                <pre>{{ rating }}</pre>
                            </div>

                            <v-card-action>
                                <v-btn v-on:click="">Envoyer Appréciation</v-btn>
                            </v-card-action>
                        </v-col>
                        <v-card-actions>
                            <v-btn class="ma-2" v-on:click="">Envoyer votre commentaire</v-btn>
                        </v-card-actions>
                    </v-row>
                </div>
                <h5 class="ma-2" v-else>Vous devez avoir un compte utilisateur pour ajouter un commentaire et/ou une appréciation</h5>
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
            const tempDate = new Date();
            let month = tempDate.getUTCMonth() +1;
            let day = tempDate.getUTCDate();
            let year = tempDate.getUTCFullYear();
            let hours = tempDate.getUTCHours();
            let minutes = tempDate.getUTCMinutes();
            let seconds = tempDate.getUTCSeconds();

            const newDate = year + " " + month + " " + day + " " + hours + "-" + minutes + "-";

            const commentaire = {
                courrielUtilisateur: session.user.courrielUtilisateur,
                recetteId: this.id,
                texte: this.textCommentaire,
                datePublication: newDate
            };

            fetch("/api/comments", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    ...session.getAuthHeaders()
                },
                body:JSON.stringify(commmentaire)
            }).then((response) => {
                if(response.ok){
                    alert("Merci de votre commentaire !");
                    this.reinitialiserSectionCommentaire();
                }
            })
        },
        addAppreciation(){
            
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