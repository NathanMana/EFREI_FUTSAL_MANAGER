<template>
    <section class="overlay">
        <img v-show="confetti" src="../../images/frontend/confetti.gif" alt="">
        <article>
            <div class="article__title">
                <h2>{{displayTitle()}}</h2>
            </div>
            <p>{{displayMessage()}}</p>
            <div id="alert-action">
                <a class="btn" v-on:click="reStart">Recommencer</a>
                <a class="btn" v-on:click="close">Fermer</a>
            </div>
        </article>
    </section>
</template>

<script>
    module.exports = {
        props: {
            team: Object,
            ranking: Array,
            end: Boolean
        },
        data () {
            return {
                confetti : false
            }
        },
        methods: {
           displayTitle(){
                const pos = this.ranking.map(c => c.team_id).indexOf(this.team.id)
                if(pos < 3){
                    this.confetti = true
                    return "BRAVO !"
                } else {
                    return "FIN DE LA SAISON"
                } 
           },
           displayMessage(){
                const pos = this.ranking.map(c => c.team_id).indexOf(this.team.id)
                if(pos < 3){
                   let stringPlace = "e"
                   if(pos === 0){
                       stringPlace = "ère"
                   }
                   return "Après une saison remplie de hauts et de bas, vous parvenez à vous hisser parmis les tous meilleurs du championnat. Bravo pour votre "+ (pos+1) + stringPlace + " place !"
                } 
                else if (pos < 7){
                    return "Après votre première saison vous terminez à la " + (pos+1) + "e place. Pas mal pour une première, hâte de voir ce que vous êtes capable de faire sur la prochaine"
                } else {
                   return "Après une saison mauvaise, vous terminez à la " + (pos+1) + "e place. Le président ne vous fait plus confiance et décide de ne pas continuer avec vous la saison prochaine."
                }
           },
           close(){
               this.$emit("close-end")
           },
           reStart(){
               this.$emit("restart")
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

 article {
        padding: 30px!important;
        position: relative;
    }

    p {
        margin-top: 20px;
        font-size: 1.5em;
    }

    img {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1000;
        top: 0;
        z-index: -1;
    }

</style>