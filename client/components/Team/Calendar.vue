<template>
    <section id="training">
        <div class="absolute-top__left">
            <router-link to="/play" class="btn">Retour à l'accueil</router-link>
        </div>
        <div class="title">
            <h1>Calendrier</h1>
        </div>
        <div class="content">
            <article v-for="(week, index) in calendar" :key="week[0].week_id">
                <div class="article-head">
                    <span>{{displayDayMatch(index + 1)}} journée</span>
                </div>
                <div v-for="match in week" :key="match.team_dom_id" class="article-content">
                    <span><img :src="displayTeamImage(match.team_dom_id)" alt=""> {{displayTeamName(match.team_dom_id)}}</span>
                    <span>{{displayMatchResult(match.result)}}</span>
                    <span>{{displayTeamName(match.team_ext_id)}} <img :src="displayTeamImage(match.team_ext_id)" alt=""></span>
                </div>
            </article>
        </div>
    </section>
</template>

<script>
    module.exports = {
        props: {
            calendar: Array,
            ranking: Array
        },
        data () {
            return {
                
            }
        },
        methods: {
            displayDayMatch(dayMatch){
                if(dayMatch === 1){
                    return dayMatch + "ère"
                } else {
                    return dayMatch + "e"
                }
            },
            displayTeamName(team_id){
                const index = this.ranking.map(e => e.team_id).indexOf(team_id)
                return this.ranking[index].name
            },
            displayTeamImage(team_id){
                const index = this.ranking.map(e => e.team_id).indexOf(team_id)
                let urlImage = this.ranking[index].image
                if(!urlImage){
                    urlImage = "../../images/frontend/avatar_team.jpg"
                }
                return urlImage
            },
            displayMatchResult(result){
                if(!result){
                    return " - "
                } else {
                    return result
                }
            }
        }
    }
</script>
<style scoped>

    .content {
        max-width: 700px;
        display: block;
        margin: 0 auto;
    }

    article {
        margin-top: 20px;
        margin-bottom: 10px;
    }

    article .article-head {
        background: var(--blue_light);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;
        padding: 10px;
        color: var(--white);
        font-weight: bold;
        font-size: 1.4em;
    }

    article .article-content {
        background: var(--blue_semi_dark);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;
        padding: 10px;
        color: var(--white);
        font-size: 1.2em;
    }

    .article-content span {
        width: 250px;
    }

    .article-content span:nth-child(2){
        text-align: center;
    }

    .article-content img {
        width: 20px;
        height: 20px;
        object-fit: contain;
        vertical-align: middle;
    }

</style>