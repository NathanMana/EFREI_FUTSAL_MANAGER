const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { Client } = require('pg')

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'root',
    database: 'EFREI_FUTSAL_MANAGER'
})

client.connect()

/* API EFREI FUTSAL MANAGER */

/*  INSCRIPTION */
router.post('/registration', async (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let username = req.body.username

    if(!email || !password  || !username){
        res.status(401).json({message: 'Problème dans le formulaire'})
        return
    }

    const result = await client.query({
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email]
    })

    if(result.rows.length > 0){
        res.status(401).json({message: 'Cette adresse email existe déjà dans notre base de données'})
        return
    }

    if(password.length < 8 || !password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/g)){
        res.status(401).json({message: 'Le mot de passe ne remplit pas les critères de sécurité'})
        return
    }

    let role = "ROLE_USER"
    const hash = await bcrypt.hash(password, 10)

    //Insertion de l'utilisateur en BDD
    await client.query({
        text: 'INSERT INTO users (email, username, role, password) VALUES ($1, $2, $3, $4)',
        values: [email, username, role, hash]
    })

    res.send('Insertion réussie')  
})


/* CONNEXION */
router.post('/login', async (req,res) => {
    const email = req.body.email
    const password = req.body.password

    //On vérifie si l'email ou le mdp ne sont pas nuls
    if(!email || !password){
        res.status(401).json({message: "Problème dans le formulaire"})
    }

    //On essaie de récupérer l'utilisateur
    const result = await client.query({
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email]
    })

    //Si pas d'utilisateur alors les identifiants sont incorrects
    if(result.rows.length === 0){
        res.status(401).json({message: "Identifiants incorrects"})
    }

    const user = result.rows[0]
    const correspondingPassword = await bcrypt.compare(password, user.password)
    if(!correspondingPassword){
        res.status(401).json({message: "Identifiants incorrects"})
    }

    req.session.user = {
        id: user.id,
        email: user.email,
        username: user.username
    }

    res.json(req.session.user);
})

/* ME */
//Permet de récupérer l'utilisateur connecté, ainsi, en rechargeant la page on ne perd pas la session et les données de l'utilisateur connecté
router.get('/me', async (req, res) => {
    if(!req.session.user || !req.session.user.id){
        res.status(401).json({message: "Pas connecté"})
    }

    res.json(req.session.user);
})

/* DECONNEXION */
router.get('/logout', async (req, res) => {
    if(!req.session.user || !req.session.user.id){
        res.status(401).json({message: "Pas de compte connecté"})
    }

    delete req.session.user
    res.json({message: "Success"});
})

module.exports = router
