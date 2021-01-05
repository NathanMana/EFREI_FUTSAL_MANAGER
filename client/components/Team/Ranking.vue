<template>
    <section id="ranking">
        <div class="absolute-top__left">
            <router-link to="/play" class="btn">Retour à l'accueil</router-link>
        </div>
        <h1>Classement</h1>
        <div class="content">
            <table class="style-table">
                <thead>
                    <tr>
                        <th>Classement</th>
                        <th>Points</th>
                        <th style="padding-right:20px;text-align:right;">Equipe</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-on:click="getClubProfile(team.team_id)" v-for="(team, index) in ranking" :key="team.team_id">
                        <td><span class="style-rect">{{index + 1}}</span></td>
                        <td>{{team.points}}</td>
                        <td> 
                            <div class="td-content">
                                {{team.name}}
                                <img class="img-td" v-if="team.image" :src="team.image" alt="">
                                <img class="img-td" v-else src="../../images/frontend/avatar_team.jpg" alt="">      
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
    module.exports = {
        props: {
            ranking:Array
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
    .content {
        display: block;
        width: 80%;
        margin: 20px auto;
    }

    table.style-table thead tr th:first-child,
    table.style-table thead tr th:nth-child(2) {
        padding:5px 20px 5px 20px!important;
    }

    table.style-table tbody tr {
        border-bottom: 2px solid var(--blue_dark);
        cursor: pointer;
    }
    
    table.style-table tbody tr td {
        background: var(--blue_semi_dark);
    }

    table.style-table tbody tr td:first-child,
    table.style-table tbody tr td:nth-child(2) {
        text-align: center;
        width:fit-content!important;
    }

    table.style-table tbody tr td:last-child {
        text-align: right;
    }

    table.style-table tbody tr span {
        display: block;
    }

    .img-td {
        width: 30px;
        height: 30px;
        object-fit: contain;
        vertical-align: middle;
    }

    .td-content {
        display: block;
        padding: 8px 0;
    }

</style>