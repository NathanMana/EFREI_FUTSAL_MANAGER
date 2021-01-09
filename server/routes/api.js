const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { Client } = require('pg')

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'allforone187=ken',
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
        req.session.user.game = resultGame.rows[0].game_id
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

    //On récupère l'équipe de l'utilisateur
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

    let ranking= formateData(rankingData)

    //On doit faire la simulation du calendrier
    //D'abord il faut créer les semaines (il y a 10 équipes donc 9 matchs soit 9 semaines à créer (1 match / semaine))
    for(let i = 0; i < 9; i++){
        await client.query({
            text: "INSERT INTO weeks(done, game_id) VALUES (false, $1)",
            values: [req.session.user.game]
        })
    }

    //Ensuite on récupère les semaines pour programmer les matchs
    const weeksData = await client.query({
        text: "SELECT * FROM weeks WHERE game_id = $1",
        values: [req.session.user.game]
    })

    const weeks = formateData(weeksData) // On récupère les semaines de compétition

    /* La suite de ce code a été forteement inspiré par un post sur StackOverflow - gestion d'algorithme de tournoi */
    const nberTeams = ranking.length;
    const half = nberTeams / 2; // La moitié de l'équipe
    const calendar = [];  // Tableau qui va stocker l'ensemble des matchs de toutes les semaines
    const teamsIndexes = ranking.map((_, i) => i).slice(1); // On  sauvegarde les indexes dans un ordre donné que l'on va faire varier

    weeks.forEach( week => {

        const matchWeeks = []; //Va stocker les matchs d'un week-end
        const newTeamIndexes = [0].concat(teamsIndexes); // La premiere équipe sera toujours à domicile, mais on s'en fiche

        const firstHalf = newTeamIndexes.slice(0, half); //On va faire varier la premiere ligne avec la seconde, et prendre les données sous forme de colonne
        const secondHalf = newTeamIndexes.slice(half, nberTeams).reverse();

        for (let i = 0; i < firstHalf.length; i++) {
            matchWeeks.push({
                week_id: week.week_id,
                team_dom: ranking[firstHalf[i]].team_id,
                team_ext: ranking[secondHalf[i]].team_id,
            });
        }

        // On place le dernier index a la premiere position
        teamsIndexes.push(teamsIndexes.shift());
        calendar.push(matchWeeks);
    })
    
    calendar.forEach(week => {
        week.forEach(async match => {
            //on insère le match en BDD
            await client.query({
                text: "INSERT INTO matchs (team_dom_id, team_ext_id, week_id) VALUES ($1,$2,$3)",
                values: [match.team_dom, match.team_ext, match.week_id]
            })
        })
    })

    //Il faut récupérer le calendrier et bien le formater
    //on récupere le calendrier du championnat
    //Pour cela il faut récupérer les semaines de championnat
    const weeksData2 = await client.query({
        text: "SELECT * FROM weeks WHERE game_id = $1 ORDER BY week_id ASC",
        values: [req.session.user.game]
    })
    const weeks2 = formateData(weeksData2)
    let calendarToSend = []
    //On utilise la boucle for que performe les promesses
    for(let i = 0; i < weeks2.length; i++){
        const weekData3 = await client.query({
            text: 'SELECT * FROM matchs WHERE week_id = $1 ORDER BY week_id ASC',
            values: [weeks2[i].week_id]
        })
        const weekResult = formateData(weekData3)
        calendarToSend.push({
            week_id: weeks2[i].week_id,
            done: weeks2[i].done,
            matchs: weekResult
        })
    }

    res.json({ranking, userTeam: userTeam[0], calendar: calendarToSend})

    function randomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
})

