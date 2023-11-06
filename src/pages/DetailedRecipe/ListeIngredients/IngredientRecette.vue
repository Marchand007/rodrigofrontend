<template>
    <v-list-item>
        <span><strong>{{ ingredient.nom }}</strong></span>
        <span v-if="ingredient.quantite || ingredient.uniteMesure"> (</span>
        <span v-if="ingredient.quantite">{{ ingredient.quantite }}</span>
        <span v-if="ingredient.uniteMesure">{{ ingredient.uniteMesure }}</span>
        <span v-if="ingredient.quantite || ingredient.uniteMesure">)</span>
    </v-list-item>
</template>

<script>
export default {
    props: {
        ingredient: Object,
    }
}
</script>