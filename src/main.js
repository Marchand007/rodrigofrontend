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

import FormulaireLogin from './pages/FormulaireLogin.vue';
import FormulaireNouvUser from './pages/FormulaireNouvUser.vue';
import ListeRecettes from './pages/ListeRecettes/ListeRecettes.vue';
import NewRecette from './pages/NewRecette.vue';
import UpdateRecette from './pages/UpdateRecette.vue';
import PageDetailRecette from './pages/DetailedRecipe/PageDetailRecette.vue';


const app = createApp(App);

const router = createRouter({
    scrollBehavior(to, from, savedPosition) {
        // always scroll to top
        return { top: 0 }
    },
    history: createWebHistory(),
    routes: [
        { path: '/', component: ListeRecettes },
        { path: '/recettes/:id', component: PageDetailRecette, props: true },
        { path: '/admin/new-recipe', component: NewRecette },
        { path: '/admin/update-recipe/:id', component: UpdateRecette, props: true },
        { path: '/login', component: FormulaireLogin },
        { path: '/login/new', component: FormulaireNouvUser }
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