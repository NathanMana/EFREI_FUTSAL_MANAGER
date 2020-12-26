<template>
    <section id="account">
        <router-view></router-view>
        <h1>Mon compte</h1>
        <div style="width:50%;min-width:500px;display:block;margin: 0 auto;" class="container">
            <form @submit.prevent="account">
                <h2>Modifier les informations</h2>
                <input v-model="user.username" type="text" placeholder="Pseudo">
                <input v-model="user.email" type="email" placeholder="Email">
                <button class="btn" type="submit">Modifier</button>
            </form>
        </div>

        <div class="footer-btn">
            <router-link to="/account/password/edit" class="btn">Modifier le mot de passe</router-link>
            <a v-on:click="deleteAccount" class="btn btn-delete">Supprimer le compte</a>
        </div>
    </section>
</template>

<script>
    module.exports = {
        data () {
            return {
                user: {
                    username: "",
                    email: "",
                }
            }
        },
        methods: {
            account(){
                this.$emit('account', this.user)
            },
            deleteAccount(){
                this.$emit('deleteAccount')
            }
        }
    }
</script>

<style scoped>

</style>