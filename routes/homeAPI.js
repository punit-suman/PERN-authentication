module.exports = (app) => {

    // handling GET request to '/' or '/api/home'
    app.get(['/', '/api/home'], (req, res) => {
        var response = {error: "", message: ""}
        try {
            response.message = "This is the homepage."
            res.status(200).send(JSON.stringify(response))
        } catch (err) {
            console.log(err.message)
            response.error = "Server Error! Try again later."
            res.status(500).send(JSON.stringify(response))
        }
    })
}