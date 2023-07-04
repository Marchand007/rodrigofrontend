import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

import App from './App.vue';
//need more import

import FormulaireLogin from './pages/FormulaireLogin.vue';
import ListeRecettes from './pages/ListeRecettes/ListeRecettes.vue';
import NewRecette from './pages/NewRecette.vue';
import PageDetailRecette from './pages/DetailedRecipe/PageDetailRecette.vue';



const app = createApp(App);


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '', component:  ListeRecettes},
        { path: '/recipes/:id', component: PageDetailRecette, props: true },
        { path: '/admin/new-recipe', component: NewRecette },
        { path: '/login', component: FormulaireLogin }
    ]
});

app.use(router);

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi
        }
    }
});

app.use(vuetify);

app.mount("#app");