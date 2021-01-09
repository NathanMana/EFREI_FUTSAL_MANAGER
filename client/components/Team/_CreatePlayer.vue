<template>
    <section class="overlay">
        <article>
            <div class="article__title">
                <h2>Créer un joueur</h2>
                <i v-on:click="toggle" class="fas fa-times icon-close"></i>
            </div>
            <form @submit.prevent="create_player">
                <div class="error" v-show="error.state">{{error.message}}</div>
                <div class="form-colonne">
                    <input v-model="player.name" type="text" placeholder="Nom">
                    <input v-on:keyup="calcPrice" v-model="player.age" type="number" placeholder="Age">
                    <input v-on:keyup="calcPrice" v-model="player.endurance" step="0.1"  type="number" placeholder="Endurance (entre 0.1 et 4.9)">
                </div> 
                <div class="form-colonne">
                    <input v-model="player.firstName" type="text" placeholder="Prénom">
                    <select v-model="player.poste">
                        <option value="" disabled selected>Poste</option>
                        <option value="1">Gardien</option>
                        <option value="2">Joueur</option>
                    </select>
                    <input v-on:keyup="calcPrice" v-model="player.note" step="0.1"  type="number" placeholder="Note générale (entre 0.1 et 4.9)">  
                </div> 
                <button class="btn" type="submit">Créer ({{price}} €)</button>
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
                    firstName: "",
                    age: "",
                    poste:"",
                    endurance: "",
                    note: "",
                },
                price: 0,
                error: {
                    message: "",
                    state: false
                },
            }
        },
        methods: {
            calcPrice(){     
                let price = (parseFloat(this.player.endurance)*2000000 + parseFloat(this.player.note)*10000000) - parseInt(this.player.age)*250000
                if(isNaN(price)){
                    this.price = 0
                    return
                }               
                this.price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            },
            create_player(){
                this.error.state = false
                if(!this.player.endurance || !this.player.note || !this.player.poste || !this.player.name || !this.player.firstName || !this.player.age){
                    this.error.state = true
                    this.error.message = "Aucun champ ne peut être vide"
                    return
                }

                if(this.player.endurance >= 5 ||this.player.endurance <= 0){
                    this.error.state = true
                    this.error.message = "L'endurance doit être comprise entre 0.1 et 4.9"
                    return
                }

                if(this.player.note >= 5 || this.player.note <= 0){
                    this.error.state = true
                    this.error.message = "La note générale doit être comprise entre 0.1 et 4.9"
                    return
                }

                if(this.player.age > 70){
                    this.error.state = true
                    this.error.message = "Ce joueur est bien trop vieux, sa place est en tribune. Votre joueur doit avoir moins de 70 ans"
                    return
                }

                if(parseInt(this.price) < 0){
                    this.error.state = true
                    this.error.message = "Ce jeu serait trop facile s'il était possible de gagner de l'argent ;)"
                    return
                }
                
                this.toggle()
                this.$emit('create-player', this.player)
            },
            toggle(){
                this.$emit('toggle-view', false)
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