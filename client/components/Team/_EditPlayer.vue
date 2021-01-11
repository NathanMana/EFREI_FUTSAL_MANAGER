<template>
    <section class="overlay">
        <article>
            <div class="article__title">
                <h2>{{player.firstname}} {{player.name}}</h2>
                <i v-on:click="toggle" class="fas fa-times icon-close"></i>
            </div>
            <form @submit.prevent="editPlayer">
                <div class="error" v-show="error.state">{{error.message}}</div>
                <label for="">Endurance (entre 0.1 et 4.9)</label>
                <input v-on:keyup="calcPrice" v-model="player.endurance" type="number" step="0.1" placeholder="Endurance (entre 0.1 et 4.9)">
                <label for="">Poste</label>
                <select v-model="player.role">
                    <option value="" disabled selected>Poste</option>
                    <option value="1">Gardien</option>
                    <option value="2">Joueur</option>
                </select>
                <label for="">Note générale (entre 0.1 et 4.9)</label>
                <input v-on:keyup="calcPrice" v-model="player.grade" type="number" step="0.1" placeholder="Note (entre 0.1 et 4.9)">  
                <button class="btn" type="submit">Modifier ({{price}} €)</button>
            </form>
        </article>
    </section>
</template>

<script>
    module.exports = {
        props: {
            player: Object,
            playerdefault: Object
        },
        data () {
            return {
                error: {
                    message: "",
                    state: false
                },
                price: 0,
            }
        },
        methods: {
            calcPrice(){     
                let price = (this.playerdefault.endurance - parseFloat(this.player.endurance))*2000000 + (this.playerdefault.grade - parseFloat(this.player.grade))*10000000
                if(isNaN(price)){
                    this.price = 0
                    return
                } else if(price < 0){
                    price = Math.round(price * 100) / 100
                    this.price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                } else if(price >= 0){
                    price = Math.round(price * 100) / 100
                    this.price = "+ " + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                }    
            },
            toggle(){
                this.$emit('toggle-view', false)
            },
            editPlayer(){
                this.error.state = false
                if(!this.player.endurance || !this.player.grade || !this.player.role){
                    this.error.state = true
                    this.error.message = "Aucun champ ne peut être vide"
                    return
                }

                if(this.player.endurance >= 5 ||this.player.endurance <= 0){
                    this.error.state = true
                    this.error.message = "L'endurance doit être comprise entre 0.1 et 4.9"
                    return
                }

                if(this.player.grade >= 5 || this.player.grade <= 0){
                    this.error.state = true
                    this.error.message = "La note générale doit être comprise entre 0.1 et 4.9"
                    return
                }
    
                const data = {
                    endurance: parseFloat(this.player.endurance),
                    grade: parseFloat(this.player.grade),
                    role: this.player.role,
                    player_id: this.player.player_id,
                    team_id: this.player.team_id
                }
                this.$emit('edit-player', data)
                this.toggle()
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