/* RECUPERER DES INFORMATIONS SUR LA PARTIE EN COURS */
//On récupère le classement (docn toutes les équipes)
//Les joueurs de notre équipe
//Le contenu de la page recrutement
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
        text: 'SELECT * FROM teams WHERE game_id = $1 ORDER BY points DESC',
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

    //On récupere les joueurs sans équipe
    const playersFreeData = await client.query({
        text: 'SELECT * FROM players WHERE team_id IS NULL'
    })
    const playersFree = formateData(playersFreeData)

    //on récupere le calendrier du championnat
    //Pour cela il faut récupérer les semaines de championnat
    const weeksData = await client.query({
        text: "SELECT * FROM weeks WHERE game_id = $1 ORDER BY week_id ASC",
        values: [req.session.user.game]
    })
    const weeks = formateData(weeksData)
    let calendar = []
    //On utilise la boucle for que performe les promesses
    for(let i = 0; i < weeks.length; i++){
        const weekData = await client.query({
            text: 'SELECT * FROM matchs WHERE week_id = $1 ORDER BY week_id ASC',
            values: [weeks[i].week_id]
        })
        const weekResult = formateData(weekData)
        calendar.push({
            week_id: weeks[i].week_id,
            done: weeks[i].done,
            matchs: weekResult
        })
    }

    const data = {
        ranking,
        myTeam,
        players,
        playersFree,
        calendar
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
    let playerResult = await client.query({
        text: "SELECT * FROM players WHERE player_id = $1",
        values: [idPlayer]
    })

    const player = playerResult.rows[0]
    
    //On vend un joueur à une autre équipe, pour cela on va simplement sélectionner une équipe au hasard et changer le joueur d'équipe
    const teamBuying = await client.query({
        text: 'SELECT team_id,name FROM teams WHERE "isControlledByUser" = false ORDER BY RANDOM() LIMIT 1'
    })

    //On change le joueur d'équipe
    await client.query({
        text: 'UPDATE players SET team_id = $1 WHERE player_id = $2',
        values: [teamBuying.rows[0].team_id, idPlayer]
    })

    //On donne la somme d'argent à l'équipe de l'utilisateur
    //On sélectionne l'équipe pour ajouter de l'argent au compte en banque
    const team = await client.query({
        text: 'SELECT cash FROM teams WHERE "isControlledByUser" = true AND game_id = $1',
        values: [req.session.user.game]
    })
    let cost = parseFloat(team.rows[0].cash) + (parseFloat(player.endurance)*2000000 + parseFloat(player.grade)*10000000 - parseInt(player.age)*500000)
    await client.query({
        text: 'UPDATE teams SET cash = $1 WHERE "isControlledByUser" = true',
        values: [cost]
    })

    res.json({teamBuying: formateData(teamBuying), cash: cost})

})

/* EDITION D UN JOUEUR */
//Si on modifie simplement le nom il n'y a pas de complication, en revanche, si on modifie la note par exemple, il va falloir payer
router.post("/player/edit", async (req, res) => {
    if(!req.session.user || !req.session.user.id || req.session.user.id <= 0){
        res.status(403).json({message: "Accès non autorisé"})
        return
    }

    const { player_id, grade, endurance, team_id, role} = req.body
    
    //On sélectionne le joueur en BDD
    const playerResult = await client.query({
        text: "SELECT * FROM players WHERE player_id = $1",
        values: [player_id]
    })

    const player = playerResult.rows[0]

    //On calcule les retombés ou le cout du changement
    let cost = (parseFloat(player.endurance) - endurance)*2000000 + (parseFloat(player.grade) - grade)*10000000

    //On modifie le cash de l'équipe
    const team = await client.query({
        text: "SELECT * FROM teams WHERE team_id = $1",
        values: [team_id]
    })

    const cash = parseFloat(team.rows[0].cash) + cost
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
        text: "UPDATE players SET grade = $1, endurance = $2, role = $3",
        values: [grade, endurance, role]
    })

    res.json(cash)
})


//fonction de l'achat de joueur

router.post("/player/buy", async (req,res)=>{
    if(!req.session.user || !req.session.user.id || req.session.user.id <= 0){
        res.status(403).json({message: "Accès non autorisé"})
        return
    }
    const id_player = req.body.player
    const team = await client.query({
        text: 'SELECT * FROM teams WHERE "isControlledByUser" = true AND game_id=$1',
        values:[req.session.user.game]
    })
    //On change l'équipe du joueur qu'on vient d'acheter
    await client.query({
        text: "UPDATE players SET team_id=$1 WHERE player_id = $2",
        values:[team.rows[0].team_id, id_player]
    })
    //On récupère le joueur qu'on veut acheter
    const player_result = await client.query({
        text: "SELECT * FROM players WHERE player_id = $1",
        values:[id_player]
    })
    const player = player_result.rows[0]
    //Calcul nouveau prix de notre équipe
    let price = team.rows[0].cash - (player.endurance * 2000000 + player.grade * 10000000 - player.age * 500000)
    if (price < 0){
        res.status(401).json({message:"Vous n'avez pas assez d'argent"})
        return
    }
    await client.query({
        text: "UPDATE teams SET cash=$1 WHERE team_id = $2",
        values:[price, team.rows[0].team_id]
    })
    res.json(price)
})

