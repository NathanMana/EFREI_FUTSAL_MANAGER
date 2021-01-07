const Home = window.httpVueLoader('./components/Home.vue')
const CreateTeam = window.httpVueLoader('./components/_CreateTeam.vue')

/* COMPTE */
const Login = window.httpVueLoader('./components/_Login.vue')
const Registration = window.httpVueLoader('./components/_Registration.vue')
const Account = window.httpVueLoader('./components/Account.vue')
const EditPassword = window.httpVueLoader('./components/EditPassword.vue')

/* TEAM */
const HomeTeam = window.httpVueLoader('./components/Team/Home.vue')
const Simulation = window.httpVueLoader('./components/Team/_Simulation.vue')
const Ranking = window.httpVueLoader('./components/Team/Ranking.vue')
const TeamProfile = window.httpVueLoader('./components/Team/TeamProfile.vue')
const Recrutement = window.httpVueLoader('./components/Team/Recrutement.vue')
const Team = window.httpVueLoader('./components/Team/Team.vue')
const Training = window.httpVueLoader('./components/Team/Training.vue')
const Calendar = window.httpVueLoader('./components/Team/Calendar.vue')

const children = [ 
    {
        path: 'play/simulation',
        component: Simulation
    },
]


const routes = [
    { 
        path: '/', 
        component: Home, 
        children: [
            {
                path: 'login',
                component: Login
            },
            {
                path: 'registration',
                component: Registration
            }, 
            {
                path: 'team/create',
                component: CreateTeam
            },
        ]
    },
    { 
        path: '/account', 
        component: Account,
        children
    },
    { 
        path: '/account/password/edit', 
        component: EditPassword, 
        children
    },
    { 
        path: '/play/', 
        component: HomeTeam, 
        children
    },
    { 
        path: '/play/ranking', 
        component: Ranking, 
        children
    },
    { 
        path: '/play/team/:id', 
        component: TeamProfile, 
        children
    },
    { 
        path: '/play/recrutement', 
        component: Recrutement
    },
    { 
        path: '/play/training', 
        component: Training, 
        children
    },
    { 
        path: '/play/team', 
        component: Team
    },
    { 
        path: '/play/calendar', 
        component: Calendar
    }
]

const router = new VueRouter({
    routes
})

