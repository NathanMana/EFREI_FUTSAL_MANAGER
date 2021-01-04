<template>
    <section id="team-profile">
        <edit-team v-show="showFormTeamEdition" :myteam="myteam" @toggle-view="toggle" @edit-team="editTeam"></edit-team>
        <div class="absolute-top__left">
            <router-link to="/play" class="btn">Retour à l'accueil</router-link>
        </div>
        <h1>Equipe</h1>
        <div class="content">
            <h2 class="title-content">Joueurs</h2>
            <table v-if="myplayers && myplayers.length > 0" class="style-table">
                <tbody>
                    <tr v-for="player in myplayers" :key="player.player_id">
                        <td>
                            <div class="content-td">
                                <span class="style-rect">{{player.energie}}%</span>
                                <span class="table-content">{{player.firstname}} <span style="text-transform:uppercase;">{{player.name}}</span></span>
                            </div>
                            <div class="td-action">
                                <div class="action-buttons">
                                    <a v-on:click="edit(player.player_id)">Modifier</a>
                                    <a v-on:click="sell(player.player_id)">Vendre</a>
                                </div>
                                <div class="td-description">
                                    <span>Endurance: {{player.endurance}}/5</span>
                                    <span>Note générale: {{player.grade}}/5</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table class="style-table" v-else>
                <tbody>
                    <tr><td style="font-size:1.3em;color:#fff;text-align:center;width:100%;">Vous n'avez pas de joueur</td></tr>
                </tbody>
            </table>
            <div class="footer-btn">
                <a v-on:click="showFormTeamEdition = true" class="btn">Modifier l'équipe</a>
            </div>
        </div>
    </section>
</template>

<script>
    const EditTeam = window.httpVueLoader('./components/Team/_EditTeam.vue')
    module.exports = {
        components: {
            EditTeam
        },
        props: {
            myplayers: Array,
            myteam: Object
        },
        data () {
            return {
                showFormTeamEdition:false,
            }
        },
        methods: {
            toggle(){
                this.showFormTeamEdition = false
            },
            editTeam(team){
                this.$emit('edit-team', team)
            },
            editPlayer(player){
                this.$emit('edit-player', player)
            },
            sell(playerId){
                let total = 0;
                let message = "Voulez-vous vraiment vendre ce joueur, cette action vous rapportera " + total + " €"
                this.$emit('display-alert', message, playerId)
            },
        }
    }
</script>

<style scoped>
    .content {
        display: block;
        margin: 30px auto;
        max-width: 800px;
    }

    .title-content{
        width: 100%;
        background: var(--blue_light);
        padding: 5px 0;
    }
    
    table td {
        margin: 0;
        padding: 0!important;
    }

    table td .content-td {
        display: flex;
        justify-content: space-between;
        background: var(--blue_semi_dark);
        flex-wrap: nowrap;
    }

    .table-content {
        padding: 5px 10px;
    }

    .td-action {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        background: var(--blue_dark);
        padding: 5px 10px;
        flex-wrap: wrap;
        font-size: 0.8em;
    }

    .td-action .action-buttons {
        order: 1;
        flex: 0 1 50%;
    }

    .td-action .action-buttons a {
        color : var(--blue_light);
        font-weight: 500;
        text-decoration: underline;
        margin: 0 5px;
    }

    .td-description {
        order: 2;
        flex: 1 0 50%;
    }

    .td-description span {
        font-weight: 200;
        width: 100%;
        padding: 5px;
        display: block;
        text-align: right;
        font-style: italic;
    }



</style>