//fonction pour créer un joueur

router.post("/player/create", async (req,res)=>{
    if(!req.session.user || !req.session.user.id || req.session.user.id <= 0){
        res.status(403).json({message: "Accès non autorisé"})
        return
    }
    const { name,firstName,age,poste,endurance,note } = req.body
    const team = await client.query({
        text: 'SELECT * FROM teams WHERE "isControlledByUser" = true AND game_id=$1',
        values:[req.session.user.game]
    })
    //Calcul nouveau prix de notre équipe
    let price = parseFloat(team.rows[0].cash) - (parseFloat(endurance) * 2000000 + parseFloat(note) * 10000000 - parseInt(age) * 500000)
    if (price < 0){
        res.status(401).json({message:"Vous n'avez pas assez d'argent pour créer ce joueur"})
        return
    }
    //On ajoute notre nouveau joueur à notre équipe
    await client.query({
        text: "INSERT INTO players(name,firstname,age,role,endurance,grade,team_id, game_id, energie) VALUES($1,$2,$3,$4,$5,$6,$7,$8,100)",
        values:[name,firstName,age,poste,endurance,note , team.rows[0].team_id, req.session.user.game]
    })
    //On récupère l'objet du joueur créé
    const player = await client.query({
        text: "SELECT * FROM players WHERE name = $1 AND firstname = $2 AND age = $3 AND role = $4 AND endurance = $5 AND grade =$6 AND team_id = $7 AND game_id = $8 AND energie = $9",
        values:[name,firstName,age,poste,endurance,note , team.rows[0].team_id, req.session.user.game, 100]
    })
    await client.query({
        text: "UPDATE teams SET cash=$1 WHERE team_id = $2",
        values:[price, team.rows[0].team_id]
    })
    res.json({price, playerAdded: formateData(player)})
})

//fonction pour ajouter un entrainement
router.post("/training/create", async (req, res) => {
    const {day, name} = req.body
    //Récupérer la semaine en cours
    const weekSimulatingData = await client.query({
        text: "SELECT * FROM weeks WHERE done = false ORDER BY week_id ASC LIMIT 1"
    })
    const weekSimulating = formateData(weekSimulatingData)
    
    const trainingData = await client.query({
        text: "SELECT * FROM trainings WHERE week_id = $1 ORDER BY day asc",
        values: [weekSimulating[0].week_id]
    })
    let training = formateData(trainingData)
    const index = training.map(t => t.day).indexOf(parseInt(day))
    if(index != -1){
        res.status(401).json({
            message:"Un entrainement est déjà prévu pour ce jour, veuillez le supprimer si vous voulez le modifier"
        })
        return
    }
    //On ajoute l'entrainement en BDD
    await client.query({
        text: "INSERT INTO trainings(day, week_id,name) VALUES ($1,$2,$3)",
        values: [day, weekSimulating[0].week_id, name]
    })
    const trainingInsertedData = await client.query({
        text: "SELECT * FROM trainings WHERE week_id = $1 AND day = $2 ",
        values: [weekSimulating[0].week_id,day]
    })
    training.push(trainingInsertedData.rows[0])
    training.sort((a,b)=>a.day-b.day)
    res.json(training)
})


