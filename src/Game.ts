export type GameState = {
  currentBid: number,
  color: string,
  history: Bid[],
  myId: number
}
type Player = { bid: (info: GameState) => number, id: number }
export type HistoryPoint = { bid: Bid, round: number }
export type Bid = { amount: number, color: string, playerId: number }
const MAX_GAME_ROUNDS = 50

export function generateGameState(options: any = {}): GameState {
  return {
      currentBid: options.currentBid !== undefined ? options.currentBid : 50,
      color: options.color !== undefined ? options.color : 'RED',
      history: options.history !== undefined ? options.history : [],
      myId: options.myId !== undefined ? options.myBid : 0
  }
}

export function generateBidPoint(options: any = {}): Bid {
  return {
      amount: options.amount !== undefined ? options.amount : 50,
      color: options.color !== undefined ? options.color : 'RED',
      playerId: options.playerId !== undefined ? options.playerId : []
  }
}

function getHighestBidAmount(bids: Bid[]) {
  return Math.max(...bids.map(bid => bid.amount))
}

export function runBidGameRound(players: Player[], bidHistory: Bid[], gameRoundColor: string): Bid {
  const bids = players.reduce(function (bids: Bid[], player: Player) {
      const currentBid = getHighestBidAmount(bids)
      const playerInformation = { 
          currentBid, 
          color: gameRoundColor, 
          myId: player.id, 
          history: bidHistory }
      const amount = player.bid(playerInformation)
      const bidResult = { amount: amount, playerId: player.id, color: gameRoundColor }
      return bids.concat(bidResult)
  }, [])
  const truncatedBids = bids.map((bid) => {
      return truncateBid(bid, bidHistory)
  })
  const winningBid = truncatedBids.reduce(function (bestBid: Bid, currentBid: Bid) {

      return getHighestBid(bestBid, currentBid)
  })
  return winningBid
}

function shuffle(_a) {
  const a = _a.slice()
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

function getHighestBid(bid1: Bid, bid2: Bid) {
  return (bid1.amount > bid2.amount) ? bid1 : bid2
}

function isGameEnded(colors: String[]) {
  const uniqueColors = Array.from(new Set(colors))

  const nrColors = uniqueColors.map(color => {
      return colors.filter(tmpColor => {
          return tmpColor === color
      }).length
  })
  const fiveEquals = Math.max.apply(null, nrColors) >= 5
  return fiveEquals
}

function getMoneyLeft(playerId: Number, history: Bid[]) {
  const bids = history.filter(function (item: Bid) { return item.playerId === playerId })
  const sum = bids.reduce((sum: number, item: Bid) => sum + item.amount,
      0)
  return 100 - sum
}

function truncateBid(bid: Bid, history: Bid[]): Bid {
  const moneyLeft = getMoneyLeft(bid.playerId, history)
  if (moneyLeft < bid.amount) {
      return {
          playerId: bid.playerId,
          amount: moneyLeft,
          color: bid.color
      }
  } else {
      return bid
  }
}

function playerCanAffordBid(playerId: number, playerBid: number, history: Bid[]) {
  const bids = history.filter(function (item: Bid) { return item.playerId === playerId })
  const sum = bids.reduce((sum: number, item: Bid) => sum + item.amount, playerBid)
  return sum <= 100
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function newGame(players: Player[]) {
  const colorList = ["RED", "BLUE", "GREEN", "YELLOW"]

  const gameColors = []
  for (let i = 0; i < MAX_GAME_ROUNDS; i++) {
      const gameRoundColor = colorList[randomIntFromInterval(0, colorList.length - 1)]
      gameColors.push(gameRoundColor)
      const endOfGame = isGameEnded(gameColors)
      if (endOfGame) {
          break
      }
  }
  const history = gameColors.reduce((history, gameRoundColor) => {
      const shuffledPlayers = shuffle(players)
      const winningBid = runBidGameRound(shuffledPlayers, history, gameRoundColor)
      return history.concat(winningBid)
  }, [])

  return { history: history, winner: getWinner(history) }
}

function sum(arr) {
  return arr.reduce((val1, val2) => {
      return val1 + val2
  })
}

function getUniquePlayerIds(bids: Bid[]) {
  const playerIds = bids.map(point => point.playerId)
  return Array.from(new Set(playerIds))
}
function getUniqueColors(bids: Bid[]) {
  const playerIds = bids.map(point => point.color)
  return Array.from(new Set(playerIds))
}

function getColorScore(uniqueColors: string[], bids: Bid[]) {
  const scoreList = [30, 15, 5, 0]

  const nrColors = uniqueColors.map((color) => {
      return bids.filter(bid => bid.color === color).length
  })

  const values = nrColors.slice().sort((a, b) => {
      return b - a
  })

  const colorScore = uniqueColors.reduce((colorScore, color, index) => {
      const nrSamples = nrColors[index]
      const nrSamplesIndex = values.indexOf(nrSamples);
      const score = scoreList[nrSamplesIndex]

      colorScore[color] = score
      return colorScore
  }, {})
  return colorScore
}

function getPlayerWithHighestScore(playerIds: number[], scores: number[]): number {
  const highestScoreIndex = scores.indexOf(Math.max.apply(null, scores))
  return playerIds[highestScoreIndex]
}

function getPlayerScores(playerIds: Number[], history: Bid[]) {
  const uniqueColors = getUniqueColors(history)
  const colorScore = getColorScore(uniqueColors, history)
  const playerScores = playerIds.map(playerId => {
      const relevantGames = history.filter(historyPoint => {
          return historyPoint.playerId === playerId
      })

      return sum(relevantGames.map(bid => {
          return colorScore[bid.color]
      }))
  })
  return playerScores
}
function getWinner(history: Bid[]) {
  if (history.length === 0) {
      throw new Error('No winner if empty history!')
  }
  const uniquePlayers = getUniquePlayerIds(history)
  const playerScores = getPlayerScores(uniquePlayers, history)
  const winningPlayerId = getPlayerWithHighestScore(uniquePlayers, playerScores)
  return winningPlayerId
}

const playerGenerator = function (id, bidFunction) {
  return {
      id: id,
      bid: bidFunction
  }
}

export const __test__ = {
  playerCanAffordBid,
  runBidGameRound,
  getWinner,
  isGameEnded
}

export const functions = {
  isGameEnded,
  runBidGameRound,
  playerCanAffordBid,
  getWinner,
  playerGenerator,
  getPlayerScores,
  getMoneyLeft
}
