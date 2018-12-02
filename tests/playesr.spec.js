const bidgame = require('../src/bidgameClient.js')
const router = require('../src/bidgameServer.js')
const express = require('express')
const supertest = require('supertest')
const {expect} = require('chai')

const app = express()
app.use('/newGame', router)

describe('SERVER ', () => {
  it('responds to newGame', (done) => {
    supertest(app)
      .get('/newGame')
      .expect(200)
      .then(() => done())
      .catch(error => done(error))
  })
})

describe('CLIENT', () => {
  const players = JSON.stringify({"players":[
    {
      id:"stupidplayer",
      code:"var myBid = function (players, color, history) { return 0 }"
    },
    {
      id:"smartplayer",
      code:"var myBid = function (players, color, history) { return 1 }"
    }
  ]
  })
  let serverHandler
  beforeEach( (done) => {
    serverHandler = app.listen(3000, () => {
      done()
    })
  })
  afterEach(() => {
    serverHandler.close()
  })
  it('should send request to server and respond', (done) => {
    const url = 'http://localhost:3000/newGame'
    bidgame(url, players)
      .then(response => {
        expect(response.winnings).to.have.property('smartplayer')
        done()
      })
      .catch(error => done(error))
  })
})
