// const express = require('express')
// const bodyParser = require('body-parser')
// const router = express.Router()

// const GAME = require('./Game')

// router.use(bodyParser.json())

// router.get('/', function(req, res){

//   try {
//     var players = []
//     if (req.query.players !== undefined) {
//       var playerStruct = JSON.parse(req.query.players)
//       players = playerStruct.players
//     }

//     var extraPlayers = Math.max(0, 2 - players.length)

//     for (var i=0;i<extraPlayers;i++){
//       players.push(GAME.generateDummyPlayer(i+1))
//     }

//     var result = GAME.newGame(players)

//     res.json(result)
//   } catch (err) {
//     res.status(500).send('Something broke! ' + err.message)
//   }
// })


// module.exports = router
