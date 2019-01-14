import { __test__, newGame } from '../src/Game'
const { expect } = require('chai')
const playerGenerator = function (id, bidFunction) {

  return {
    id: id,
    bid: bidFunction
}
}

describe ("bid functions", function () {
  it("a player that bids above should win" , function () {
      const player1 = playerGenerator(1, () => {
        return 1
      })
      const player2 = playerGenerator(2, () => {
        return 2
      })

      const {winnings, history} = newGame([player1, player2])
      console.log('history', history)
      console.log("winnings", winnings)
      expect(Object.keys(winnings)).to.contain('2')
  })
  it('a player that bids to high should not win', () => {
    const player1 = playerGenerator(1, () => {
      return 1
    })
    const player2 = playerGenerator(3, () => {
      return 1001
    })

    const {winnings, history} = newGame([player1, player2])
    console.log('winnings', winnings)
    console.log('history', history)
    expect(Object.keys(winnings)).to.not.contain('3')

  })
})



describe('__test__ functions', () => {
  const {playerCanAffordBid, runBidGameRound} = __test__

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
      expect(result.playerId).to.equal(1)
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
      const history = [{
        playerId: 1, bid: 90
      }]
      expect(playerCanAffordBid(playerId, playerBid, history)).to.equal(false)
    })
    it('should not afford if bid is above 100 and no history', () => {
      const playerId = 1
      const playerBid = 101
      const history = []
      expect(playerCanAffordBid(playerId, playerBid, history)).to.equal(false)
    })
  })
})
