module.exports = (app, pool, bcrypt) => {

    // check if loggedIn
    app.get('/api/loggedin', (req, res) => {
        try {
            if (req.session.user) {
                res.send({LoggedIn: true, user: req.session.user})
            } else {
                res.send({LoggedIn: false})
            }
        } catch (err) {
            console.log(err)
        }
    })
    
    // to login
    app.post('/api/login', (req, res) => {
    
        try {
            const username = req.body.username
            const password = req.body.password
            console.log(username, password)
            
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
        } catch (err) {
            console.log(err)
        }
    })
}