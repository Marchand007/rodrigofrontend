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
                        <v-list>
                            <v-list-subheader>
                                <h2>Ingredients</h2>
                            </v-list-subheader>
                            <v-list-item v-for="(ingredient, i) in this.ingredients" :key="i">
                                <span><strong>{{ ingredient.nom }}</strong></span>
                                <span> (</span>
                                <span v-if="ingredient.quantite">{{ ingredient.quantite }}</span>
                                <span v-if="ingredient.uniteMesure">{{ ingredient.uniteMesure }}</span>
                                <span>)</span>
                            </v-list-item>
                        </v-list>
                    </v-col>

                    <v-col cols="8">
                        <v-list>
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

            <v-card class="ma-2">
                <v-card-title>Ajouter un commentaire</v-card-title>
                <div v-if="session.user">
                    <v-row no-gutters>
                        <v-col cols="8">
                            <v-sheet class="ma-2">
                                <textarea v-model="textCommentaire" name="commentText" id="commentText" cols="80" rows="10"></textarea>
                            </v-sheet>
                        </v-col>
                        <v-col cols="4">
                            <div class="text-center">
                                <v-rating v-model="rating" hover half-increments></v-rating>
                                <pre>{{ rating }}</pre>
                            </div>

                            <v-card-action>
                                <v-btn v-on:click="">Envoyer Appréciation</v-btn>
                            </v-card-action>
                        </v-col>
                        <v-card-actions>
                            <v-btn class="ma-2" v-on:click="">Envoyer votre commentaire</v-btn>
                        </v-card-actions>
                    </v-row>
                </div>
                <h5 class="ma-2" v-else>Vous devez avoir un compte utilisateur pour ajouter un commentaire et/ou une appréciation</h5>
            </v-card>
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
import { fetchRecette, fetchEtapesByRecetteId, fetchIngredientsByRecetteId } from '../../RecetteService';
import { fetchCommentairesByRecetteId } from '../../RecetteService';
import session from '../../session';

export default {
    props: {
        id: String,
    },
    components: {

    },
    data() {
        return {
            recette: {},
            ingredients: [],
            etapes: [],
            commentaires: [],
            moyenneAppreciation: 0.00,
            loading: true,
            loadError: false,
            session: session,
            rating: 0,
            textCommentaire: ""
        };
    },
    mounted() {
        fetchRecette(this.id).then(recette => {
            this.recette = recette;
            this.loading = false;
            this.loadError = false;
        }).catch(err => {
            console.error(err);
            this.loading = false;
            this.loadError = true;
        });
        fetchEtapesByRecetteId(this.id).then(etapes => {
            this.etapes = etapes;
        }).catch(err => {
            console.error(err);
        }),
            fetchIngredientsByRecetteId(this.id).then(ingredients => {
                this.ingredients = ingredients;
            }).catch(err => {
                console.error(err);
            }),
            fetchCommentairesByRecetteId(this.id).then(commentaires => {
                this.commentaires = commentaires;
            }).catch(err => {
                console.error(err);
            })

    },
    computed: {
        recetteDetailUrl() {
            return "/recettes/" + this.id;
        },
        imageSrc() {
            return addApiPrefixToPath(this.recette.image);
        }
    },
    methods: {
        addCommentaire(){
            if(!session.user){
                alert("Impossible de soumettre le commentaire sans connexion");
            }
            const tempDate = new Date();
            let month = tempDate.getUTCMonth() +1;
            let day = tempDate.getUTCDate();
            let year = tempDate.getUTCFullYear();
            let hours = tempDate.getUTCHours();
            let minutes = tempDate.getUTCMinutes();
            let seconds = tempDate.getUTCSeconds();

            const newDate = year + " " + month + " " + day + " " + hours + "-" + minutes + "-";

            const commentaire = {
                courrielUtilisateur: session.user.courrielUtilisateur,
                recetteId: this.id,
                texte: this.textCommentaire,
                datePublication: newDate
            };

            fetch("/api/comments", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    ...session.getAuthHeaders()
                },
                body:JSON.stringify(commmentaire)
            }).then((response) => {
                if(response.ok){
                    alert("Merci de votre commentaire !");
                    this.reinitialiserSectionCommentaire();
                }
            })
        },
        addAppreciation(){
            
        },
        reinitialiserSectionCommentaire() {
            this.textCommentaire = "";
        },
        reinitialiserSectionAppreciation() {
            this.rating = 0;
        }
    }
}
</script>