<template>
    <div class="boxed-center">
        <h2>Modification d'une recette</h2>
        <v-sheet v-if="session.user && session.user.isAdmin">
            <v-form @submit.prevent="" validate-on="submit lazy" ref="recetteform">
                <v-sheet class="boxed-center">
                    <v-sheet-title>Informations de la recette</v-sheet-title>
                    <v-container>
                        <v-row>
                            <v-col cols="1" sm="6">
                                <v-text-field class="w-100 justify-center" v-model="recette.id"
                                    label="Identifiant unique de la recette (exemple : poulet_curry)" density="compact"
                                    :rules="[rules.required, rules.recetteIdUnique]" disabled></v-text-field>
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
                                    label="Temps de preparation (minutes)" density="compact" type="number" min="0" step="1"
                                    :rules="[]"></v-text-field>
                            </v-col>
                            <v-col cols="1" sm="4">
                                <v-text-field v-model="recette.tempsCuissMin" label="Temps de cuisson (minutes)"
                                    density="compact" type="number" step="1" min="0" :rules="[]"></v-text-field>
                            </v-col>
                            <v-col cols="1" sm="4">
                                <v-text-field v-model="recette.nbPortions" label="Nombre de portions" density="compact"
                                    type="number" step="1" min="0" :rules="[]"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-text-field v-model="recette.descCourt" label="Description Courte" density="compact"
                        :rules="[rules.required]"></v-text-field>
                    <v-textarea id="description" v-model="recette.descLong" label="Description longue"
                        :rules="[rules.required]" auto-grow></v-textarea>
                </v-sheet>
                <v-sheet class="boxed-center">
                    <v-sheet-title>Liste des ingredients</v-sheet-title>
                    <v-form @submit.prevent="addIngredient" validate-on="submit" ref="ingredientAddForm">

                        <v-container v-for="(ingredient, i) in ingredients">
                            <v-row>

                                <span> {{ i + 1 }}</span>
                                <v-text-field class="ml-2" v-model="ingredients[i].quantite" density="compact">
                                </v-text-field>
                                <v-text-field class="ml-2" v-model="ingredients[i].uniteMesure" density="compact">
                                </v-text-field>
                                <v-text-field class="ml-2" v-model="ingredients[i].nom" density="compact"
                                    :rules="[rules.required]">
                                </v-text-field>

                                <v-btn class="ml-5" @click="deleteIngredient(i)" size="small">Supprimer l'ingrédient</v-btn>
                                <v-btn class="ml-5" @click="upIngredient(i)" size="small" :disabled="i <= 0">Monter
                                    l'ingrédient</v-btn>
                                <v-btn class="ml-5" @click="downIngredient(i)" size="small"
                                    :disabled="i >= ingredients.length - 1">Descendre l'ingrédient</v-btn>

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
                    <v-sheet-title class="ma-5">Liste des etapes</v-sheet-title>
                    <v-form @submit.prevent="addEtape" validate-on="submit" ref="etapeAddForm">

                        <v-container v-for="(etape, i) in etapes">
                            <v-row>
                                <span> {{ i + 1 }}</span>
                                <v-text-field class="ml-2" v-model="etapes[i].description" density="compact">

                                </v-text-field>
                                <v-btn class="ml-5" @click="deleteEtape(i)" size="small">Supprimer l'étape</v-btn>
                                <v-btn class="ml-5" @click="upEtape(i)" size="small" :disabled="i <= 0">Monter
                                    l'étape</v-btn>
                                <v-btn class="ml-5" @click="downEtape(i)" size="small"
                                    :disabled="i >= etapes.length - 1">Descendre l'étape</v-btn>
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
            </v-form>
        </v-sheet>
        <v-sheet v-else class="ma-2">Vous n'avez pas les permissions pour voir cette page</v-sheet>
    </div>
</template>


<script>

import session from '../session';
import { fetchRecette, fetchEtapesByRecetteId, fetchIngredientsByRecetteId } from '../RecetteService';


export default {
    props: {
        id: String,
    },
    data()
    {
        return {
            session: session,
            recette: {},
            ingredients: [],
            etapes: [],
            rules: {
                required: value => !!value || "Le champ est requis",
                productIdUnique: () => this.productIdUnique || "Cet identifiant est déjà utilisé, veuillez en enter un autre"
            },
            nouvQuantiteIngredient: "",
            nouvMesureIngredient: "",
            nouvNomIngredient: "",
            nouvNomEtape: ""
        };
    },
    methods: {
        addIngredient()
        {
            if (this.nouvNomIngredient == "")
            {
                alert("champs requis");
                return;
            }

            const nouvIngredient = {
                nom: this.nouvNomIngredient,
                quantite: this.nouvQuantiteIngredient,
                uniteMesure: this.nouvMesureIngredient,
            }
            this.ingredients.push(nouvIngredient);
            this.nouvNomIngredient = "";
            this.nouvQuantiteIngredient = "";
            this.nouvMesureIngredient = "";
        },
        deleteIngredient(index)
        {
            this.ingredients.splice(index, 1);

        },
        upIngredient(index)
        {
            if (index > 0)
            {
                this.ingredients[index - 1] = this.ingredients.splice(index, 1, this.ingredients[index - 1])[0];
            }
        },
        downIngredient(index)
        {
            if (index < this.ingredients.length - 1)
            {
                this.ingredients[index + 1] = this.ingredients.splice(index, 1, this.ingredients[index + 1])[0];
            }
        },
        addEtape()
        {
            if (this.nouvNomEtape == "")
            {
                alert("champs requis");
                return;
            }

            const nouvEtape = {
                description: this.nouvNomEtape,
            }
            this.etapes.push(nouvEtape);
            this.nouvNomEtape = "";
        },
        deleteEtape(index)
        {
            this.etapes.splice(index, 1);
        },
        upEtape(index)
        {
            if (index > 0)
            {
                this.etapes[index - 1] = this.etapes.splice(index, 1, this.etapes[index - 1])[0];
            }
        },
        downEtape(index)
        {
            if (index < this.etapes.length - 1)
            {
                this.etapes[index + 1] = this.etapes.splice(index, 1, this.etapes[index + 1])[0];
            }
        },
    },
    mounted()
    {
        fetchRecette(this.id).then(recette =>
        {
            this.recette = recette;
            this.loading = false;
            this.loadError = false;
        }).catch(err =>
        {
            console.error(err);
            this.loading = false;
            this.loadError = true;
        });
        fetchIngredientsByRecetteId(this.id).then(ingredients =>
        {
            this.ingredients = ingredients;
            this.loading = false;
            this.loadError = false;
        }).catch(err =>
        {
            console.error(err);
            this.loading = false;
            this.loadError = true;
        });
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

<style scoped>
.boxed-center {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    margin: 1rem auto;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
    width: 100%;
    max-width: 80rem;
}</style>
