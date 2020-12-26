<template>
    <section class="overlay" id="simulation">
         <article>
            <div class="article__title">
                <h2>Simulation de la semaine</h2>
            </div>
            <div class="simulation-element">
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere adipisci deserunt doloribus cupiditate tempore dolore non quo eaque dolorem omnis illo doloremque nisi magni dolor, est eius repellat natus! Eaque?</p>
            </div>
            <a href="" style="margin: 0 auto;" v-on:click="redirection" class="btn">Fermer</a>
        </article>
    </section>
</template>

<script>
    module.exports = {
        data () {
            return {
            }
        },
        methods: {
            redirection(){
                router.back()
            }
        }
    }
</script>
<style scoped>
    #simulation article {
        min-width: 90%;
    }

    .simulation-element {
        width: 80%;
        display: block;
        margin: 20px auto;
    }

    .simulation-element p {      
        font-weight: 300;
    }
</style>