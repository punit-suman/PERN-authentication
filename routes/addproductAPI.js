const Joi = require('joi')


module.exports = (app, pool) => {

    // handling POST request to '/api/addproduct' to Add Product
    app.post('/api/addproduct', async (req, res) => {
        var response = {serverresponse: {error : "", success : ""}, productdetails: {}}
        try {

            // validating the input using Joi
            const schema = Joi.object({
                productname: Joi.string().required(),
                description: Joi.any().optional(),
                price: Joi.number().required(),
                imageurl: Joi.any().optional()
            })
            const result = schema.validate(req.body)
            // send error message if input not in required format
            if (result.error) {
                response.serverresponse.error = "Error: " + result.error.details[0].message
                res.status(400).send(JSON.stringify(response))
                return
            }
            // reading data from the request body in JSON type
            const { productname, description, price, imageurl } = req.body
            
            // validating price
            if (isNaN(price) || price <= 0) {
                response.serverresponse.error = "Error: Price must be a number greater than 0."
                res.status(400).send(JSON.stringify(response))
                console.log(response)
                return
            }
            
            
            // formatting the imageurl in required format
            var imgurl = ""
            if (imageurl !== "") {
                imgurl = "https://drive.google.com/uc?export=view&id=" + imageurl.split("/")[5]
            }

            // check if product name is already present in the database
            var checkproductname = await pool.query('select * from products where productname=$1', [productname])
            // if present then send error message
            if (typeof checkproductname.rows === "undefined") {
                console.log("Database connection error.")
                response.serverresponse.error = "Server Error! Try again later."
                res.status(500).send(JSON.stringify(response))
                return
            } else if (checkproductname.rows.length > 0) {
                response.serverresponse.error = "Product name already exists."
                res.status(400).send(JSON.stringify(response))
                return
            }

            // insert the data into the database and get the record
            const product = await pool.query('INSERT INTO products(productname, price, description, imageurl) VALUES($1, $2, $3, $4) returning *', [productname, price, description, imgurl])
            // check if data was successfully inserted
            if (typeof product.rows === "undefined") {
                console.log("Data not inserted.")
                response.serverresponse.error = "Server Error! Try again later."
                res.status(500).send(JSON.stringify(response))
                return
            } else {
                // creating response based on recent inserted record
                response.productdetails = {
                    productname: product.rows[0].productname,
                    price: product.rows[0].price,
                    description: product.rows[0].description,
                    imageurl: product.rows[0].imageurl
                }
            }

            // creating a success message
            response.serverresponse.success = "Product added successfully!"
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