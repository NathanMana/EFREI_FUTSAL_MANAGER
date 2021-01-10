<template>
    <section id="account">
        <router-view></router-view>
        <h1>Mon compte</h1>
        <div style="width:50%;min-width:500px;display:block;margin: 0 auto;" class="container">
            <form @submit.prevent="editAccount">
                <h2>Modifier les informations</h2>
                <div v-show="error.state" class="error">{{error.message}}</div>
                <input v-model="user.username" type="text" placeholder="Pseudo">
                <input v-model="user.email" type="email" placeholder="Email">
                <button class="btn" type="submit">Modifier</button>
            </form>
        </div>

        <div class="footer-btn">
            <router-link to="/account/password/edit" class="btn">Modifier le mot de passe</router-link>
            <a v-on:click="deleteGame" v-show="user.hasRunningGame" class="btn btn-delete">Supprimer la partie</a>
            <a v-on:click="deleteAccount" class="btn btn-delete">Supprimer le compte</a>
        </div>
    </section>
</template>

<script>
    module.exports = {
        props: {
            user: {type: Object},
        },
        data () {
            return {
                error : {
                    message: "",
                    state: ""
                }
            }
        },
        methods: {
            editAccount(){     
                this.error.state = false
                if(!this.user.username || !this.user.email){
                    this.error.message = "Aucun champ ne peut être vide"
                    this.error.state = true
                }
                //Pas besoin d'envoyer l'objet car déjà présent dans l'élément parent
                if(!this.error.state){
                    this.$emit('edit-account')
                }
            },
            deleteAccount(){
                let message = "Voulez-vous vraiment supprimer votre compte ? Cette action est irrévocable et entrainera la perte de toutes vos données"
                this.$emit('display-alert', message, "delete-account")
            },
            deleteGame(){
                let message = "Voulez-vous vraiment supprimer la partie ? Cette action entrainera la suppression de toutes les données et vous ne pourrez pas faire machine arrière"
                this.$emit('display-alert', message, "delete-game")
            }
        }
    }
</script>

<style scoped>

</style>