/* SIMULATION */
router.get('/simulation', async (req, res) => {
    if(!req.session.user || !req.session.user.id || req.session.user.id <= 0){
        res.status(403).json({message: "Accès non autorisé"})
        return
    }

    
    //On vérifie si l'équipe du joueur a assez de joueurs
    const teamUserData = await client.query({
        text: 'SELECT * FROM teams WHERE "isControlledByUser" = true AND game_id = $1',
        values: [req.session.user.game]
    })
    const teamUser = formateData(teamUserData)

    const playersOfUserTeam = await client.query({
        text: 'SELECT * FROM players WHERE team_id = $1',
        values: [teamUser[0].team_id]
    })

    if(playersOfUserTeam.rowCount < 5){
        res.status(401).json({message: "Vous n'avez pas assez de joueurs"})
        return
    }

    //Récupérer la semaine en cours
    const weekSimulatingData = await client.query({
        text: "SELECT * FROM weeks WHERE done = false ORDER BY week_id ASC LIMIT 1"
    })
    const weekSimulating = formateData(weekSimulatingData)

    //Ensuite on récupère chaque match de la semaine à simuler
    const matchsData = await client.query({
        text: "SELECT * FROM matchs WHERE week_id = $1",
        values: [weekSimulating[0].week_id]
    })
    const matchs = formateData(matchsData)
    console.log(matchs)

    for(let i = 0; i < matchs.length; i++){
        const match = matchs[i]
        //Il faut récupérer les 2 équipes du match avec leurs joueurs
        const informationsTeamDomicileData = await client.query({
            text: "SELECT * FROM teams JOIN players ON teams.team_id = players.team_id WHERE teams.team_id = $1 ORDER BY players.team_id DESC LIMIT 5;",
            values: [match.team_dom_id]
        })
        const informationsTeamDomicile = formateData(informationsTeamDomicileData)

        const informationsTeamExterieurData = await client.query({
            text: "SELECT * FROM teams JOIN players ON teams.team_id = players.team_id WHERE teams.team_id = $1 ORDER BY players.team_id DESC LIMIT 5;",
            values: [match.team_ext_id]
        })
        const informationsTeamExterieur = formateData(informationsTeamExterieurData)
        
        //Il faut simuler le match en fonction des joueurs
        //On compare la somme des notes des joueurs 
        let totalDom = 0
        informationsTeamDomicile.forEach(player => {
            totalDom += player.energie*player.grade
        })

        let totalExt = 0
        informationsTeamExterieur.forEach(player => {
            totalExt += player.energie*player.grade
        })

        //On calcule les buts marqués
        let goalScoredByLoser = getRandomInt(5) //Le perdant marque 5 buts max
        let goalScoredByWinner = goalScoredByLoser + 1 + getRandomInt(5)
        let result = ""

        if(totalDom > totalExt){
            result = goalScoredByWinner + " - " + goalScoredByLoser
            //On ajoute les 3 points a l'équipe a domicile
            await client.query({
                text: "UPDATE teams SET points = $1 WHERE team_id = $2",
                values: [(informationsTeamDomicile[0].points + 3),informationsTeamDomicile[0].team_id]
            })
        } else if(totalDom < totalExt){
            result = goalScoredByLoser + " - " + goalScoredByWinner
            await client.query({
                text: "UPDATE teams SET points = $1 WHERE team_id = $2",
                values: [(informationsTeamExterieur[0].points + 3),informationsTeamExterieur[0].team_id]
            })
        } else {
            result = goalScoredByLoser + " - " + goalScoredByLoser
            await client.query({
                text: "UPDATE teams SET points = $1 WHERE team_id = $2",
                values: [(informationsTeamDomicile[0].points + 1),informationsTeamDomicile[0].team_id]
            })
            await client.query({
                text: "UPDATE teams SET points = $1 WHERE team_id = $2",
                values: [(informationsTeamExterieur[0].points + 1),informationsTeamExterieur[0].team_id]
            })
        } 

        //On met à jour le résultat de la simulation
        await client.query({
            text: "UPDATE matchs SET result = $1 WHERE match_id = $2",
            values: [result, match.match_id]
        })

        //On fatigue les joueurs
        for(let k = 0; k < informationsTeamDomicile.length; k++){
            const player = informationsTeamDomicile[k]
            const energie = player.energie - ( (1-((player.endurance-1)/5) )*player.energie)
            await client.query({
                text: "UPDATE players SET energie = $1 WHERE player_id = $2",
                values: [Math.round(energie), player.player_id]
            })
        }

        for(let k = 0; k < informationsTeamExterieur.length; k++){
            const player = informationsTeamDomicile[k]
            const energie = player.energie - ( (1-((player.endurance-1)/5) )*player.energie)
            await client.query({
                text: "UPDATE players SET energie = $1 WHERE player_id = $2",
                values: [Math.round(energie), player.player_id]
            })
        }

        //On édite la semaine
        await client.query({
            text: "UPDATE weeks SET done = true WHERE week_id = $1",
            values: [weekSimulating[0].week_id]
        })
    }

    res.json("ok")
})

//fonction pour envoyer correctement les données (sans rows notamment)
function formateData(data){
    let tabData = []
    data.rows.forEach(item => {
        tabData.push(item)
    })
    return tabData
}

//Fonction Mozilla doc
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}




module.exports = router


