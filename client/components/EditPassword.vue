<template>
    <section id="account">
        <router-view></router-view>
        <h1>Mon compte</h1>
        <div style="width:50%;min-width:500px;display:block;margin: 0 auto;" class="container">
            <form @submit.prevent="editPassword">
                <h2>Modifier le mot de passe</h2>
                <input v-model="currentPassword" type="password" placeholder="Mot de passe actuel">
                <input v-model="newPassword" type="password" placeholder="Nouveau mot de passe">
                <input v-model="repeatNewPassword" type="password" placeholder="Répéter le mot de passe">
                <button class="btn" type="submit">Modifier</button>
            </form>
        </div>

        <div class="footer-btn">
            <router-link to="/account" class="btn">Paramètres</router-link>
            <a v-on:click="deleteAccount" class="btn btn-delete">Supprimer le compte</a>
        </div>
    </section>
</template>

<script>
    module.exports = {
        data () {
            return {
                userPassword: {
                    newPassword:"",
                    currentPassword: "",
                    repeatNewPassword: ""
                }
            }
        },
        methods: {
            editPassword(){
                if(this.userPassword.newPassword != this.userPassword.repeatNewPassword){
                    return alert("Le mot de passe n'est pas le bon")
                }
                //this.$emit('edit-password', this.userPassword)
            }
        }
    }
</script>

<style scoped>

</style>