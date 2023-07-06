<template>
    <v-sheet class="ma-2">
        <InfosRecette :id="id"></InfosRecette>
        <v-container>
            <v-row no-gutters>
                <ListeIngredientsRecette :id="id"></ListeIngredientsRecette>
                <ListeEtapesRecette :id="id"></ListeEtapesRecette>
            </v-row>
        </v-container>
        
        <v-card class="ma-2" v-if="session.user">
                <v-card-title>Ajouter un commentaire</v-card-title>
                <div>
                    <v-row no-gutters>
                        <AjoutCommentaire :id="id"></AjoutCommentaire>
                        <AjoutAppreciation :id="id"></AjoutAppreciation>
                        
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
import AjoutCommentaire from './AjoutCommentaire.vue';
import AjoutAppreciation from './AjoutAppreciation.vue';

export default {
    props: {
        id: String,
    },
    components: {
    InfosRecette,
    ListeIngredientsRecette,
    ListeEtapesRecette,
    ListeCommentaires,
    AjoutCommentaire,
    AjoutAppreciation
},
    data()
    {
        return {
            loading: true,
            loadError: false,
            session: session
        };

    }
}
</script>