var app = new Vue({
    router,
    el: '#app',
    data: {
        user: {
            id: 0,
            email: "",
            username: "",
            hasRunningGame: false
        },
        myTeam: {
            name: "",
            image: "",
            players: [],
            id: 0,
            cash: 0
        },
        myPlayers: [],
        ranking: [],
        teamProfile: {},
        recrutement:[],
        calendar: [],
        training: [],
        weekOpponent: "",
        alert: {
            displayDOMAlert: false,
            alertMessage: "",
            action: "", //Stocke l'action a exécuter, si l'utilisateur confirme son action
            dataAction: {}, //Stocke les données de l'action à exécuter
        },
        success: {
            message: "",
            state: false
        },
        error: {
            message: "",
            state: false
        },
        stateMenu: false
    },
    async mounted () {
        try{
            //on récupère les informations sur l'utilisateur
            const result = await axios.get("/api/me")
            if(result.data){
                this.user = result.data
            }

            //On récupère les informations sur la partie en cours si elle subsiste
            if(this.user.hasRunningGame){
                const resultGame = await axios.get("/api/mygame")
                this.ranking = resultGame.data.ranking
                this.myTeam.players = resultGame.data.players
                this.myTeam.name = resultGame.data.myTeam.name
                this.myTeam.image = resultGame.data.myTeam.image
                this.myTeam.id = resultGame.data.myTeam.team_id
                this.myTeam.cash = resultGame.data.myTeam.cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                this.recrutement = resultGame.data.playersFree
                this.calendar = resultGame.data.calendar
                this.findWeekOpponent()
                this.training = resultGame.data.training
            }

            //Si on recharge la page /play/team/:id, i lfaut  etre capable de récupérer les informations
            const decomposedURL = window.location.href.split('/')
            //Pas le choix de décomposer car cette page ne doit pas être confondue avec /play/team
            if(decomposedURL.length === 7 && decomposedURL[4] === "play" && decomposedURL[5] === "team" && decomposedURL[6].length > 0){
                const result = await axios.get("/api/team/" + decomposedURL[6])
                const team = this.ranking.find(c => c.team_id == decomposedURL[6])
                const obj = {
                    name: team.name,
                    image: team.image,
                    players: result.data
                }
                this.teamProfile = obj
            }
        }
        catch(error){
            if(window.location.href != "http://localhost:3000/#/"){
                this.$router.push('/')
            }
        }
    },
    methods: {
        toggleMenu(){
            this.stateMenu = !this.stateMenu
        },
        displaySuccess(message){
            this.success.message = message
            this.success.state = true
            setTimeout(() => {
                this.success.state = false
                this.success.message = ""
            }, 4000)
        },
        cancelAlert(){
            this.alert.displayDOMAlert = false
            this.error.state = false
        },
        confirmAlert(){
            let nameAction = this.alert.action
            let data = this.alert.dataAction
            this.alert.alertMessage = ""
            this.alert.displayDOMAlert = false
            this.alert.action = ""
            this.alert.dataAction = {}

            switch (nameAction){
                case 'delete-account':
                    this.deleteAccount()
                    break;
                case "delete-game":
                    this.deleteGame()
                    break;
                case "sell-player":
                    this.sellPlayer(data)
                    break;
                case "delete-training":
                    this.deleteTraining(data)
                    break;    
            }
        },
        displayAlert(message, action, data){
            this.alert.alertMessage = message
            this.alert.displayDOMAlert = true
            this.alert.action = action
            if (data)
                this.alert.dataAction = data
        },
        errorMessage(error){
            if (error) {
                this.error.message = error
                this.error.state = true
            }
        },
        checkConnection(){
            if(this.user.id && this.user.id > 0){
                return true
            }
            return false
        },
        findWeekOpponent(){
            const week = this.calendar.filter(w => w.done === false)
            const match = week[0].matchs.find(c => c.team_dom_id === this.myTeam.id || c.team_ext_id === this.myTeam.id)
            let opponentId = 0
            if(match.team_dom_id === this.myTeam.id){
                opponentId = match.team_ext_id
            } else if(match.team_ext_id === this.myTeam.id) {
                opponentId = match.team_dom_id
            }

            const opponent = this.ranking.find(c => c.team_id === opponentId)
            this.weekOpponent = opponent.name
        },
        displayWeekOpponent(){
            const voyelles = ["a",'e','i','o','u','y']
            if(voyelles.indexOf(this.weekOpponent[0]) != -1){
                return "l'" + this.weekOpponent
            } else {
                return this.weekOpponent
            }
        },
        async registration(user){
            try {
                await axios.post('/api/registration', user)
                this.$router.push('/login')
                this.displaySuccess("Inscription réussie")
            }
            catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }
            }   
        },
        async login(user){
            try {
                const result = await axios.post('/api/login', user)
                this.user = result.data
                if(this.user.hasRunningGame){
                    const resultGame = await axios.get("/api/mygame")
                    this.ranking = resultGame.data.ranking
                    this.myTeam.players = resultGame.data.players
                    this.myTeam.id = resultGame.data.myTeam.team_id
                    this.myTeam.name = resultGame.data.myTeam.name
                    this.myTeam.image = resultGame.data.myTeam.image
                    this.myTeam.cash = resultGame.data.myTeam.cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    this.calendar = resultGame.data.calendar
                    this.recrutement = resultGame.data.playersFree
                    this.findWeekOpponent()
                    if(resultGame.data.training){
                        this.training = resultGame.data.training
                    }
                    this.$router.push('/play/')
                } else {
                    this.$router.push('/team/create')
                }
                
                this.displaySuccess(`Bienvenue ${this.user.username}`)
            } 
            catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }
            }
        },
        async logout(){
            try {
                await axios.get("/api/logout")

                //On remet toutes les données à l'état initial
                this.user.id = 0
                this.user.email =""
                this.user.username = ""
                this.user.game = 0
                this.user.hasRunningGame = false
                this.ranking = []
                this.myTeam.name = ""
                this.myTeam.image = ""
                this.myTeam.players = []
                this.myTeam.id = 0
                this.myTeam.cash = "0"
                this.ranking = []
                this.recrutement =[]
                this.calendar = []
                this.weekOpponent = ""
                this.training=[]
                this.$router.push('/')
            } catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }            }
        },
        async editAccount(){
            try{
                await axios.post("/api/account/edit", this.user)
                this.displaySuccess(`Modifications effectuées avec succès`)
            } catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }            }
        },
        async editPassword(userPassword){
            try{
                await axios.post("/api/account/edit-password", userPassword)
                this.displaySuccess(`Modifications effectuées avec succès`)
                this.$router.push('/account')
            } catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }            }
        },
        async deleteAccount(){
            try{
                await axios.delete("/api/account/delete")
                this.displaySuccess(`Suppression réussie. A la prochaine !`)
                this.$router.push('/')
                this.user.id = 0
                this.user.email =""
                this.user.username = ""
            } catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }            
            }
        },
        async createTeam(team){
            try{
                const result = await axios.post("/api/team/create", team)
                this.ranking = result.data.ranking
                this.myTeam.name = team.name
                this.myTeam.image = team.image
                this.myTeam.id = result.data.userTeam.team_id
                this.myTeam.cash = result.data.userTeam.cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                this.user.hasRunningGame = true
                this.calendar = result.data.calendar
                this.displaySuccess('Partie créée !')
                this.$router.push('/play')
            } catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }            
            }
        },
        async getClubProfile(idClub){
            if(idClub != this.myTeam.id){
                try{
                    const result = await axios.get("/api/team/" + idClub)
                    const team = this.ranking.find(c => c.team_id === idClub)
                    const obj = {
                        name: team.name,
                        image: team.image,
                        players: result.data
                    }
                    this.teamProfile = obj
                    this.$router.push('/play/team/'+idClub)
                } catch(error){
                    if(error.response){
                        this.errorMessage(error.response.data.message)
                    }
                }
            }
        },
        async editTeam(team){
            try{
                await axios.post("/api/team/edit", team)
                this.myTeam.name = team.name
                this.myTeam.image = team.image
                const idTeamInRanking = this.ranking.map(e => e.team_id).indexOf(team.id)
                this.ranking[idTeamInRanking].name = team.name
                this.ranking[idTeamInRanking].image = team.image
                this.displaySuccess('Modification bien enregistrée !')
            } catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }
            }
        },
        async deleteGame(){
            try{
                await axios.delete("/api/game/delete")
                this.user.game = 0
                this.user.hasRunningGame = false
                this.ranking = []
                this.myPlayers = []
                this.myTeam.name = ""
                this.myTeam.image = ""
                this.myTeam.players = []
                this.myTeam.id = 0
                this.myTeam.cash = "0"
                this.user.hasRunningGame = false
                this.recrutement =[]
                this.calendar = []
                this.weekOpponent = ""
                this.$router.push('/')
                this.displaySuccess('La partie a bien été supprimée')
            } catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }
            }
        },
        async recrutementPage(){
            try{
                const result = await axios.get("api/recrutement")
                this.$router.push('/play/recrutement')
                this.recrutement = result.data
            } catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }
            }
        },
        async sellPlayer(idPlayer){
            try{
                const result = await axios.post("/api/player/sell", {idPlayer})
                var indexPlayer = this.myTeam.players.map(c => c.player_id).indexOf(idPlayer)
                this.myTeam.players.splice(indexPlayer, 1)
                this.myTeam.cash = result.data.cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                this.displaySuccess(`Joueur vendu à ${result.data.teamBuying[0].name}`)
                if(this.myTeam.players.length < 5){
                    this.weekOpponent = ""
                }
            }
            catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }
            }
        },
        async editPlayer(player){
            try{
                const result = await axios.post("/api/player/edit", player)
                this.myTeam.cash = result.data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                this.displaySuccess('Modification effectuée avec succès')
            } catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }
            }
        },
        async buyPlayer(player_id){
            try{
                const data = {player:player_id}
                const result = await axios.post("/api/player/buy", data)
                //on récupere le cash restant
                this.myTeam.cash = result.data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                //On supprime le joueur recruté dans les disponniblités du recrutement
                let indexPlayer = this.recrutement.map(c => c.player_id).indexOf(player_id)
                const player = this.recrutement.splice(indexPlayer, 1)
                //On ajoute le joueur dans l'équipe
                this.myTeam.players.push(player[0])
                this.displaySuccess(`${player[0].firstname} ${player[0].name} fait maintenant parti de l'équipe`)
            } catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }
            }
        },
        async createPlayer(player){
            try{
                const result = await axios.post("/api/player/create", player)
                this.displaySuccess(`${player.firstName} ${player.name} fait maintenant parti de l'équipe`)
                this.myTeam.cash = result.data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                this.myTeam.players.push(result.data.playerAdded[0])
                if(this.myTeam.players.length >= 5){
                    this.findWeekOpponent();
                }
            } catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }
            }
        },
        async simulation(){
            if(this.myTeam.players.length < 5){
                this.errorMessage("Vous n'avez pas assez de joueurs pour lancer ce match")
            }
            try{
                const result = await axios.get("/api/simulation")
                const resultGame = await axios.get("/api/mygame")
                this.ranking = resultGame.data.ranking
                this.myTeam.players = resultGame.data.players
                this.myTeam.name = resultGame.data.myTeam.name
                this.myTeam.image = resultGame.data.myTeam.image
                this.myTeam.id = resultGame.data.myTeam.team_id
                this.myTeam.cash = resultGame.data.myTeam.cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                this.recrutement = resultGame.data.playersFree
                this.calendar = resultGame.data.calendar
                this.findWeekOpponent()
                this.$router.push("/play")
            } catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }
            } 
        },
        async addTraining(training){
            console.log(training)
            try{
                const result = await axios.post("/api/training/create",training)
                console.log(result.data)
                this.training = result.data
                this.displaySuccess('Entrainement ajouté !')
            } catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }
            }
        },
        async deleteTraining(training_id){
            try{
                await axios.delete("/api/training/delete/" + training_id)
                let indexTraining = this.training.map(c => c.training_id).indexOf(training_id)
                this.training.splice(indexTraining, 1)
                this.displaySuccess('L\'entrainement a été supprimé !')
            } catch(error){
                if(error.response){
                    this.errorMessage(error.response.data.message)
                }
            }
        }
    }
})