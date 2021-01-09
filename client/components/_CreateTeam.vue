<template>
    <section class="overlay">
        <article>
            <div class="article__title">
                <h2>Créer une équipe</h2>
                <i v-on:click="redirection" class="fas fa-times icon-close"></i>
            </div>
            <form @submit.prevent="createTeam">
                <div v-show="error.state" class="error">{{error.message}}</div>
                <input v-model="team.name" type="text" placeholder="Nom de l'équipe">
                <input v-model="team.image" type="text" placeholder="Lien vers l'image" name="" id="">
                <select v-model="team.difficulty" name="" id="">
                    <option value="" disabled selected>Difficulté</option>
                    <option value="0">Facile</option>
                    <option value="1">Moyen</option>
                    <option value="2">Dur</option>
                </select>
                <button class="btn" type="submit">Créer l'équipe</button>
            </form>
        </article>
    </section>
</template>

<script>
    module.exports = {
        data () {
            return {
                team: {
                    name: "",
                    image: "",
                    difficulty: ""
                },
                error : {
                    message: "",
                    state: false
                }
            }
        },
        methods: {
            createTeam(){

                this.error.state = false
                if(!this.team.difficulty){
                    this.error.message = "Veuillez sélectionner une difficulté"
                    this.error.state = true
                }
                if(!this.team.name){
                    this.error.message = "Le nom ne peut pas être nul"
                    this.error.state = true
                }

                if(!this.error.state)
                    this.$emit('create-team', this.team)
            },
            redirection(){
                router.push("/")
            }
        }
    }
</script>