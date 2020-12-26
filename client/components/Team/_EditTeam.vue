<template>
    <section class="overlay">
        <article>
            <div class="article__title">
                <h2>Modifier l'équipe</h2>
                <i v-on:click="redirection" class="fas fa-times icon-close"></i>
            </div>
            <form @submit.prevent="editTeam">
                <input v-model="team.name" type="text" placeholder="Nom de l'équipe">
                <input v-model="team.image" type="text" placeholder="Lien vers l'image" name="" id="">
                <button class="btn" type="submit">Modifier</button>
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
                }
            }
        },
        methods: {
            editTeam(){
                this.$emit('editTeam', this.team)
            },
            redirection(){
                router.back()
            }
        }
    }
</script>