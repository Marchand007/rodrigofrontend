<template>
    <v-app-bar app prominent dense dark :elevation="4">
        <v-app-bar-nav-icon @click="this.$router.push('/')">
            <v-img width="60" aspect-ratio="0"
                src="http://logos.textgiraffe.com/logos/logo-name/Rodrigo-designstyle-friday-m.png" />
        </v-app-bar-nav-icon>
        <v-toolbar-title align-content="right">
            <p class="font-weight-light text-disabled">
                Les meilleures recettes du web sont celles de Rodrigo
            </p>
        </v-toolbar-title>
        <router-link class="routerlink" to="/"><v-tab>Les recettes</v-tab></router-link>
        <router-link class="routerlink" to="/admin/new-recipe"><v-tab v-if="session.user && session.user.isAdmin">Ajouter
                une
                recette</v-tab></router-link>

        <div v-if="session.user">
            <v-tab>
                Bienvenue, {{ session.user.nomComplet }}
            </v-tab>
            <v-tab @click="disconnect()">
                DÉCONNEXION
            </v-tab>
        </div>

        <div v-else>
            <router-link class="routerlink" to="/login">
                <v-tab>
                    SE CONNECTER
                </v-tab>
            </router-link>
            <router-link class="routerlink" to="/login/new">
                <v-tab>
                    S'INSCRIRE
                </v-tab>
            </router-link>
        </div>
    </v-app-bar>
</template>


<script>
import session from '../session';


export default {
    data: function () {
        return {
            session: session
        };
    },
    methods: {
        disconnect() {
            session.disconnect()
            this.$router.push('/');
        }
    }

}
</script>

<style scoped>
.green-title {
    color: green;
}

.container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0rem;
}

.title {
    text-align: center;
    flex-direction: column;
    flex-basis: 100%;
    padding: 0.3rem;
}


/* .nav {
    text-align: center;
align-content: space-between;
    flex-basis: 60%;
    padding: 0.3rem;

} */
.nav span {
    justify-self: left;
    background-color: red;
}

.user-entete {
    flex-basis: 10%;
    padding: 0.3rem;
}
</style>
