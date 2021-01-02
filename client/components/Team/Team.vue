<template>
    <section id="team-profile">
        <router-view></router-view>
        <h1>Equipe</h1>
        <div class="content">
            <h2 class="title-content">Joueurs</h2>
            <table class="style-table">
                <tbody>
                    <tr>
                        <td>
                            <div class="content-td">
                                <span class="style-rect">95%</span>
                                <span class="table-content">Maxime TRAN</span>
                            </div>
                            <div class="td-action">
                                <div class="action-buttons">
                                    <a>Modifier</a>
                                    <a v-on:click="sell">Vendre</a>
                                    <a v-on:click="fired">Licencier</a>
                                </div>
                                <div class="td-description">
                                    <span>Endurance: 4/5</span>
                                    <span>Note générale: 4/5</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="content-td">
                                <span class="style-rect">95%</span>
                                <span class="table-content">Maxime TRAN</span>
                            </div>
                            <div class="td-action">
                                <div class="action-buttons">
                                    <a href="">Modifier</a>
                                    <a href="">Vendre</a>
                                    <a href="">Licencier</a>
                                </div>
                                <div class="td-description">
                                    <span>Endurance: 4/5</span>
                                    <span>Note générale: 4/5</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="footer-btn">
                <router-link to="/play/team/edit" class="btn">Modifier l'équipe</router-link>
                <a v-on:click="deleteAccount" class="btn btn-delete">Supprimer l'équipe</a>
            </div>
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
            deleteAccount(){
                
            },
            fired(){
                let message = "Voulez-vous vraiment licencier ce joueur, cette action ne vous rapportera pas d'argent. Vous devriez le vendre"
                this.$emit('display-alert', message)
            },
            sell(){
                let total = 0;
                let message = "Voulez-vous vraiment vendre ce joueur, cette action vous rapportera " + total + " €"
                this.$emit('display-alert', message)
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