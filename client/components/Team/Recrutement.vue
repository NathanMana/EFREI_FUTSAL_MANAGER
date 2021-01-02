<template>
    <section id="recrutement">
        <router-view></router-view>
        <h1>Recrutement</h1>
        <router-link :to="{ path: 'create-player'}" append class="btn el-center">Créer un joueur </router-link>  
        <div class="content">
            <article class="article-recrutement">
                <img src="http://placehold.it/50x50">
                <h2 class="h2-content">Nom</h2>
                <div class="article-content">
                    <div class="article-content-item">
                        <span class="style-rect">4/5</span>
                        <span class="description">Endurance</span>
                    </div>  
                    <div class="article-content-item">
                        <span class="style-rect">4/5</span>
                        <span class="description">Note générale</span>
                    </div>   
                    <h3>Prix</h3>
                    <button>Acheter</button>
                </div>    
            </article>
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
.content{
    display:flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    padding: 30px;
}
article.article-recrutement {
    width: 300px;
    height: 400px;
    border: 3px solid var(--blue_light);
    margin: 15px;
    background: var(--blue_dark);
}
article.article-recrutement img{
    width: 100%;
    height: 150px;
    object-fit: cover;
}
article.article-recrutement h2.h2-content{
    background-color: var(--blue_light);
    padding: 7px;
}

.article-content-item {
    display:flex;
    flex-wrap: nowrap;
    align-items: center;
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