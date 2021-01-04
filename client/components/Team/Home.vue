<template>
    <section id="home-team">
        <router-view></router-view>
        <div class="title">
            <img v-if="myteam.image" :src="myteam.image" alt="">
            <h1>{{myteam.name}}</h1>
        </div>
        <div class="content">
            <div class="content-element" id="classement">
                <h2 class="h2-table">Classement</h2>
                <table>
                    <tbody>
                        <tr v-for="(team, index) in ranking" :key="team.team_id" v-on:click="getClubProfile(team.team_id)">
                            <td>
                                <span>{{index + 1}} - </span>
                                <img v-if="team.image" :src="team.image" alt="">
                                <img v-else src="http://placehold.it/20x20" alt="">
                                <span>{{team.name}}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="content-element" id="forme">
                <h2 class="h2-table">Etat de forme des joueurs</h2>
                <table v-if="myplayers.length > 0" class="style-table">
                    <tbody>
                        <tr v-for="player in myplayers" :key="player.player_id">
                            <td>
                                <span class="style-rect">{{player.energie}}</span>
                                <span class="table-content">{{player.firstname}} <span style="text-transform:uppercase;">{{player.name}}</span></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table v-else>
                    <tr><td><span style="text-align:right;width:100%;">Vous n'avez pas de joueur</span></td></tr>
                </table>
            </div>
        </div>
    </section>
</template>

<script>
    module.exports = {
        props: {
            ranking: Array,
            myplayers: Array,
            myteam: Object
        },
        data () {
            return {
            }
        },
        methods: {
            getClubProfile(id){
                this.$emit('get-club-profile', id)
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
    
    #classement td img {
        object-fit: contain;
        width: 20px;
        height: 20px;
    }

    #classement table {
        border-collapse: collapse;
    }
    #classement tr:nth-child(2n){
        background: var(--blue_semi_dark);
    }

    #classement tr:nth-child(2n + 1){
        background: var(--blue_dark);
    }

    .content {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .content .content-element {
        flex: 1 1 600px;
        max-width: 800px;
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

    table tr td img {
        margin: 5px 20px;
    }

    table tbody tr:nth-child(2n){
        background: var(--blue_semi_dark);
    }

    #forme .h2-table {
        float: right;
    }

    .see-next a {
        color: var(--blue_light);
        font-weight: 400;
        text-align: center;
        width: 100%;
        padding: 20px 0 0 0;
    }

    /* Media queries */
    @media screen and (max-width: 1200px){
        #home-team .content .content-element {
            width: 100%;
            display: block;
            margin-top: 30px;
            max-width: none;
        }

        #home-team .content .content-element .h2-table {
            width: 100%;
            max-width: none;
        }
    }
</style>