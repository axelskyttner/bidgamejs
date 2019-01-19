import { expect } from 'chai'
import players from '../players/playerIndex'


describe ("bid functions", function () {
  it("should never bid below 0" , function () {
    players.forEach((player, i) => {

      const res = player.bid({})
      expect(res).to.be.above(0, `player ${player.id} has made negative bid`)
    })
  })
})
