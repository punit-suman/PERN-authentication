module.exports = (app) => {

    app.get('/api/logout', (req, res) => {
        try {
            if (req.session.user) {
                req.session.destroy()
            }
            res.send({message: "Logged Out"})
        } catch (err) {
            console.log(err)
        }
    })
}