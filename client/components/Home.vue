<template>
    <section id="home">
        <router-view 
            @registration = "registration"
            @login = "login"
            @create-team = "createTeam"
        >
        </router-view>
        <div class="left">
            <h1>EFREI Futsal Manager</h1>
            <p>En tant que manager de votre propre équipe, vous allez devoir trouver des joueurs, les créer ou les acheter. Faconnez votre propre identité, programmez vos entrainements et coachez vos matchs. Un seul objectif, terminer la saison à la première place du championnat !</p>
            <router-link v-if="!user.hasRunningGame" :to="urlStart()" style="font-size:2.4em;" class="btn">Commencer</router-link>
            </div>
            <div class="right">
            <div class="right-decor"></div>
        </div>
    </section>
</template>
<script>
    module.exports = {
        props: {
            user: Object
        },
        data () {
            return {
                urlStart(){
                    if(this.user.id){
                        return "/team/create"
                    } else  {
                        return "/login"
                    }
                }
            } 
        },
        methods: {
            login(user){
                this.$emit('login', user)
            },
            registration(user){
                this.$emit('registration', user)
            },
            createTeam(team){
                this.$emit('create-team', team)
            }
        }
    }
</script>
<style scoped>
    /* HOME */
    section#home {
        display: flex;
        align-items: center;
        height: calc(100vh - 87px);;
        width: 100%;
    }
    .left {
        padding: 10px;
        margin: 50px;
        float: left;
        display: block;
        width: 50%;
        min-width: 500px;
        z-index: 5;
    }

    .left h1 {
        font-size: 4em;
        text-align: center;
        color: #fff;
        width: 100%;
    }

    .left p {
        margin: 50px 0;
        font-size: 1.4em;
        font-weight: 400;
    }

    .left a {
        display: block;
        margin: 0 auto;
    }

    .right {
        z-index: 2;
        position: relative;
        height: 100%;
        width: 60%;
        margin-left: -10%;
        display: block;
        background: center / cover no-repeat url(../images/frontend/home.png);
    }

    .right::before {
        z-index: 3;
        display: block;
        width: 0;
        border-top: 100vh solid var(--blue_dark);
        border-right: 440px solid transparent;
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
    }

    .right::after {
        z-index: 3;
        display: block;
        width: 70px;
        height: 300px;
        background: var(--blue_dark);
        transform: skewX(-20deg);
        content: "";
        position: absolute;
        left: 20px;
        bottom: 0;
    }

    .right-decor {
        width: 100%;
        height: 100%;
        background: center / cover no-repeat url(../images/frontend/decor_home.png);
        display: block;
        position: relative;
        z-index: 4;
    }
</style>