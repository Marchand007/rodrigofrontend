<template>
    <CommentaireRecette v-for="(commentaire, i) in this.commentaires" :key="i" :commentaire="commentaire"></CommentaireRecette>
</template>

<script>
import { fetchCommentairesByRecetteId } from '../../../RecetteService';
import CommentaireRecette from './CommentaireRecette.vue';

export default {
    props: {
        id: String,
        refreshCounter: Number
    },
    components: {
        CommentaireRecette
    },
    data() {
        return {
            commentaires: []
        };
    },
    methods: {
        chargerCommentaires() {
            fetchCommentairesByRecetteId(this.id).then(commentaires => {
                this.commentaires = commentaires;
            }).catch(err => {
                console.error(err);
            });
        }
    },
    mounted() {
        this.chargerCommentaires();
    },
    watch: {
        refreshCounter() {
            this.chargerCommentaires();
        }
    }
}
</script>