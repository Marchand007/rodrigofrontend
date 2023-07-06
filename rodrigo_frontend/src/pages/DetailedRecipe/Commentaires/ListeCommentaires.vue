<template>
    <v-card class="ma-4">
        <v-card-title>Commentaires utilisateurs</v-card-title>
        <CommentaireRecette v-for="(commentaire, i) in this.commentaires" :key="i" :commentaire="commentaire">
        </CommentaireRecette>

    </v-card>
</template>



<script>
import { fetchCommentairesByRecetteId } from '../../../RecetteService';
import CommentaireRecette from './CommentaireRecette.vue';

export default {
    props: {
        id: String,
    },
    components: {
        CommentaireRecette
    },
    data()
    {
        return {
            commentaires: [],
            loading: true,
            loadError: false
        };
    },
    mounted()
    {
        fetchCommentairesByRecetteId(this.id).then(commentaires =>
        {
            this.commentaires = commentaires;
        }).catch(err =>
        {
            console.error(err);
        })
    }
}
</script>