const {expect} = require('chai')
const playerFunctions = require("../players/examplePlayer")


describe ("bid functions", function () {
  it("should never bid below 0" , function () {
      const res = playerFunctions({})
      expect(res).to.be.above(0)
  })
})
