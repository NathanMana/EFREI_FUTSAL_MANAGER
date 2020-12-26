<template>
    <section id="home-team">
        <div class="title">
            <img src="http://placehold.it/50x50" alt="">
            <h1>Among 4es</h1>
        </div>
        <div class="content">
            <div class="content-element" id="classement">
                <h2 class="h2-table">Classement</h2>
                <table>
                    <tbody>
                        <tr><td>
                            <span>1 - </span>
                            <img src="http://placehold.it/30x30" alt="">
                            <span>Les licornes de Maurepas</span>
                        </td></tr>
                        <tr><td>
                            <span>2 - </span>
                            <img src="http://placehold.it/30x30" alt="">
                            <span>Les licornes de Maurepas</span>
                        </td></tr>
                        <tr><td class="see-next"><a>Voir la suite</a></td></tr>
                    </tbody>
                </table>
            </div>
            <div class="content-element" id="forme">
                <h2 class="h2-table">Etat de forme des joueurs</h2>
                <table class="style-table">
                    <tbody>
                        <tr><td>
                            <span class="style-rect">95%</span>
                            <span class="table-content">Maxime TRAN</span>
                        </td></tr>
                        <tr><td>
                            <span class="style-rect">75%</span>
                            <span class="table-content">Rachid TRAN</span>
                        </td></tr>
                        <tr><td class="see-next"><a>Voir la suite</a></td></tr>
                    </tbody>
                </table>
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