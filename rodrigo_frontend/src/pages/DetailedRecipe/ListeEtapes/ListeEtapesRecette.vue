<v-col cols="8">
    <v-list >
        <v-list-subheader>
            <h2>Etapes</h2>
        </v-list-subheader>
        <v-list-item v-for="(etape, i) in this.etapes" :key="i">
            <v-list-item-title v-text="etape.ordre + ' - ' + etape.description"></v-list-item-title>
        </v-list-item>
    </v-list>
</v-col>