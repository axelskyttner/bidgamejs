import {expect}  from 'chai'
import { 
  newGame, 
  functions, 
  HistoryPoint,Bid } from '../src/Game'


const { playerGenerator, isGameEnded, getWinner } = functions

describe("newGame should return the winner", () => {
  it("should declare the one with valid bids the winner", () => {
    const player1 = playerGenerator(1, () => {
      return 1
    })
    const player2 = playerGenerator(3, () => {
      return 1001
    })
    const { history, winner } = newGame([player1, player2])
    expect(winner).to.equal(1)
  })
  it("should declare the one with highest bids the winner", () => {
    const player1 = playerGenerator(1, () => {
      return 1
    })
    const player2 = playerGenerator(3, () => {
      return 2
    })
    const { history, winner } = newGame([player1, player2])
    expect(winner).to.equal(3)
  })
  it("should have 5 equal of any color when game is over", () => {
    const player1 = playerGenerator(1, () => {
      return 1
    })
    const player2 = playerGenerator(3, () => {
      return 2
    })
    const { history, winner } = newGame([player1, player2])
    const yellowEntries = history.filter(entry => entry.color === 'YELLOW').length
    const blue = history.filter(entry => entry.color === 'BLUE').length
    const red = history.filter(entry => entry.color === 'RED').length
    const green = history.filter(entry => entry.color === 'GREEN').length
    const max = Math.max.apply(null, [yellowEntries, blue, red, green])
    expect(max).to.equal(5)
  })
})

describe('player interface', () => {
  it('should have the specified properties', () => {
    const player1 = playerGenerator(1, (gameState) => {
      expect(gameState['color']).to.be.oneOf(['RED', 'GREEN', 'BLUE', 'YELLOW'])
      expect(gameState['currentBid']).to.be.oneOf([-Infinity, 2])
      expect(gameState['history']).to.exist
      return 1
    })
    const player2 = playerGenerator(2, (gameState) => {
      return 2
    })

    newGame([player1, player2])
  })
})



describe('help functions', () => {
  const { playerCanAffordBid, runBidGameRound } = functions

  describe('runBidGameRound', () => {
    it('', () => {
      const player1 = playerGenerator(1, () => {
        return 1
      })
      const player2 = playerGenerator(3, () => {
        return 1001
      })
      const color = "GREEN"
      const players = [player1, player2]
      const history = []

      const result = runBidGameRound(players, history, color)
      expect(result.playerId).to.equal(3)
      expect(result.amount).to.equal(100)
    })
  })

  function generateHistoryPoint (options: any = {}) : Bid {
    return {
            color: options.color || 'BLUE',
            playerId: options.playerId || 0,
            amount: options.amount !== undefined ? options.amount : 1
        }
  }
  describe("getWinner", function () {
    it("should return winner if onlmy one player present", function () {

      const historyList: Bid[] = [
        generateHistoryPoint({playerId: 1})
      ]
      const winner = getWinner(historyList)
      expect(winner).to.equal(1)
    })

    it("should return winner to the one with two blues vs 2 green", function () {
      
      const historyList: Bid[] = [
        generateHistoryPoint({playerId: 1, color: 'green'}),
        generateHistoryPoint({playerId: 1, color: 'blue'}),
        generateHistoryPoint({playerId: 3, color: 'green'}),
        generateHistoryPoint({playerId: 3, color: 'blue'}),
        generateHistoryPoint({playerId: 2, color: 'blue'}),
        generateHistoryPoint({playerId: 2, color: 'blue'})
      ]
      const winner = getWinner(historyList)
      expect(winner).to.equal(2)
    })
  })
  describe('playerCanAffordBid', () => {
    it('should afford if bid is under 100 and no history', () => {
      const playerId = 1
      const playerBid = 10
      const history = []
      expect(playerCanAffordBid(playerId, playerBid, history)).to.equal(true)
    })
    it('should not afford if bid is under 100 but with history', () => {
      const playerId = 1
      const playerBid = 20
      const history = [
        generateHistoryPoint({amount: 90, playerId: 1, bid: 90
        })
      ]
      expect(playerCanAffordBid(playerId, playerBid, history)).to.equal(false)
    })
    it('should not afford if bid is above 100 and no history', () => {
      const playerId = 1
      const playerBid = 101
      const history = []
      expect(playerCanAffordBid(playerId, playerBid, history)).to.equal(false)
    })
  })

  describe('isGameEnded', () => {
    it('should returnt true when 5 elements are of same color', ()=> {
      const history = [
        'BLUE',
        'BLUE',
        'BLUE',
        'BLUE',
        'BLUE'
      ]
      expect(isGameEnded(history)).to.equal(true)
    })
     it('should return false when 4 elements are of same color', ()=> {
      const history = [
        'RED',
        'RED',
        'RED',
        'RED'
      ]
      expect(isGameEnded(history)).to.equal(false)
    })
  })
})




export { }
