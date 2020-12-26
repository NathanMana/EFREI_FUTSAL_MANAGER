<template>
    <section id="team-profile">
        <div class="title">
            <img src="http://placehold.it/50x50" alt="">
            <h1>Among 4es</h1>
        </div>
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
                                <span>Endurance: 4/5</span>
                                <span>Note générale: 4/5</span>
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
                                <span>Endurance: 4/5</span>
                                <span>Note générale: 4/5</span>
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
        data () {
            return {

            }
        },
        methods: {

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
        display: block;
        width: 100%;
        background: var(--blue_dark);
        padding: 5px 10px;
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