const fs = require("fs")
const path = require("path")
const playersFiles = fs.readdirSync(path.join(__dirname, "../players"))
const bidfunctions = playersFiles.map(dir => {
  return require(path.join("../players", dir))
})
console.log(bidfunctions)
// const bidfunctions = require("../players/examplePlayer.js")

const playerGenerator = function (id, bidFunction) {

  return {
    id: id,
    bid: bidFunction
}
}

const GAME = require('./Game')


var players = bidfunctions.map((func, index) => {
  return playerGenerator(index, func)
})

console.log(players)
var extraPlayers = Math.max(0, 2 - players.length)

for (var i=0;i<extraPlayers;i++){
  players.push(GAME.generateDummyPlayer(i+1))
}

var result = GAME.newGame(players)
console.log("result", result)
