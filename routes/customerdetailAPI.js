module.exports = (app, pool) => {
    // handling GET request to get customer details with given ID
    app.get("/api/customerdetail/:id", async(req, res) => {
        var response = { customer: {}, subscriptions: [], serverresponse: {error: "", success: ""}}
        try {
            // getting customerid from the parameter in the URL
            const { id } = req.params
            // error if id is not integer
            if (isNaN(id)) {
                response.serverresponse.error = "Wrong ID"
                res.status(400).send(JSON.stringify(response))
                return
            }
            // getting customer detail
            const customer = await pool.query('SELECT * FROM customerdetails WHERE customerid=$1', [id])
            // Database connection error
            if (typeof customer.rows === "undefined") {
                response.serverresponse.error = "Server Error!"
                res.status(500).send(JSON.stringify(response))
                return
            }
            // error if customer with requested id not found
            if (customer.rows.length === 0) {
                response.serverresponse.error = "Customer not found!"
                res.status(400).send(JSON.stringify(response))
                return
            }
            response.customer = customer.rows[0]
            // getting subscription details of customer
            var q = `SELECT 
                        s.subscriptionid,
                        s.quantity,
                        s.amount,
                        s.subscriptiondate,
                        s.startdate,
                        s.enddate,
                        s.totaldayscancelled,
                        s.lastdeliverydate,
                        (s.totaldaystodeliver - s.totaldaysdelivered - s.totaldayscancelled) as deliveriesleft,
                        (s.amount / s.totaldaystodeliver) * (s.totaldaystodeliver - s.totaldaysdelivered - s.totaldayscancelled) as balance,
                        p.productname
                    FROM subscriptions s
                    JOIN products p
                    ON p.productid=s.productid
                    WHERE customerid=$1
                    ORDER BY subscriptionid DESC`
            const subscriptions = await pool.query(q, [id])
            var b = 0   // total balance of the customer
            // getting cancellation details for each subscription
            for (let i=0;i<subscriptions.rows.length;i++) {
                response.subscriptions.push(subscriptions.rows[i])
                response.subscriptions[i].cancellations = []
                if (subscriptions.rows[i].totaldayscancelled !== 0) {
                    // read from cancellations table
                }
                b += parseFloat(subscriptions.rows[i].balance)
            }
            response.totalbalance = b
            response.serverresponse.success = "Data sent successfully!"
            res.header("Content-Type",'application/json')
            res.status(200).send(JSON.stringify(response))
        } catch (err) {
            console.log(err.message)
            // send server error message if process fails due to error
            response.serverresponse.error = "Server Error! Try again later."
            res.status(500).send(JSON.stringify(response))
        }
    })
}