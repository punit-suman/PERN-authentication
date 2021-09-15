module.exports = (app, pool, bcrypt, saltRounds) => {
    
    app.post('/api/register', (req, res) => {
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

    app.get('/api/checkusername/:username', (req, res) => {
        try {
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
        } catch (err) {
            console.log(err)
        }
    })
}