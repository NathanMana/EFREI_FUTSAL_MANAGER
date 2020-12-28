<template>
    <section class="overlay">
        <article>
            <div class="article__title">
                <h2>Connexion</h2>
                <i v-on:click="redirection" class="fas fa-times icon-close"></i>
            </div>
            <form @submit.prevent="login">
                <input v-model="user.email" type="email" placeholder="Email">
                <div class="input-password">
                    <input v-model="user.password" :type="passwordType" name="" id="" placeholder="Mot de passe">
                    <i v-on:click="togglePassword" class="fas fa-eye toggle-password"></i>
                </div>
                <button class="btn" type="submit">Se connecter</button>
            </form>
            <span class="el-center">Pas de compte ?</span>
            <router-link class="link-underline" to="/registration">S'inscrire</router-link>
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
                },
                passwordType: "password"
            }
        },
        methods: {
            login(){
                this.$emit('login', this.user)
            },
            redirection(){
                router.back()
            },
            togglePassword(){
                if(this.passwordType === "password"){
                    this.passwordType = "text"
                } else {
                    this.passwordType = "password"
                }
            },
        }
    }
</script>