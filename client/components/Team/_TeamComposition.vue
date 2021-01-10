<template>
    <section class="overlay">
        <article>
            <div class="article__title">
                <h2>Composition d'équipe</h2>
                <i v-on:click="close" class="fas fa-times icon-close"></i>
            </div>
            <span style="margin: 20px auto;display:block;text-align:center;font-size:1.2em;">Vous allez simuler la semaine en cours. La simulation comprend les entrainements et le match. Choisissez les 5 joueurs qui participeront à la rencontre de dimanche (il faut cliquer dessus). Jouer un match épuise beaucoup les joueurs, choisissez bien !</span>
            <div v-show="error.state" class="error">{{error.message}}</div>
            <table class="style-table">
                <tbody>
                    <tr :class="{'player-selected': player.selected}" v-on:click="selectPlayer(player.player_id)" v-for="player in team.players" :key="player.player_id">
                        <td>
                            <span class="style-rect">{{Math.round(player.energie * 100) / 100}}%</span>
                            <span class="table-content">{{player.firstname}} <span style="text-transform:uppercase;">{{player.name}}</span></span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <a v-show="canSimulate" style="display:block;margin: 20px auto 0 auto;" v-on:click="simulation" class="btn">Lancer la simulation</a>
        </article>
    </section>
</template>

<script>
    module.exports = {
        props: {
            team: Object,
        },
        data () {
            return {
                confetti : false,
                error: {
                    message: "",
                    state: false
                },
                canSimulate: false
            }
        },
        methods: {
           selectPlayer(playerId){
                this.error.state = false
                //On compte cb de joueurs ont été sélectionnés
                const nberSelected = this.team.players.filter(c => c.selected === true).length
                const player = this.team.players.find(c => c.player_id === playerId)
                if(nberSelected >= 5 && !player.selected){
                    this.error.message = "Vous avez déjà sélectionné 5 joueurs"
                    this.error.state = true
                    return
                }             
                player.selected = !player.selected

                const nberSelected2 = this.team.players.filter(c => c.selected === true).length
                if(nberSelected2 === 5){
                    this.canSimulate = true
                } else {
                    this.canSimulate = false
                }
           },
           simulation(){
               this.$emit('simulation')
           },
           close(){
               this.$emit("close")
           }
        }
    }
</script>
<style scoped>

    .style-table tbody tr:nth-child(2n){
        background: var(--blue_semi_dark);
    }

    .style-table tbody tr:nth-child(2n + 1){
        background: var(--blue_dark);
    }

    .style-rect::after {
        right: -29px!important;
    }

    article {
        position: relative;
        width: 60%!important;
    }

    table {
        width: 100%;
    }

    table tr {
        width: 100%;
        cursor: pointer;
    }

    table tr td {
        display: flex;
        justify-content: left;
        align-items: center;
        flex-wrap: nowrap;
        color: var(--white);
        padding: 5px 10px;
        width: 100%;
        font-size: 1.5em;
        font-weight: 400;
    }

    .player-selected {
        background: #24c2c281!important;
    }
</style>