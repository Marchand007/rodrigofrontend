<template>
    <v-list-item>
        <span>{{ etape.ordre }}</span>.
        <span>{{ etape.description }}</span>
    </v-list-item>
</template>

<script>

export default {
    props: {
        etape: Object,
    }
}
</script>