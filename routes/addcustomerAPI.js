const Joi = require('joi')


module.exports = (app, pool) => {

    // handling POST request to '/api/addcustomer' to Add Customer
    app.post('/api/addcustomer', async (req, res) => {
        var response = {serverresponse: {error : "", success : ""}, customerdetails: {}}
        try {
            
            // validating the input using Joi
            const schema = Joi.object({
                name: Joi.string().required(),
                gender: Joi.string().required(),
                dob: Joi.date().required(),
                address: Joi.string().required(),
                pincode: Joi.number().required(),
                phonenumber: Joi.number().required(),
                healthissues: Joi.any().optional()
            })
            const result = schema.validate(req.body)
            // send error message if input not in required format
            if (result.error) {
                response.serverresponse.error = "Error: " + result.error.details[0].message
                res.status(400).send(JSON.stringify(response))
                return
            }
            // reading data from the request body in JSON type
            const { name, gender, dob, address, pincode, phonenumber, healthissues } = req.body
            if (isNaN(pincode) || (!isNaN(pincode) && !Number.isInteger(parseFloat(pincode))) || pincode < 100000 || pincode > 999999) {
                response.serverresponse.error = "Error: Pincode must be a 6-digit number"
                res.status(400).send(JSON.stringify(response))
                return
            }
            if (isNaN(phonenumber) || (!isNaN(phonenumber) && !Number.isInteger(parseFloat(phonenumber))) || phonenumber < 1000000000 || phonenumber > 9999999999) {
                response.serverresponse.error = "Error: Phone number must be a 10-digit number"
                res.status(400).send(JSON.stringify(response))
                return
            }

            // check if phone number is already present in the database
            var checkcustomer = await pool.query('select * from customerdetails where phonenumber=$1', [phonenumber])
            // if present then send error message
            if (typeof checkcustomer.rows === "undefined") {
                console.log("Database connection error.")
                response.serverresponse.error = "Server Error! Try again later."
                res.status(500).send(JSON.stringify(response))
                return
            } else if (checkcustomer.rows.length > 0) {
                response.serverresponse.error = "Phone number already registered with another customer."
                res.status(400).send(JSON.stringify(response))
                return
            }

            // insert the data into the database and get the record
            const customer = await pool.query('INSERT INTO customerdetails(name, gender, dob, address, pincode, phonenumber, healthissues) VALUES($1, $2, $3, $4, $5, $6, $7) returning *', [name, gender, dob, address, pincode, phonenumber, healthissues])
            // check if data was successfully inserted
            if (typeof customer.rows === "undefined") {
                console.log("Data not inserted.")
                response.serverresponse.error = "Server Error! Try again later."
                res.status(500).send(JSON.stringify(response))
                return
            } else {
                // creating response based on recent inserted record
                response.customerdetails = {
                    id: customer.rows[0].customerid,
                    name: customer.rows[0].name,
                    gender: customer.rows[0].gender,
                    dob: customer.rows[0].dob,
                    address: customer.rows[0].address,
                    pincode: customer.rows[0].pincode,
                    phonenumber: customer.rows[0].phonenumber,
                    healthissues: customer.rows[0].healthissues
                }
            }

            // creating a success message
            response.serverresponse.success = "Customer added successfully!"
            // sending a successful response
            res.status(200).send(JSON.stringify(response))

        } catch (err) {
            console.log(err.message)
            // send server error message if process fails due to error
            response.serverresponse.error = "Server Error! Try again later."
            res.status(500).send(JSON.stringify(response))
        }
    })
}