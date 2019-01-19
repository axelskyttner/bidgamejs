export type GameState = {

}
type Player = {
  bid: (info: GameState) => number,
  id: number
}

type HistoryPoint = {
  bid: Bid,
  round: number
}
type Bid = {
  amount: number,
  color: string,
  playerId: number
}
const MAX_GAME_ROUNDS = 10

function getHighestBidAmount (bids: Bid[]) {
  return Math.max(...bids.map(bid => bid.amount))
}

export function runBidGameRound(players: Player[], history: HistoryPoint[], gameRoundColor: string): Bid {   //ToDO: Create Player struct

  const bids = players.reduce(function (bids: Bid[], player: Player) {
    const currentBid = getHighestBidAmount(bids)
    const result = player.bid({
      currentBid,
      color: gameRoundColor,
      history
    })
    return bids.concat({ amount: result, playerId: player.id, color: gameRoundColor })
  }, [])

  const winningBid = bids.reduce(function (bestBid: Bid, currentBid: Bid) {
    if (playerCanAffordBid(currentBid.playerId, currentBid.amount, history)) {
      return getHighestBid(bestBid, currentBid)
    } else {
      return bestBid
    }
  })

  return winningBid
}

function getHighestBid(bid1: Bid, bid2: Bid) {
  return (bid1.amount > bid2.amount) ?
    bid1 :
    bid2
}


function endConditionCheck(history: HistoryPoint[]) {
  const winnings = {}
  history.forEach(function (historyPoint) {
    if (historyPoint.bid.color !== 'NONE') {
      winnings[historyPoint.bid.color] = winnings[historyPoint.bid.color] === undefined ? 1 : winnings[historyPoint.bid.color] + 1
    }
  })

  const keys = Object.keys(winnings)
  let fiveEqual = false
  keys.forEach(function (key) {
    if (winnings[key] >= 5) {
      fiveEqual = true
    }
  })

  return fiveEqual
}


function playerCanAffordBid(playerId: number, playerBid: number, history) {

  const bids = history.filter(function (item: Bid) {
    return item.playerId === playerId
  })

  const sum = bids.reduce((sum: number, item: Bid) => sum + item.amount, playerBid)

  return sum <= 100
}


function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


export function newGame(players: Player[]) {

  let history = []

  const colorList = ["RED", "BLUE", "GREEN", "YELLOW"]
  for (let i = 0; i < MAX_GAME_ROUNDS; i++) {
    const gameRoundColor = colorList[randomIntFromInterval(0, colorList.length - 1)]
    const winningBid = runBidGameRound(players, history, gameRoundColor)
    const something = { playerId: winningBid.playerId, bid: winningBid.amount, winnings: gameRoundColor, round: i }   //ToDO Create HistoryStruct

    history = history.concat(something)
    const endOfGame = endConditionCheck(history)
    if (endOfGame) {
      break
    }
  }

  const winnings = {}
  history.forEach(function (item: Bid) {
    if (item.color !== 'NONE') {
      const playerScore = winnings[item.playerId] || {}
      playerScore[item.color] = playerScore[item.color] === undefined ? 1 : playerScore[item.color] + 1
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
