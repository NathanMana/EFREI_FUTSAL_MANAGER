<template>
    <section id="team-profile">
        <router-view></router-view>
        <div class="absolute-top__left">
            <router-link to="/play" class="btn">Retour à l'accueil</router-link>
        </div>
        <div class="title">
            <img v-if="teamprofile.image" :src="teamprofile.image" alt="">
            <img v-else src="~/client/images/frontend/avatar_team.jpg" alt="">
            <h1>{{teamprofile.name}}</h1>
        </div>
        <div class="content">
            <h2 class="title-content">Joueurs</h2>
            <table v-if="teamprofile.players.length > 0" class="style-table">
                <tbody>
                    <tr v-for="player in teamprofile.players" :key="player.player_id">
                        <td>
                            <div class="content-td">
                                <span class="style-rect">{{Math.round(player.energie * 100) / 100}}%</span>
                                <span class="table-content">{{player.firstname}} <span style="text-transform:uppercase;">{{player.name}}</span></span>
                            </div>
                            <div class="td-action">
                                <span>Endurance: {{player.endurance}}/5</span>
                                <span>Note générale: {{player.grade}}/5</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table v-else class="style-table">
                <tbody>
                    <tr><td>Vous n'avez pas de joueur</td></tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
    module.exports = {
        props: {
            teamprofile: Object
        },
        data () {
            return {

            }
        },
        methods: {

        }
    }
</script>

<style scoped>
    /*
* Prefixed by https://autoprefixer.github.io
* PostCSS: v7.0.29,
* Autoprefixer: v9.7.6
* Browsers: last 4 version
*/

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
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
            -ms-flex-pack: justify;
                justify-content: space-between;
        background: var(--blue_semi_dark);
        -ms-flex-wrap: nowrap;
            flex-wrap: nowrap;
    }

    .table-content {
        padding: 5px 10px;
    }

    .td-action {
        display: block;
        width: 100%;
        background: var(--blue_dark);
        padding: 5px 10px;
        -ms-flex-wrap: wrap;
            flex-wrap: wrap;
        font-size: 0.8em;
    }

    .td-action span {
        font-weight: 200;
        width: 100%;
        padding: 5px;
        display: block;
        text-align: right;
        font-style: italic;
    }



</style>