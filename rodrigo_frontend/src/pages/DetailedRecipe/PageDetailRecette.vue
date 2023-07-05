<template>
    <v-sheet class="ma-2">
        <InfosRecette :id="id"></InfosRecette>
        <v-container>
            <v-row no-gutters>
                <ListeIngredientsRecette :id="id"></ListeIngredientsRecette>
                <ListeEtapesRecette :id="id"></ListeEtapesRecette>
            </v-row>
        </v-container>
        <ListeCommentaires :id="id"></ListeCommentaires>
    </v-sheet>
</template>

<script>
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
            loadError: false
        };
    }
}
</script>