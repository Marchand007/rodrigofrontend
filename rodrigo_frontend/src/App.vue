<template>
    <v-app>
        <EnteteNavigation />
        <v-main>
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>
import { computed } from 'vue';

import EnteteNavigation from './components/EnteteNaviguation.vue';


export default {
    components: {
        EnteteNavigation
    }
}
</script>
