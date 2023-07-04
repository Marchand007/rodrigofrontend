<template>
    <v-sheet class="ma-2">
        <h2 class="text-h4">{{ recette.nom }}</h2>
        <v-card class="ma-2">
            <v-sheet class="d-flex flex-no-wrap">
                <v-sheet class="w-100">
                    <v-img :src="imageSrc" max-height="100rem" />
                </v-sheet>
                <v-sheet>
                    <v-card-title>Mais c'est quoi du {{ recette.nom }} ??</v-card-title>
                    <v-card-text>
                        <div class="text-body-1">{{ recette.descLong }}</div>
                    </v-card-text>
                </v-sheet>
            </v-sheet>


            <v-container>
                <v-card class="ma-2">
                <v-row no-gutters>
                    <v-col>
                        <v-sheet class="pa-2 ma-2">
                            Temps de prepration : {{ recette.tempsPrepMin }} minutes
                        </v-sheet>
                    </v-col>

                    <v-col>
                        <v-sheet class="pa-2 ma-2">
                            Temps de cuisson : {{ recette.tempsCuissonMin }} minutes
                        </v-sheet>
                    </v-col>

                    <v-col>
                        <v-sheet class="pa-2 ma-2">
                            Nombre de portions : {{ recette.nbPortions }} portions
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-card>

                <v-row no-gutters>
                    <v-col cols="4">
                            <v-list disabled>
                                <v-list-subheader>
                                    <h2>Ingredients</h2>
                                </v-list-subheader>
                                <v-list-item v-for="(ingredient, i) in this.ingredients" :key="i">
                                    <v-list-item-title
                                        v-text="ingredient.quantite + ingredient.uniteMesure + ' ' + ingredient.nomIngredient"></v-list-item-title>
                                </v-list-item>
                            </v-list>
                    </v-col>

                    <v-col cols="8">
                            <v-list disabled>
                                <v-list-subheader>
                                    <h2>Etapes</h2>
                                </v-list-subheader>
                                <v-list-item v-for="(etape, i) in this.etapes" :key="i">
                                    <v-list-item-title v-text="etape.ordre + ' - ' + etape.description"></v-list-item-title>
                                </v-list-item>
                            </v-list>
                    </v-col>
                </v-row>
            </v-container>
            <v-card>
                <v-card-title>Commentaires utilisateurs</v-card-title>
                               
                                <v-card class="pa-2 ma-2" v-for="(commentaire, i) in this.commentaires" :key="i">
                                    <h5>{{ commentaire.courrielUtilisateur }} ({{ commentaire.commentDatePublication }})</h5>
                                {{ commentaire.commentUtilisateur }}
                                </v-card>
                        

            </v-card>
        </v-card>
    </v-sheet>
</template>

<script>
import { addApiPrefixToPath } from '../../../src/api_utils.js';
import { fetchRecette } from '../../RecetteService';
import { fetchCommentairesByRecetteId } from '../../RecetteService';

export default {
    props: {
        id: String,
    },
    components: {

    },
    data()
    {
        return {
            recette: {},
            ingredients: [
                {
                    quantite: 3,
                    uniteMesure: "g",
                    nomIngredient: "Poudre de piment fort"
                },
                {
                    quantite: 8,
                    uniteMesure: null,
                    nomIngredient: "tomates"
                }
            ],
            etapes: [
                {
                    ordre: 1,
                    description: "Partir le four a 375 degres"
                },
                {
                    ordre: 2,
                    description: "Ecraser les tomates dans un pot"
                },
                {
                    ordre: 3,
                    description: "Versez la poudre de piment fort aux tomates"
                },
                {
                    ordre: 4,
                    description: "Mettre au four 30 minutes"
                }
            ],
            commentaires: [
                {
                    courrielUtilisateur: "josbleau@hotmail.com",
                    commentUtilisateur: "vraiment vraiment bon",
                    commentDatePublication: Date.now()
                },
                {
                    courrielUtilisateur: "admin@admin.com",
                    commentUtilisateur: "yes cest ma recette",
                    commentDatePublication: Date.now()
                },
                {
                    courrielUtilisateur: "lautrela@hotmail.com",
                    commentUtilisateur: "degeuxxxxx",
                    commentDatePublication: Date.now()
                }
            ],
            moyenneAppreciation: 0,
            loading: true,
            loadError: false
        };
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
        /* fetchCommentairesByRecetteId(this.id).then(commentaires =>
        {
            this.recette.commentaires = commentaires;
        }).catch(err =>
        {
            console.error(err);
        })
        */
    },
    computed: {
        recetteDetailUrl()
        {
            return "/recettes/" + this.id;
        },
        imageSrc()
        {
            return addApiPrefixToPath(this.recette.image);
        }
    }
}
</script>