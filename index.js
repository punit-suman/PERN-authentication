const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
// database connection
const pool = require('./db')

const cookieParser = require('cookie-parser')
const session = require('express-session')
const bcrypt = require('bcrypt')
const saltRounds = 10

app.use(express.json())

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(cookieParser());

app.use(express.urlencoded({extended: true}));

app.use(session({
  key: "userId",
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1000*60*60
  }
}))

app.use(express.static(path.join(__dirname, 'client/build')))

// handling routes
require('./routes/loginAPI')(app, pool, bcrypt)
require('./routes/registerAPI')(app, pool, bcrypt, saltRounds)
require('./routes/logoutAPI')(app)

// serving static file (commented in development mode)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
})


// Defining port.
const port = process.env.PORT || 8080
// Starting local server at defined port.
app.listen(port, () => {console.log(`Listening on port ${port}...`)})