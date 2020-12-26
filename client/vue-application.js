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
        displayDOMAlert: false,
        alertMessage: "",
    },
    async mounted () {
    },
    methods: {
        cancelAlert(){
            this.displayDOMAlert = false
        },
        displayAlert(message){
            this.alertMessage = message
            this.displayDOMAlert = true
        },
        async registration(user){
            console.log("user", user)
            console.log("Jello");
            try {
                await axios.post('/api/registration', user)
                console.log("ok")
            }
            catch(error){
                if (error.response) {
                    console.log(error.response.data.error);
                }
            }   
        }
    }
})