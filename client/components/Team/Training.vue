<template>
    <section id="training">
        <div class="absolute-top__left">
            <router-link to="/play" class="btn">Retour à l'accueil</router-link>
        </div>
        <div class="title">
            <h1>Entrainement</h1>
        </div>
        <p>Les entrainements permettent à vos joueurs de s'améliorer ou de rester en forme pour les plus vieux. Grâce aux entrainements ils gagnent en endurance et niveau de jeu général. Attention ! Les jours de repos comptent, un abus d'entrainement épuisera vos joueurs et ils ne seront donc pas en forme pour le match du dimanche !</p>
        <div class="content">
            <div class="content-element" id="entrainement">
                <h2 class="h2-table">Programme</h2>
                <article class="training">
                    <table>
                        <tbody>
                            <tr v-for="item in trainingweek" :key = "item.training_id"><td style="padding-right:20px;">
                                <div class ="week">
                                    <span style="width:110px;display: inline-block">{{displayDay(item.day)}}</span>
                                    <span style="width:50px;text-align:center; margin-right:25px">  -  </span>
                                    <span>{{item.name}}</span>
                                </div>    
                                <i v-on:click="deleteTraining(item.training_id)" class="fas fa-times icon-close"></i>
                            </td></tr>
                        </tbody>
                    </table>
                </article>    
            </div>
            <div class="content-element" id="ajouter">    
                <form @submit.prevent="addTraining" class="style-train">
                    <h3 style="font-size: 1.5em;">Ajouter un entrainement</h3>
                    <div v-show="error.state" class="error">{{error.message}}</div>
                    <input v-model="training.name" type="text" placeholder="Nom d'entrainement">
                    <select  v-model="training.day">
                        <option value="" disabled selected>Jour</option>
                        <option value="1"> Lundi </option>
                        <option value="2"> Mardi </option>
                        <option value="3"> Mercredi </option>
                        <option value="4"> Jeudi </option>
                        <option value="5"> Vendredi </option>
                        <option value="6"> Samedi </option>
                    </select>
                    <button class="btn" type="submit">Ajouter</button>
                </form>
            </div>
        </div>
    </section>
</template>

<script>
    module.exports = {
        props:{
            trainingweek: Array
        },
        data () {
            return {
                training: {
                    name: "",
                    day: "",
                },
                error : {
                    message: "",
                    state: false
                }

            }
        },
        methods: {
            addTraining(){
                this.error.state = false
                if(!this.training.day){
                    this.error.message = "Veuillez sélectionner un jour"
                    this.error.state = true
                    return
                }
                if(!this.training.name){
                    this.error.message = "Le nom de l'entrainement ne peut pas être nul"
                    this.error.state = true
                    return
                }
                const index = this.trainingweek.map(t => t.day).indexOf(parseInt(this.training.day))
                if(index != -1){
                    this.error.message = "Un entrainement est déjà prévu pour ce jour, veuillez le supprimer si vous voulez le modifier"
                    this.error.state = true
                    return
                }
                if(!this.error.state)
                    this.$emit('add-training', this.training)
            },
            displayDay(day){
                let dayString =""
                switch(day){
                    case 1: 
                        dayString ="Lundi"
                        break
                    case 2: 
                        dayString ="Mardi"
                        break   
                    case 3: 
                        dayString ="Mercredi"
                        break
                    case 4: 
                        dayString ="Jeudi"
                        break    
                    case 5: 
                        dayString ="Vendredi"
                        break   
                    case 6: 
                        dayString ="Samedi"
                        break             
                }
                return dayString  
            },
            deleteTraining(training_id){
                let message = "Voulez-vous vraiment supprimer votre entrainement ?"
                this.$emit('display-alert', message, "delete-training",training_id)
            }
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
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
        -ms-flex-pack: justify;
            justify-content: space-between;
    -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    padding-top: 5%;
}

.content .content-element {
    -webkit-box-flex: 1;
        -ms-flex: 1 1 600px;
            flex: 1 1 600px;
    max-width: 800px;
    margin-right: 15px;
}

table {
    width: 100%;
    border-collapse: collapse
}

table tr {
    width: 100%;
    cursor: pointer;
}

table tr td {
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
    color: var(--white);
    padding: 10px 10px;
    width: 100%;
    font-size: 1.5em;
    font-weight: 400;
}
span {
    margin: 0 10px;
}

p {
    margin: 40px 40px 0 40px;
    text-align: center;
    font-size: 1.4em;
}

table tbody tr:nth-child(2n+1){
    background: var(--blue_semi_dark);
}
table tbody tr:nth-child(2n){
    background: var(--blue_dark);
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

h3 {
    color: var(--white);
    margin: 25px;
}

.style-train{
    margin-top: 10px;
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