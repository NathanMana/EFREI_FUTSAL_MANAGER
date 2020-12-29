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
const CreatePlayer = window.httpVueLoader('./components/Team/_CreatePlayer.vue')
const EditPlayer = window.httpVueLoader('./components/Team/_EditPlayer.vue')
const Team = window.httpVueLoader('./components/Team/Team.vue')
const EditTeam = window.httpVueLoader('./components/Team/_EditTeam.vue')
const Training = window.httpVueLoader('./components/Team/Training.vue')


const children = [
    {
        path: '/team/create',
        component: CreateTeam
    },
    {
        path: '/play/simulation',
        component: Simulation
    },
    {
        path: '/play/recrutement/create',
        component: CreatePlayer
    },
    {
        path: '/play/team/player/edit/:id',
        component: EditPlayer
    },
    {
        path: '/play/team/edit',
        component: EditTeam
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
        ]
    },
    { 
        path: '/account', 
        component: Account, 
        children: [
            {
                path: 'login',
                component: Login
            },
            {
                path: 'registration',
                component: Registration
            }, 
        ]
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
        component: Recrutement, 
        children
    },
    { 
        path: '/play/training', 
        component: Training, 
        children
    },
    { 
        path: '/play/team', 
        component: Team, 
        children
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
            email: ""
        },
        displayDOMAlert: false,
        alertMessage: "",
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
            const result = await axios.get("/api/me")
            if(result.data){
                this.user = result.data
            }
        }
        catch(error){
            console.log(error.response.data.message)
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
            }, 7000)
        },
        cancelAlert(){
            this.displayDOMAlert = false
            this.error.state = false
        },
        displayAlert(message){
            this.alertMessage = message
            this.displayDOMAlert = true
        },
        async registration(user){
            try {
                await axios.post('/api/registration', user)
                this.$router.push('/login')
                this.displaySuccess("Inscription réussie")
            }
            catch(error){
                if (error.response) {
                    this.error.message = error.response.data.message
                    this.error.state = true
                }
            }   
        },
        async login(user){
            try {
                const result = await axios.post('/api/login', user)
                this.user = result.data
                this.$router.push('/')
                this.displaySuccess(`Bienvenue ${this.user.username}`)
            } 
            catch(error){
                if (error.response) {
                    this.error.message = error.response.data.message
                    this.error.state = true
                }
            }
        },
        async logout(){
            try {
                await axios.get("/api/logout")
                this.user.id = 0
                this.user.email =""
                this.user.username = ""
            } catch(error){
                if (error.response) {
                    this.error.message = error.response.data.message
                    this.error.state = true
                }
            }
        }
    }
})