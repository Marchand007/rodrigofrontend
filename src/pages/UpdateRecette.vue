<template>
    <div class="boxed-center">
        <h2>Modification d'une recette</h2>
        <v-sheet v-if="session.user && session.user.isAdmin">
            <v-file-input accept="image/*" label="Nouvelle image" prepend-icon="mdi-camera" id="recette-image"
                ref="recetteImage" v-model="fichierImage"></v-file-input>
            <v-form @submit.prevent="this.updateRecette" validate-on="submit lazy" ref="recetteform">
                <v-sheet class="boxed-center">
                    <h3>Informations de la recette</h3>
                    <v-container>
                        <v-row>
                            <v-col cols="1" sm="6">
                                <v-text-field class="w-100 justify-center" v-model="recette.id"
                                    label="Identifiant unique de la recette (exemple : poulet_curry)" density="compact"
                                    :rules="[rules.required]" disabled></v-text-field>
                            </v-col>
                            <v-col cols="1" sm="6">
                                <v-text-field v-model="recette.nom" label="Nom de la recette" density="compact"
                                    :rules="[rules.required]"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-container>
                        <v-row>
                            <v-col cols="1" sm="4">
                                <v-text-field class="mr-2" v-model="recette.tempsPrepMin"
                                    label="Temps de préparation (minutes)" density="compact" type="number" min="0" step="1"
                                    :rules="[]"></v-text-field>
                            </v-col>
                            <v-col cols="1" sm="4">
                                <v-text-field v-model="recette.tempsCuissonMin" label="Temps de cuisson (minutes)"
                                    density="compact" type="number" step="1" min="0" :rules="[]"></v-text-field>
                            </v-col>
                            <v-col cols="1" sm="4">
                                <v-text-field v-model="recette.nbPortions" label="Nombre de portions" density="compact"
                                    type="number" step="1" min="0" :rules="[]"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-text-field v-model="recette.descCourt" label="Description courte" density="compact"
                        :rules="[rules.required]"></v-text-field>
                    <v-textarea id="description" v-model="recette.descLong" label="Description longue"
                        :rules="[rules.required]" auto-grow></v-textarea>
                </v-sheet>
                <v-sheet class="boxed-center">
                    <h3>Liste des ingrédients</h3>
                    <v-form @submit.prevent="addIngredient" validate-on="submit" ref="ingredientAddForm">
                        <v-container v-for="(ingredient, i) in recette.ingredients">
                            <v-row>
                                <span> {{ i + 1 }}</span>
                                <v-text-field class="ml-2" v-model="recette.ingredients[i].quantite" density="compact">
                                </v-text-field>
                                <v-text-field class="ml-2" v-model="recette.ingredients[i].uniteMesure" density="compact">
                                </v-text-field>
                                <v-text-field class="ml-2" v-model="recette.ingredients[i].nom" density="compact"
                                    :rules="[rules.required]">
                                </v-text-field>
                                <v-btn class="ml-5" @click="deleteIngredient(i)" size="small">Supprimer l'ingrédient</v-btn>
                                <v-btn class="ml-5" @click="upIngredient(i)" size="small" :disabled="i <= 0">Monter
                                    l'ingrédient</v-btn>
                                <v-btn class="ml-5" @click="downIngredient(i)" size="small"
                                    :disabled="i >= recette.ingredients.length - 1">Descendre l'ingrédient</v-btn>
                            </v-row>
                        </v-container>
                        <v-container>
                            <v-row>
                                <v-text-field class="ml-2" label="Quantite" v-model="nouvQuantiteIngredient"
                                    density="compact">
                                </v-text-field>
                                <v-text-field class="ml-2" label="Unite de mesure" v-model="nouvMesureIngredient"
                                    density="compact">
                                </v-text-field>
                                <v-text-field class="ml-2" label="Nom du nouvel ingredient" v-model="nouvNomIngredient"
                                    density="compact" :rules="[rules.required]">
                                </v-text-field>
                                <v-btn class="w-25 ml-5" type="submit">Ajouter l'ingrédient</v-btn>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-sheet>
                <v-sheet class="boxed-center">
                    <h3 class="ma-5">Liste des étapes</h3>
                    <v-form @submit.prevent="addEtape" validate-on="submit" ref="etapeAddForm">
                        <v-container v-for="(etape, i) in recette.etapes">
                            <v-row>
                                <span> {{ i + 1 }}</span>
                                <v-text-field class="ml-2" v-model="recette.etapes[i].description"
                                    density="compact">
                                </v-text-field>
                                <v-btn class="ml-5" @click="deleteEtape(i)" size="small">Supprimer l'étape</v-btn>
                                <v-btn class="ml-5" @click="upEtape(i)" size="small" :disabled="i <= 0">Monter
                                    l'étape</v-btn>
                                <v-btn class="ml-5" @click="downEtape(i)" size="small"
                                    :disabled="i >= recette.etapes.length - 1">Descendre l'étape</v-btn>
                            </v-row>
                        </v-container>
                        <v-container>
                            <v-row>
                                <v-text-field class="ml-2" label="Description de la nouvelle étape" v-model="nouvNomEtape"
                                    density="compact" :rules="[rules.required]">
                                </v-text-field>
                                <v-btn class="w-25 ml-5" type="submit">Ajouter l'étape</v-btn>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-sheet>
                <v-btn class="w-25 mx-5" type="submit" size="large">Mettre la recette à jour</v-btn>
                <v-dialog v-model="dialog" persistent width="auto">
                    <template v-slot:activator="{ props }">
                        <v-btn v-if="session.user && session.user.isAdmin" class="ma-4" v-bind="props"
                            size="large">Supprimer la recette</v-btn>
                    </template>
                    <v-card>
                        <v-card-title class="text-h5">
                            Supprimer {{ recette.nom }}
                        </v-card-title>
                        <v-card-text>Voulez-vous vraiment supprimer la recette {{ recette.nom }}</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                                Annuler
                            </v-btn>
                            <v-btn color="blue-darken-1" variant="text" @click="deleteRecette">
                                Confirmer
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-form>
        </v-sheet>
        <v-sheet v-else class="ma-2">Vous n'avez pas les permissions pour voir cette page</v-sheet>
    </div>
