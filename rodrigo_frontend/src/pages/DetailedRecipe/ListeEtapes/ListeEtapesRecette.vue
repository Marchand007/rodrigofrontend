<template>
    <v-col cols="8">
        <v-list>
            <v-list-subheader>
                <h2><u>Étapes</u></h2>
            </v-list-subheader>
            <EtapeRecette v-for="(etape, i) in this.etapes" :key="i" :etape="etape">
            </EtapeRecette>

        </v-list>

    </v-col>
</template>


<script>
import { fetchEtapesByRecetteId } from '../../../RecetteService';
import EtapeRecette from './EtapeRecette.vue';


export default {
    props: {
        id: String,
    },
    components: {
        EtapeRecette
    },
    data()
    {
        return {
            etapes: [],
            loading: true,
            loadError: false
        };
    },
    mounted()
    {
        fetchEtapesByRecetteId(this.id).then(etapes =>
        {
            this.etapes = etapes;
            this.loading = false;
            this.loadError = false;
        }).catch(err =>
        {
            console.error(err);
            this.loading = false;
            this.loadError = true;
        });
    }
}
</script>