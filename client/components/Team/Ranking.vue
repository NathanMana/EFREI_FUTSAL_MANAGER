<template>
    <section id="ranking">
        <router-view></router-view>
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
                    <tr v-on:click="teamProfile(1)">
                        <td><span class="style-rect">1</span></td>
                        <td>30</td>
                        <td>Les licornes de Maurepas</td>
                    </tr>
                    <tr>
                        <td><span class="style-rect">1</span></td>
                        <td>30</td>
                        <td>Les licornes de Maurepas</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
    module.exports = {
        data () {
            return {
            }
        },
        methods: {
            teamProfile(idTeam){
                window.location.href = "/#/play/team/" + idTeam;
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

</style>