</template>

<script>

import session from '../session';
import { updateRecette, fetchRecette, fetchEtapesByRecetteId, fetchIngredientsByRecetteId, deleteRecetteById, updateRecetteImage } from '../RecetteService';

export default {
    props: {
        id: String,
    },
    data() {
        return {
            session: session,
            recette: {
                ingredients: [],
                etapes: []
            },
            fichierImage: null,
            rules: {
                required: value => !!value || "Le champ est requis"
            },
            nouvQuantiteIngredient: "",
            nouvMesureIngredient: "",
            nouvNomIngredient: "",
            nouvNomEtape: "",
            dialog: false,
        };
    },
    methods: {
        refreshRecette(id) {

            fetchRecette(this.id).then(recette => {
                this.recette = recette;
            }).catch(err => {
                console.error(err);
            });
        },
        async updateRecette() {
            const formValid = await this.$refs.recetteform.validate();
            if (!formValid.valid) {
                return;
            }
            updateRecette(this.recette)
                .then(async reponse => {
                    if (this.fichierImage && this.fichierImage.length != 0) {
                        await this.submitImage();
                    }
                    this.$router.push('/recettes/' + this.id);
                }).catch(err => {
                    console.error(err);
                    alert(err.message);
                    this.$refs.recetteform.validate();
                });
        },
        deleteRecette() {
            this.dialog = true;
            deleteRecetteById(this.id).then(result => {
                this.$router.push('/');
            });
        },
        async submitImage() {
            if (this.fichierImage) {
                const formData = new FormData();
                formData.append('recette-image', this.fichierImage[0]);

                try {
                    await updateRecetteImage(this.id, formData);
                    this.refreshRecette(this.id);
                } catch (err) {
                    console.error(err);
                    alert(err.message);
                }
            }
        },
        addIngredient() {
            if (this.nouvNomIngredient == "") {
                alert("champs requis");
                return;
            }

            const nouvIngredient = {
                nom: this.nouvNomIngredient,
                quantite: this.nouvQuantiteIngredient,
                uniteMesure: this.nouvMesureIngredient,
            };

            this.recette.ingredients.push(nouvIngredient);
            this.nouvNomIngredient = "";
            this.nouvQuantiteIngredient = "";
            this.nouvMesureIngredient = "";
        },
        deleteIngredient(index) {
            this.recette.ingredients.splice(index, 1);
        },
        upIngredient(index) {
            if (index > 0) {
                this.recette.ingredients[index - 1] = this.recette.ingredients.splice(index, 1, this.recette.ingredients[index - 1])[0];
            }
        },
        downIngredient(index) {
            if (index < this.recette.ingredients.length - 1) {
                this.recette.ingredients[index + 1] = this.recette.ingredients.splice(index, 1, this.recette.ingredients[index + 1])[0];
            }
        },
        addEtape() {
            if (this.nouvNomEtape == "") {
                alert("champs requis");
                return;
            }

            const nouvEtape = {
                description: this.nouvNomEtape,
            };

            this.recette.etapes.push(nouvEtape);
            this.nouvNomEtape = "";
        },
        deleteEtape(index) {
            this.recette.etapes.splice(index, 1);
        },
        upEtape(index) {
            if (index > 0) {
                this.recette.etapes[index - 1] = this.recette.etapes.splice(index, 1, this.recette.etapes[index - 1])[0];
            }
        },
        downEtape(index) {
            if (index < this.recette.etapes.length - 1) {
                this.recette.etapes[index + 1] = this.recette.etapes.splice(index, 1, this.recette.etapes[index + 1])[0];
            }
        },
    },
    mounted() {
        this.refreshRecette(this.id);

        fetchIngredientsByRecetteId(this.id).then(ingredients => {
            this.recette.ingredients = ingredients;
        }).catch(err => {
            console.error(err);
        });

        fetchEtapesByRecetteId(this.id).then(etapes => {
            this.recette.etapes = etapes;
        }).catch(err => {
            console.error(err);
        });
    }
}
</script>

<style scoped>
.boxed-center {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    margin: 1rem auto;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
    width: 100%;
    max-width: 80rem;
}
</style>
