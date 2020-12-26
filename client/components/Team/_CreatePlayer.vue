<template>
    <section class="overlay">
        <article>
            <div class="article__title">
                <h2>Créer un joueur</h2>
                <i v-on:click="redirection" class="fas fa-times icon-close"></i>
            </div>
            <form @submit.prevent="login">
                <div class="form-colonne">
                    <input v-model="player.name" type="text" placeholder="Nom">
                    <input v-model="player.age" type="number" placeholder="Age">
                    <input v-model="player.endurance" type="number" placeholder="Endurance">
                </div> 
                <div class="form-colonne">
                    <input v-model="player.first_name" type="text" placeholder="Prénom">
                    <select  v-model="player.poste">
                        <option value="" disabled selected>Poste</option>
                        <option value="1"> Gardien </option>
                        <option value="2"> Attaquant </option>
                        <option value="3"> Défenseur </option>
                    </select>
                    <input v-model="player.note" type="number" placeholder="Note">  
                </div> 
                <button class="btn" type="submit">Créer</button>
            </form>
        </article>
    </section>
</template>

<script>
    module.exports = {
        data () {
            return {
                player: {
                    name: "",
                    first_name: "",
                    age: "",
                    poste:"",
                    endurance: "",
                    note: "",
                }
            }
        },
        methods: {
            create_player(){
                this.$emit('create_player', this.player)
            },
            redirection(){
                router.back()
            }
        }
    }
</script>

<style scoped>
form{
    display:flex;
    flex-wrap: wrap;
    align-items: center;
}

.form-colonne{
    margin: 10px;
    flex: 0 0 calc(50% - 20px);
}

select, input{
    width: 100%;
    margin: 10px;
}
</style>