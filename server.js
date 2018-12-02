const router = require('./src/bidgameServer.js')
const express = require('express')
const app = express()
app.use('/newGame', router)
const port = 3000
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))
