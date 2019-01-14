const bidgame = require('../src/bidgameClient.js')
const router = require('../src/bidgameServer.js')
const express = require('express')
const supertest = require('supertest')
const {expect} = require('chai')
const playerFunctions = require("../players/examplePlayer")


describe ("bid functoins", function () {
  it("should never bid below 0" , function () {
      const res = playerFunctions({})
      expect(res).to.be.above(0)
  })

})
