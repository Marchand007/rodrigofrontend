<template>
    <v-card class="pa-2 ma-2">
        <span><strong>{{ commentaire.nomUtilisateur }} ({{ commentaire.commentDatePublication }})</strong></span>
        <div>{{ commentaire.commentUtilisateur }} </div>
    </v-card>
</template>

<script>
export default {
    props: {
        commentaire: Object,
    }
}
</script>