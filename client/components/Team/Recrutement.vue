<template>
    <section id="recrutement">
        <create-player v-show="showForm" @toggle-view="toggle" @create-player="createPlayer"></create-player>
        <div class="absolute-top__left">
            <router-link to="/play" class="btn">Retour à l'accueil</router-link>
        </div>
        <h1>Recrutement</h1>
        <a v-on:click="showForm = true" class="btn el-center">Créer un joueur </a>  
        <div class="content">
            <article class="article-recrutement" v-for="player in recrutement" :key="player.player_id">
                <div class="role">
                    <span v-if="player.role === 1" style="background:#ff7600;">GK</span>
                    <span v-else style="background:#4caf50;">J</span>
                </div>
                <img :src="player.image" v-if="player.image">
                <img src="../../images/frontend/avatar_player.jpg" alt="Lumière vecteur créé par upklyak - fr.freepik.com" v-else>
                <h2 class="h2-content"> {{player.name}} </h2>
                <div class="article-content">
                    <div class="article-content-item">
                        <span class="style-rect">{{player.age}}</span>
                        <span class="description">Age</span>
                    </div>  
                    <div class="article-content-item">
                        <span class="style-rect">{{player.endurance}}/5</span>
                        <span class="description">Endurance</span>
                    </div>
                    <div class="article-content-item">
                        <span class="style-rect">{{player.grade}}/5</span>
                        <span class="description">Note générale</span>
                    </div>
                    <h3>Prix</h3>
                    <button v-on:click="buyPlayer(player.player_id)">Acheter <span style="font-size:0.8em;">({{calcPrice(player)}} €)</span></button>
                </div>    
            </article>
        </div>
    </section>
</template>

<script>
    const CreatePlayer = window.httpVueLoader('./components/Team/_CreatePlayer.vue')
    module.exports = {
        components: {
            CreatePlayer,
        },
        props:{
            recrutement: Array,
        },
        data () {
            return {
                showForm:false,
            }
        },
        methods: {
            toggle(){
                this.showForm = false
            },
            buyPlayer(player_id){          
                this.$emit('buy-player', player_id)
            },
            createPlayer(player){
                this.$emit('create-player', player)
            },
            calcPrice(player){
                let price = (parseFloat(player.endurance))*2000000 + (parseFloat(player.grade))*10000000 - (parseInt(player.age)*500000)
                return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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


.role {
    position: absolute;
    top: 0;
    right: 0;
}

.role span { 
    padding: 2px 5px;
    font-size: 1.4em;
    font-weight: bold;
    color: var(--white);
    width: 60px;
    text-align:center;
    display:block;
}

.content{
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    padding: 30px;
}
article.article-recrutement {
    position: relative;
    width: 300px;
    height: 450px;
    border: 3px solid var(--blue_light);
    margin: 15px;
    background: var(--blue_dark);
}
article.article-recrutement img{
    width: 100%;
    height: 150px;
    -o-object-fit: cover;
       object-fit: cover;
}
article.article-recrutement h2.h2-content{
    background-color: var(--blue_light);
    padding: 7px;
}

.article-content-item {
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    -ms-flex-wrap: nowrap;
        flex-wrap: nowrap;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: justify;
        -ms-flex-pack: justify;
            justify-content: space-between;
    font-size: 1.5em;
    margin: 10px 0;
}

.article-content-item span:last-child{
    padding: 5px 10px;

}
h3{
    color: var(--white);
    font-weight: 500;
    text-align: center;
    font-size: 1.7em;
    position: relative;
    width: 100%;
    background: var(--blue_light);
    padding: 5px;
}
</style>