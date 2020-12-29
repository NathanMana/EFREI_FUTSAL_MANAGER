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
        return
    }

    //On essaie de récupérer l'utilisateur
    const result = await client.query({
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email]
    })

    //Si pas d'utilisateur alors les identifiants sont incorrects
    if(result.rows.length === 0){
        res.status(401).json({message: "Identifiants incorrects"})
        return
    }

    const user = result.rows[0]
    const correspondingPassword = await bcrypt.compare(password, user.password)
    if(!correspondingPassword){
        res.status(401).json({message: "Identifiants incorrects"})
        return
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
        return
    }

    res.json(req.session.user);
})

/* DECONNEXION */
router.get('/logout', async (req, res) => {
    if(!req.session.user || !req.session.user.id){
        res.status(401).json({message: "Pas de compte connecté"})
        return
    }

    delete req.session.user
    res.json({message: "Success"});
})

/* MODIFICATION DU COMPTE */
router.post('/account/edit', async (req, res) => {

    if(!req.session.user || !req.session.user.id || req.session.user.id <= 0){
        res.status(403).json({message: "Accès non autorisé"})
        return
    }

    const email = req.body.email
    const username = req.body.username
    const id = req.body.id
    
    //On vérifie que l'utilisateur soit bien connecté
    if(!id || id <= 0 ){
        res.status(501).json({message: "Vous ne pouvez pas réaliser ça"})
        return
    }

    //On vérifie que ca ne soit pas nul
    if(!email || !username){
        res.status(401).json({message: "Les champs ne peuvent pas être vides"})
        return
    }

    //On applique les changements
    const result = await client.query({
        text: 'UPDATE users SET email = $1, username = $2 WHERE id = $3',
        values: [email, username, id]
    })

    //On met à jour l'objet user dans la session
    req.session.user.username = username
    req.session.user.email = email

    res.send("ok")
})

/* MODIFICATION DU MOT DE PASSE */
router.post('/account/edit-password', async (req, res) => {

    if(!req.session.user || !req.session.user.id || req.session.user.id <= 0){
        res.status(403).json({message: "Accès non autorisé"})
        return
    }

    const currentPassword = req.body.currentPassword
    const newPassword = req.body.newPassword
    const repeatNewPassword = req.body.repeatNewPassword
    
    //On vérifie que le nouveau mdp et la répétition soit égaux
    if(newPassword != repeatNewPassword){
        res.status(401).json({message: "Les mots de passes indiqués sont différents"})
        return
    }

    //On récupère le mot de passe de l'utilisateur pour vérifier si le mdp indiqué est conforme
    const result = await client.query({
        text: 'SELECT password FROM users WHERE id = $1',
        values: [req.session.user.id]
    })

    const correspondingPassword = await bcrypt.compare(currentPassword, result.rows[0].password)
    if(!correspondingPassword){
        res.status(401).json({message: "Le mot de passe indiqué est incorrect"})
        return
    }

    //On vérifie que le nouveau mot de passe respecte les conditions
    if(newPassword.length < 8 || !newPassword.match(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/g)){
        res.status(401).json({message: 'Le mot de passe ne remplit pas les critères de sécurité'})
        return
    }

    //On peut mettre à jour le mot de passe
    const hash = await bcrypt.hash(newPassword, 10)
    await client.query({
        text: 'UPDATE users SET password = $1 WHERE id = $2',
        values: [hash, req.session.user.id]
    })

    res.send("ok")
})

router.delete('/account/delete', async (req, res) => {
    if(!req.session.user || !req.session.user.id || req.session.user.id <= 0){
        res.status(403).json({message: "Accès non autorisé"})
        return
    }

    await client.query({
        text: 'DELETE FROM users WHERE id = $1',
        values: [req.session.user.id]
    })

    delete req.session.user

    res.send("ok")
})

module.exports = router
