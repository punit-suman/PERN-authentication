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
  secret: "abc123",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1000*60*60
  }
}))
// handling routes
app.use(express.static(path.join(__dirname, 'client/build')))
app.post('/registerAPI', (req, res) => {
  try {
    const username = req.body.username
    const password = req.body.password
    const firstname = req.body.firstname
    const lastname = req.body.lastname

    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err)
      }
      pool.query('INSERT into users(username, password, firstname, lastname) values($1, $2, $3, $4) returning *', [username, hash, firstname, lastname], (err, result) => {
        if (err) {
          console.log(err)
        } else {
          if (result.rows.length === 0) {
            res.send(JSON.stringify({message: "Error: User not registered."}))
          } else {
            res.send(JSON.stringify({message: "User registered successfully."}))
          }
        }
      })
    })
  } catch (err) {
    console.log(err)
  }
})

app.get('/loginAPI', (req, res) => {
  if (req.session.user) {
    res.send({LoggedIn: true, user: req.session.user})
  } else {
    res.send({LoggedIn: false})
  }
})

app.post('/loginAPI', (req, res) => {
  
  const username = req.body.username
  const password = req.body.password

  pool.query('Select * from users where username=$1', [username], (err, result) => {
    if (err) {
      res.send(JSON.stringify({error: err}))
      console.log(err)
    } else {
      if (result.rows.length > 0) {
        bcrypt.compare(password, result.rows[0].password, (err, r) => {
          if (err) {
            res.send(JSON.stringify({error: err}))
          }
          if (r) {
            const detail = {
              userid: result.rows[0].userid,
              username: result.rows[0].username,
              firstname: result.rows[0].firstname,
              lastname: result.rows[0].lastname
            }
            req.session.user = detail
            res.send(JSON.stringify({userdetails: {username: result.rows[0].username}}))
          } else {
            res.send(JSON.stringify({message: "Wrong Password!!"}))
          }
        })
      } else {
        res.send(JSON.stringify({message: "User not found!!"}))
      }
    }
  })
  
})

app.get('/checkUsernameAPI/:username', (req, res) => {
  const username = req.params.username
  pool.query(`Select * from users where username=$1`, [username], (err, result) => {
    if (err) {
      res.send(JSON.stringify({error: err}))
      console.log(err)
    } else {
      if (result.rows.length > 0) {
        res.send(JSON.stringify({message: "username present"}))
      } else {
        res.send(JSON.stringify({message: "username not found"}))
      }
    }
  })
})

app.get('/logoutAPI', (req, res) => {
  if (req.session.user) {
    req.session.destroy()
  }
  res.send({message: "Logged Out"})
})

// serving static file (commented in development mode)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
})


// Defining port.
const port = process.env.PORT || 8080
// Starting local server at defined port.
app.listen(port, () => {console.log(`Listening on port ${port}...`)})