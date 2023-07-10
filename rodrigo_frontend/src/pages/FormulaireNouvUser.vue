<template>
    <div class="boxed-center">
        <v-sheet class="ma-2" max-width="40rem">
            <v-sheet class="ma-2" max-width="40rem">
            <v-form @submit.prevent="createUserAccount" validate-on="submit lazy" ref="newUserForm">
                <v-text-field v-model="userAccountEmail" label="Adresse courriel" :rules="[rules.required, rules.passwordValid]"
                    density="compact"></v-text-field>
                <v-text-field v-model="password" label="Mot de passe" type="password"
                    :rules="[rules.required, rules.passwordValid]" density="compact"></v-text-field>
                <v-text-field></v-text-field>
                <v-btn type="submit" :disabled="!userAccountEmail || !password">Se connecter</v-btn>
            </v-form>
        </v-sheet>
        </v-sheet>
    </div>


</template>

<script>
import session from '../session';

export default {
    data: function () {
        return {
            userAccountEmail: '',
            password: '',
            passwordConf: '',
            userFullName: '',
            rules: {
                required: value => !!value || "Le champ est requis",
                passwordsMatch: () => this.password === this.passwordConf || "Les mots de passe ne correspondent pas",
                userAccountEmailUnique: () => this.userAccountEmail || "Cette adressse courriel est déjà utilisée, veuillez en entrer une autre"
            },
            userAccountUnique: true
        };
    },
    methods: {
        async createUserAccount() {
            this.userAccountUnique = true;
            const formValid = await this.$refs.newUserForm.validate();

            if (formValid.valid) {
                session.createUserAccount(this.userAccountEmail, this.userFullName, this.password).then(
                    () => {
                        alert("Compte créé avec succès, veuillez vous authentifier pour accéder à votre compte.");
                        this.userAccountUnique = true;
                        this.$router.replace('/login');
                    }).catch(authError => {
                        alert(authError.message);
                        if (authError.status === 409) {
                            this.userAccountUnique = false;
                            this.$refs.newUserForm.validate();
                        }
                    });
            }
        }

    }
}
</script>