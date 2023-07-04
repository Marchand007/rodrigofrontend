import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
//need more import
import FormulaireLogin from './pages/FormulaireLogin.vue';

const app = createApp(App);


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '', component:  PageRecipes},
        { path: '/recipes/:id', component: RecipeDetail, props: true },
        { path: '/admin/new-recipe', component: NewRecipe },
        { path: '/login', component: FormulaireLogin }
    ]
});

app.use(router);

app.mount("#app");