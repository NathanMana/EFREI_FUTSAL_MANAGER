<template>
    <section id="account">
        <router-view></router-view>
        <h1>Mon compte</h1>
        <div style="width:50%;min-width:500px;display:block;margin: 0 auto;" class="container">
            <form @submit.prevent="editPassword">
                <h2>Modifier le mot de passe</h2>
                <div class="input-password">
                    <input v-model="userPassword.currentPassword" :type="currentPasswordType" placeholder="Mot de passe actuel">
                    <i v-on:click="toggleCurrentPassword" class="fas fa-eye toggle-password"></i>
                </div>
                <div v-show="errorNewPassword.state" class="error">{{errorNewPassword.message}}</div>
                <div class="input-password">
                    <input v-model="userPassword.newPassword" :type="newPasswordType" placeholder="Nouveau mot de passe">
                    <i v-on:click="toggleNewPassword" class="fas fa-eye toggle-password"></i>
                </div>
                <div class="input-password">
                    <input v-model="userPassword.repeatNewPassword" :type="repeatNewPasswordType" placeholder="Répéter le mot de passe">
                    <i v-on:click="toggleRepeatNewPassword" class="fas fa-eye toggle-password"></i>
                </div>
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
                },
                errorNewPassword : {
                    message: "",
                    state: false
                },
                currentPasswordType: "password",
                newPasswordType: "password",
                repeatNewPasswordType: "password",
            }
        },
        methods: {
            editPassword(){
                this.errorNewPassword.state = false

                if(this.userPassword.newPassword < 8 && !this.userPassword.newPassword.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/g)){
                    this.errorNewPassword.message = "Le mot de passe doit contenir au moins une lettre, un chiffre, un caractère spécial et doit être composé d'au moins 8 caractères"
                    this.errorNewPassword.state = true
                    errors = true
                }

                if(this.userPassword.newPassword != this.userPassword.repeatNewPassword){
                    this.errorNewPassword.state = true
                    this.errorNewPassword.message = "Les mots de passe indiqués ne sont pas les mêmes"
                }
                
                if(!this.errorNewPassword.state){
                    this.$emit('edit-password', this.userPassword)
                }
            },
            toggleCurrentPassword(){
                if(this.currentPasswordType === "password"){
                    this.currentPasswordType = "text"
                } else {
                    this.currentPasswordType = "password"
                }
            },
            toggleNewPassword(){
                if(this.newPasswordType === "password"){
                    this.newPasswordType = "text"
                } else {
                    this.newPasswordType = "password"
                }
            },
            toggleRepeatNewPassword(){
                if(this.repeatNewPasswordType === "password"){
                    this.repeatNewPasswordType = "text"
                } else {
                    this.repeatNewPasswordType = "password"
                }
            },
            deleteAccount(){
                let message = "Voulez-vous vraiment supprimer votre compte. Cette action est irrévocable et entrainera la perte de toutes vos données"
                this.$emit('display-alert', message, "delete-account")
            }
        }
    }
</script>

<style scoped>

</style>