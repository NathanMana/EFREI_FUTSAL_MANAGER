<template>
    <section id="training">
        <div class="absolute-top__left">
            <router-link to="/play" class="btn">Retour à l'accueil</router-link>
        </div>
        <div class="title">
            <h1>Calendrier</h1>
        </div>
        <div class="content">
            <article v-for="(week, index) in calendar" :key="week.week_id">
                <div class="article-head">
                    <span>{{displayDayMatch(index + 1)}} journée</span>
                </div>
                <div v-for="match in week.matchs" :key="match.team_dom_id" class="article-content">
                    <span v-on:click="getClubProfile(match.team_dom_id)"><img :src="displayTeamImage(match.team_dom_id)" alt=""> {{displayTeamName(match.team_dom_id)}}</span>
                    <span>{{displayMatchResult(match.result)}}</span>
                    <span v-on:click="getClubProfile(match.team_ext_id)">{{displayTeamName(match.team_ext_id)}} <img :src="displayTeamImage(match.team_ext_id)" alt=""></span>
                </div>
            </article>
        </div>
    </section>
</template>

<script>
    module.exports = {
        props: {
            calendar: Array,
            ranking: Array,
            myteam: Object
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
            },
            getClubProfile(id){
                this.$emit('get-club-profile', id)
            }
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
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
            -ms-flex-pack: justify;
                justify-content: space-between;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -ms-flex-wrap: nowrap;
            flex-wrap: nowrap;
        padding: 10px;
        color: var(--white);
        font-weight: bold;
        font-size: 1.4em;
    }

    article .article-content {
        background: var(--blue_semi_dark);
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
            -ms-flex-pack: justify;
                justify-content: space-between;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -ms-flex-wrap: nowrap;
            flex-wrap: nowrap;
        padding: 10px;
        color: var(--white);
        font-size: 1.2em;
    }

    .article-content span {
        width: 250px;
        cursor: pointer;
    }

    .article-content span:nth-child(2){
        text-align: center;
    }

    .article-content span:last-child {
        text-align: right;
    }

    .article-content img {
        width: 20px;
        height: 20px;
        -o-object-fit: contain;
           object-fit: contain;
        vertical-align: middle;
    }

</style>