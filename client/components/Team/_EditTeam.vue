<template>
    <section class="overlay">
        <article>
            <div class="article__title">
                <h2>Modifier l'équipe</h2>
                <i v-on:click="toggle" class="fas fa-times icon-close"></i>
            </div>
            <form @submit.prevent="editTeam">
                <div v-show="error.state" class="error">{{error.message}}</div>
                <input v-model="myteam.name" type="text" placeholder="Nom de l'équipe">
                <input v-model="myteam.image" type="text" placeholder="Lien vers l'image" name="" id="">
                <button class="btn" type="submit">Modifier</button>
            </form>
        </article>
    </section>
</template>

<script>
    module.exports = {
        props: {
            myteam: Object
        },
        data () {
            return {
                error:  {
                    message: "",
                    state: false
                }
            }
        },
        methods: {
            toggle(){
                this.$emit('toggle-view', false)
            },
            editTeam(){
                this.error.state = false
                if(!this.myteam.name){
                    this.error.message = "Le nom ne peut pas être vide"
                    this.error.state = true
                }

                if(!this.error.state){
                    this.toggle()
                    this.$emit('edit-team', this.myteam)
                }
            }
        }
    }
</script>