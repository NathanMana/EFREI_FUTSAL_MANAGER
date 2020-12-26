<template>
    <section class="overlay">
        <article>
            <div class="article__title">
                <h2>Inscription</h2>
                <i v-on:click="redirection" class="fas fa-times icon-close"></i>
            </div>
            <form @submit.prevent="registration">
                <div v-show="errorEmail.state" class="error">{{errorEmail.message}}</div>
                <input v-model="user.email" type="email" placeholder="Email">
                <div v-show="errorUsername.state" class="error">{{errorUsername.message}}</div>
                <input v-model="user.username" type="text" placeholder="Pseudo" name="" id="">
                <div v-show="errorPassword.state" class="error">{{errorPassword.message}}</div>
                <input v-model="user.password" type="password" name="" id="" placeholder="Mot de passe">
                <div v-show="errorPasswordConfirmation.state" class="error">{{errorPasswordConfirmation.message}}</div>
                <input v-model="user.repeatPassword" type="password" name="" id="" placeholder="Répétez le mot de passe">
                <button class="btn" type="submit">S'inscrire</button>
            </form>
            <span class="el-center">Déjà un compte ?</span>
            <router-link class="link-underline" to="/login">Se connecter</router-link>
        </article>
    </section>
</template>

<script>
    module.exports = {
        data () {
            return {
                user: {
                    email: "",
                    password: "",
                    username: "",
                    repeatPassword: ""
                },
                errorEmail: {
                    message: "",
                    state: false
                },
                errorUsername: {
                    message: "",
                    state: false
                },
                errorPassword: {
                    message: "",
                    state: false
                },
                errorPasswordConfirmation: {
                    message: "",
                    state: false
                },
            }
        },
        methods: {
            registration(){
                let errors = false
                this.errorEmail.state = false
                this.errorUsername.state = false
                this.errorPassword.state = false
                this.errorPasswordConfirmation.state = false

                if(!this.user.email){
                    this.errorEmail.message = "Indiquer une adresse mail valide"
                    this.errorEmail.state = true
                    errors = true
                }

                if(!this.user.username){
                    this.errorUsername.message = "Indiquer un pseudo"
                    this.errorUsername.state = true
                    errors = true
                }

                if(this.user.password != this.user.repeatPassword){
                    this.errorPasswordConfirmation.message = "Les 2 mots de passe indiqués ne correspondent pas"
                    this.errorPasswordConfirmation.state = true
                    errors = true
                }

                if(this.user.password.length < 8 && !this.user.password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/g)){
                    this.errorPassword.message = "Le mot de passe doit contenir au moins une lettre, un chiffre, un caractère spécial et doit être composé d'au moins 8 caractères"
                    this.errorPassword.state = true
                    errors = true
                }

                if(!errors){
                    
                    this.$emit('registration', this.user.email)
                }
            },
            redirection(){
                router.back()
            }
        }
    }
</script>