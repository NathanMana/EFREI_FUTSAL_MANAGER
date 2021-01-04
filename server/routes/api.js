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
        username: user.username,
        hasRunningGame: false
    }

    // Ensuite, on vérifie si l'utilisateur à une partie en cours
    const resultGame = await client.query({
        text: 'SELECT * FROM games WHERE user_id = $1',
        values: [user.id]
    })

    if(resultGame.rows[0]){
        req.session.user.hasRunningGame = true
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

    //On veut savoir si une partie est en cours
    const resultGame = await client.query({
        text: 'SELECT * FROM games WHERE user_id = $1',
        values: [req.session.user.id]
    })

    if(resultGame.rows[0]){
        req.session.user.hasRunningGame = true
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

/* CREATION D UNE EQUIPE ET DONC DE LA PARTIE */
router.post('/team/create', async (req, res) => {
    if(!req.session.user || !req.session.user.id || req.session.user.id <= 0){
        res.status(403).json({message: "Accès non autorisé"})
        return
    }

    const name = req.body.name
    const logo = req.body.image
    if(!name || !req.body.difficulty){
        res.status(401).json({message: "Le formulaire est mal rempli"})
        return
    }

    //On doit d'abord créer la partie
    await client.query({
        text: 'INSERT INTO games(user_id) VALUES ($1)',
        values: [req.session.user.id]
    })

    //Il faut récupérer l'id de la partie créée
    const result = await client.query({
        text: 'SELECT game_id FROM games WHERE user_id = $1',
        values: [req.session.user.id]
    })

    if(!result.rows[0]){
        res.status(500)
        return
    }
    req.session.user.game = result.rows[0].game_id;

    let cash = 0
    switch(req.body.difficulty){
        case "0":
            cash = 50000000
            break
        case "1":
            cash = 40000000
            break
        case "2":
            cash = 30000000
            break
    }

    //On peut créer l'équipe
    await client.query({
        text: 'INSERT INTO teams(name, image, cash, "isControlledByUser", points, game_id) VALUES ($1,$2,$3,$4,0,$5)',
        values: [name, logo, cash, true, req.session.user.game]
    })

    //Ensuite il faut ajouter les autres équipes de manière aléatoire (controllées par l'IA)
    //On doit d'abord en sélectionner dans la table modele
    const listRandomTeams = await client.query({
        text: 'SELECT * FROM team_models ORDER BY RANDOM() LIMIT 9'
    })

    //Puis les ajouter dans la table teams
    listRandomTeams.rows.forEach(async (team) => {
        await client.query({
            text: 'INSERT INTO teams(name, image, cash, "isControlledByUser", points, game_id) VALUES ($1,$2,$3,$4,0,$5)',
            values: [team.name, team.image, 0, false, req.session.user.game]
        })
    })

    //Il faut ensuite sélectionner les joueurs (on les distribue dans les équipes aléatoirement).
    //Pour ca on doit récupérer les id des équipes controlées par l'IA
    //Au passage on va récupérer également ici l'équipe de l'utilisateur, car on va le retourner en résultat, on va donc faire une requete au lieu de 2
    const listTeams = await client.query({
        text: 'SELECT team_id, "isControlledByUser", cash FROM teams WHERE game_id = $1',
        values: [req.session.user.game]
    })

    //On récupère l'quipe de l'utilisateur
    const userTeamIndex = listTeams.rows.map(c => c.isControlledByUser).indexOf(true);
    const userTeam = listTeams.rows.splice(userTeamIndex, 1)

    //On récupère ensuite les gardiens et les joueurs dans la table modèle "players_models"
    const goalKeepers = await client.query({
        text: 'SELECT * FROM player_models WHERE role = 1 ORDER BY RANDOM()'
    })

    const players = await client.query({
        text: 'SELECT * FROM player_models WHERE role = 2 ORDER BY RANDOM()'
    })

    //On en réparti dans chaque équipe hormis l'équipe de l'utilisateur
    listTeams.rows.forEach(async team => {
        let listPlayer = []
        //Il faut sélectionner un gardien et 4 joueurs (aléatoirement)
        const randomNumberForKeeper = randomInt(goalKeepers.rows.length)
        const goalkeeper = goalKeepers.rows.splice(randomNumberForKeeper, 1)
        listPlayer.push(goalkeeper[0])
        //On le supprime du tableau (pour ne pas qu'il puisse etre  dans une autre équipe)
        //Et on fait la meme chose pour 4 joueurs
        for(let i=0; i < 4; i++){
            const randomNumberForPlayer = randomInt(players.rows.length)
            const player = players.rows.splice(randomNumberForPlayer, 1)
            listPlayer.push(player[0])
        }

        //On les ajoute a la table player
        listPlayer.forEach(async player => {
            await client.query({
                text: 'INSERT INTO players(name, firstname, age, role, image, endurance, energie, grade, team_id, game_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
                values: [player.name, player.firstname, player.age, player.role, player.image, player.endurance, 100, player.grade, team.team_id, req.session.user.game]
            })
        })
    })

    //On ajoute les joueurs qui reste en free agent
    goalKeepers.rows.forEach(async goalKeeper => {
        await client.query({
            text: 'INSERT INTO players(name, firstname, age, role, image, endurance, energie, grade, team_id, game_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, null, $9)',
            values: [goalKeeper.name, goalKeeper.firstname, goalKeeper.age, goalKeeper.role, goalKeeper.image, goalKeeper.endurance, 100, goalKeeper.grade, req.session.user.game]
        })
    })

    players.rows.forEach(async player => {
        const endurance = randomInt(6) //Temporaire
        await client.query({
            text: 'INSERT INTO players(name, firstname, age, role, image, endurance, energie, grade, team_id, game_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, null, $9)',
            values: [player.name, player.firstname, player.age, player.role, player.image, endurance, 100, player.grade, req.session.user.game]
        })
    })

    //On récupère toutes les équipes pour pouvoir renvoyer le classement
    const rankingData = await client.query({
        text: 'SELECT * FROM teams WHERE game_id = $1 ORDER BY points ASC',
        values: [req.session.user.game]
    })

    //On envoie les données
    let ranking= formateData(rankingData)

    res.json({ranking, userTeam: userTeam[0]})

    function randomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
})

/* RECUPERER DES INFORMATIONS SUR LA PARTIE EN COURS */
//On récupère le classement (docn toutes les équipes)
//Les joueurs de notre équipe
router.get("/mygame", async (req,res) => {
    if(!req.session.user || !req.session.user.id || req.session.user.id <= 0){
        res.status(403).json({message: "Accès non autorisé"})
        return
    }

    // On récupère la partie
    const game = await client.query({
        text: "SELECT game_id FROM games WHERE user_id = $1",
        values: [req.session.user.id]
    })

    if(game.rowCount === 0){
        res.status(401).json({message: "Il n'y a pas de partie en cours"})
        return
    }
    req.session.user.game = game.rows[0].game_id

    //On récupère le classement
    const rankingData = await client.query({
        text: 'SELECT * FROM teams WHERE game_id = $1 ORDER BY points ASC',
        values: [req.session.user.game]
    })
    const ranking = formateData(rankingData)

    //On récupère l'équipe de l'utilisateur
    const myTeam = ranking.find(c => c.isControlledByUser === true)

    //On récupère les joueurs
    const playersData = await client.query({
        text: 'SELECT * FROM players WHERE team_id = $1 ORDER BY energie DESC',
        values: [myTeam.team_id]
    })
    const players = formateData(playersData)

    const data = {
        ranking,
        myTeam,
        players
    }

    res.json(data)
})

/* Profil d'un club */
router.get('/team/:idTeam', async (req,res) => {
    if(!req.session.user || !req.session.user.id || req.session.user.id <= 0){
        res.status(403).json({message: "Accès non autorisé"})
        return
    }

    const idTeam = req.params.idTeam
    
    //On va récupérer les joueurs de l'équipe
    const resultPlayers = await client.query({
        text: "SELECT * FROM players WHERE team_id = $1",
        values: [idTeam]
    })

    res.json(formateData(resultPlayers))

})

/* RECRUTEMENT */
router.get("/recrutement", async (req,res) => {
    if(!req.session.user || !req.session.user.id || req.session.user.id <= 0){
        res.status(403).json({message: "Accès non autorisé"})
        return
    }
    const players = await client.query({
        text: 'SELECT * FROM players WHERE team_id IS NULL',
    })
    console.log(formateData(players))
    res.json(formateData(players))
})

/* Modifier le nom ou l'image de notre équipe */
router.post('/team/edit', async (req,res) => {
    if(!req.session.user || !req.session.user.id || req.session.user.id <= 0){
        res.status(403).json({message: "Accès non autorisé"})
        return
    }

    const idTeam = req.body.id
    const name = req.body.name
    const image = req.body.image

    if(!name){
        res.status(401).json({message: "Le nom ne peut pas être vide"})
        return
    }

    await client.query({
        text:"UPDATE teams SET name = $1, image = $2 WHERE team_id = $3",
        values: [name, image, idTeam]
    })

    res.json('ok')
})

/* SUPPRESSION DE LA PARTIE */
//Supprime toutes les données d'une partie (équipes, joueurs, etc)
router.delete("/game/delete", async (req,res) => {
    if(!req.session.user || !req.session.user.id || req.session.user.id <= 0){
        res.status(403).json({message: "Accès non autorisé"})
        return
    }

    //On a juste a supprimer la partie et toutes les données liées dans les autres tables seront supprimées car nous avons sélectionné le onDelete = Cascade
    await client.query({
        text: "DELETE FROM games WHERE game_id = $1",
        values: [req.session.user.game]
    })

    res.send("ok")
})

/* VENDRE UN JOUEUR */
router.post("/player/sell", async (req,res) => {
    if(!req.session.user || !req.session.user.id || req.session.user.id <= 0){
        res.status(403).json({message: "Accès non autorisé"})
        return
    }

    const idPlayer = req.body.idPlayer

    //On récupère le joueur pour calculer sa valeur
    let player = client.query({
        text: "SELECT * FROM players WHERE player_id = $1",
        values: [idPlayer]
    })

    player = player.rows[0]
    
    //On vend un joueur à une autre équipe, pour cela on va simplement sélectionner une équipe au hasard et changer le joueur d'équipe
    const teamBuying = await client.query({
        text: "SELECT team_id,name FROM teams ORDER BY RANDOM() LIMIT 1"
    })

    //On change le joueur d'équipe
    await client.query({
        text: "UPDATE players SET team_id = $1 WHERE player_id = $2",
        values: [teamBuying.rows[0].team_id, idPlayer]
    })

    //On donne la somme d'argent à l'équipe de l'utilisateur
    //On sélectionne l'équipe pour ajouter de l'argent au compte en banque
    const team = await client.query({
        text: 'SELECT cash FROM teams WHERE "isControlledByUser" = true',
    })

    let cost = team.rows[0].cash + player.endurance*2000000 + player.grade*10000000 - player.age*500000
    await client.query({
        text: 'UPDATE teams SET cash = $1 WHERE "isControlledByUser" = true',
        values: [cost]
    })

    res.json(formateData(teamBuying))

})

/* EDITION D UN JOUEUR */
//Si on modifie simplement le nom il n'y a pas de complication, en revanche, si on modifie la note par exemple, il va falloir payer
router.post("/player/edit", async (req, res) => {
    if(!req.session.user || !req.session.user.id || req.session.user.id <= 0){
        res.status(403).json({message: "Accès non autorisé"})
        return
    }

    const { id, grade, endurance, team_id} = req.body
    
    //On sélectionne le joueur en BDD
    const playerResult = await client.query({
        text: "SELECT * FROM players WHERE player_id = $1",
        values: [id]
    })

    const player = playerResult.rows[0]

    //On calcule les retombés ou le cout du changement
    let cost = 0
    if(endurance < player.endurance){
        //On réduit l'endurance, donc on gagne de l'argent
        cost = (player.endurance - endurance)*2000000
    } else {
        //Sinon on en perd
        cost = -(player.endurance - endurance)*2000000
    }

    if(grade < player.grade){
        //On réduit la note générale, donc on gagne de l'argent
        cost += (player.grade - grade)*10000000
    } else {
        //Sinon on en perd
        cost += -(player.grade - grade)*10000000
    }

    //On modifie le cash de l'équipe
    const team = await client.query({
        text: "SELECT * FROM teams WHERE team_id = $1",
        values: [team_id]
    })

    const cash = team.rows[0].cash + cost
    if(cash < 0){
        //L'utilisateur n'a pas assez d'argent pour effectuer cette action
        res.status(401).json({message: "Vous n'avez pas assez d'argent pour effectuer cette action"})
        return
    }

    await client.query({
        text: "UPDATE teams SET cash = $1 WHERE team_id = $2",
        values: [cash, team_id]
    })

    //Dans tous les cas on modifie le joueur
    await client.query({
        text: "UPDATE players SET grade = $3, endurance = $4"
    })

    res.send('ok')
})

//fonction pour envoyer correctement les données (sans rows notamment)
function formateData(data){
    let tabData = []
    data.rows.forEach(item => {
        tabData.push(item)
    })

    return tabData
}

module.exports = router


