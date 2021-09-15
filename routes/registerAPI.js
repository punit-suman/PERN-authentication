// to check if the username is already in the database
checkusername = async (username, pool) => {
    var u = await pool.query(`Select * from users where username=$1`, [username])
    if (typeof u.rows === "undefined") {
        return "error"
    } else if (u.rows.length > 0) {
        return true
    } else {
        return false
    }
}

// to check if a character is alphabet
isAlpha = (val) => {
    if ((val <= 'z' && val >= 'a') || (val <= 'Z' && val >= 'A')) {
        return true
    } else {
        return false
    }
}

// to check if a character is alphabet or numeric
isAlphaNum = (val) => {
    if ((val <= 'z' && val >= 'a') || (val <= 'Z' && val >= 'A') || (val <= "9" && val >= "0")) {
        return true
    } else {
        return false
    }
}

module.exports = (app, pool, bcrypt, saltRounds) => {

    app.post('/api/register', async (req, res) => {
        try {
            // Input validating
            // username, firstname and password is required input
            if (typeof req.body.firstname === "undefined" || typeof req.body.username === "undefined" || typeof req.body.password === "undefined") {
                res.send(JSON.stringify({error: "Inputs missing."}))
                return
            }
            const username = req.body.username
            // to check if the username contains only alphanumerics
            var error = false
            for (var i=0;i<username.length;i++) {
                if (!isAlphaNum(username[i])) {
                    error = true
                    break
                }
            }
            if (error) {
                res.send(JSON.stringify({error: "Username should include alphanumerics only."}))
                return
            }
            usernamePresent = await checkusername(username, pool)
            if (usernamePresent === "error") {
                res.send(JSON.stringify({error: "Database connection error."}))
                return
            }
            // if username already present
            if (usernamePresent) {
                res.send(JSON.stringify({error: "Username already in use."}))
                return
            }

            const password = req.body.password
            const firstname = req.body.firstname
            // to check if the firstname contains only alphabets
            var error = false
            for (var i=0;i<firstname.length;i++) {
                if (!isAlpha(firstname[i])) {
                    error = true
                    break
                }
            }
            if (error) {
                res.send(JSON.stringify({error: "Firstname should include alphabets only."}))
                return
            }
            const lastname = req.body.lastname || ""
            // to check if the lastname contains only alphabets
            var error = false
            for (var i=0;i<lastname.length;i++) {
                if (!isAlpha(lastname[i])) {
                    error = true
                    break
                }
            }
            if (error) {
                res.send(JSON.stringify({error: "Lastname should include alphabets only."}))
                return
            }
            
            // encrypting password and then storing data
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.log(err)
                }
                pool.query('INSERT into users(username, password, firstname, lastname) values($1, $2, $3, $4) returning *', [username, hash, firstname, lastname], (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        if (result.rows.length === 0) {
                            res.send(JSON.stringify({error: "User not registered."}))
                        } else {
                            // successful registration
                            res.send(JSON.stringify({message: "User registered successfully."}))
                        }
                    }
                })
            })
        } catch (err) {
            console.log(err)
        }
    })

    // API to check if the username is already registered
    app.get('/api/checkusername/:username', async (req, res) => {
        try {
            const username = req.params.username
            // to check if the username contains only alphanumerics
            var error = false
            for (var i=0;i<username.length;i++) {
                if (!isAlphaNum(username[i])) {
                    error = true
                    break
                }
            }
            if (error) {
                res.send(JSON.stringify({error: "Username should include alphanumerics only."}))
                return
            }
            usernamePresent = await checkusername(username, pool)
            if (usernamePresent) {
                res.send(JSON.stringify({usernameAlreadyRegistered: true}))
            } else {
                res.send(JSON.stringify({usernameAlreadyRegistered: false}))
            }
        } catch (err) {
            console.log(err)
        }
    })

}