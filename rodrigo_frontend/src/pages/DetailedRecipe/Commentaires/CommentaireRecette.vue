<template>
    <v-card class="pa-2 ma-2">
        <span><strong>{{ commentaire.nomUtilisateur }} ({{ formattedDateTime }})</strong></span>
        <div>{{ commentaire.commentUtilisateur }} </div>
    </v-card>
</template>

<script>
import { DateTime } from 'luxon';
export default {
    props: {
        commentaire: Object,
    },
    computed: {
        formattedDateTime() {
            const commentaireDateTime = DateTime.fromISO(this.commentaire.commentDatePublication);

            const commentaireDateTimeFR = commentaireDateTime.setLocale('fr').toLocaleString(DateTime.DATETIME_MED);

            return commentaireDateTimeFR;
        }
    }
}
</script>