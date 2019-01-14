export type GameState = {

}
type Player = {
  bid: (info: GameState) => number,
  id: number
}

type HistoryPoint = {
  playerId: number,
  bid: number,
  winnings: string,
  round: number
}
type Bid = {
  bid: number,
  winnings: string,
  playerId: number
}
const MAX_GAME_ROUNDS = 10

export function runBidGameRound(players: Player[], history: HistoryPoint[], gameRoundColor: string): Bid {   //ToDO: Create Player struct

  var bids = players.map(function (player: Player) {
    const result = player.bid({
      color: gameRoundColor
    })
    return {bid: result, playerId: player.id, winnings: gameRoundColor}
  })

  const winningBid = bids.reduce(function (bestBid: Bid, result: Bid) {
    return result.bid > bestBid.bid &&
           playerCanAffordBid(result.playerId, result.bid, history) ?
              result :
              bestBid
  })

  return winningBid
}

function endConditionCheck(history: HistoryPoint[]) {
  var winnings = {}
  history.forEach(function (item) {
    if (item.winnings !== 'NONE') {
      winnings[item.winnings] = winnings[item.winnings] === undefined ? 1 : winnings[item.winnings] + 1
    }
  })

  var keys = Object.keys(winnings)
  var fiveEqual = false
  keys.forEach(function(key) {
    if (winnings[key] >= 5) {
      fiveEqual = true
    }
  })

  return fiveEqual
}


function playerCanAffordBid (playerId: number, playerBid: number, history) {

  var bids = history.filter(function (item: Bid) {
    return item.playerId === playerId
  })

  var sum = bids.reduce( (sum: number, item: Bid) => sum + item.bid, playerBid)

  return sum <= 100
}


function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}


export function newGame(players: Player[]) {

  var history = []

  var colorList = ["RED", "BLUE", "GREEN", "YELLOW"]
  for (var i=0;i<MAX_GAME_ROUNDS;i++){
    const gameRoundColor = colorList[randomIntFromInterval(0, colorList.length-1)]
    const winningBid = runBidGameRound(players, history, gameRoundColor)
    const something =  {playerId: winningBid.playerId, bid: winningBid.bid, winnings: gameRoundColor, round: i}   //ToDO Create HistoryStruct

    history = history.concat(something)
    var endOfGame = endConditionCheck(history)
    if (endOfGame) {
      break
    }
  }

  var winnings = {}
  history.forEach(function (item: Bid) {
    if (item.winnings !== 'NONE') {
      var playerScore = winnings[item.playerId] || {}
      playerScore[item.winnings] = playerScore[item.winnings] === undefined ? 1 : playerScore[item.winnings] + 1
      winnings[item.playerId] = playerScore
    }
  })

  return {
    winnings: winnings,
    history: history
  }
}

export const __test__ = {
  playerCanAffordBid,
  runBidGameRound
}
