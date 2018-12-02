const sendGameRequest = require('./bidgameClient.js')

const players = JSON.stringify({"players":[
  {
    id:"olle",
    code:"var myBid = function (players, color, history) { return Math.random() }"
  },
  {
    id:"nisse",
    code:"var myBid = function (players, color, history) { return 10 }"
  }
  ]
})
//const url = 'https://bidgame.herokuapp.com/newGame'
const url = 'http://localhost:3000/newGame'
sendGameRequest(url, players).then(response => {
  console.log('response', response)
})
