var Customers = require('../models/User');



exports.getAllCustomers = (req, res) => {
    Customers.find((err, customer) => {
        console.log("customer details: ", customer);
        if (err) {
            return res.send({ error: err, status: false })
        } else {
            return res.send({ status: true, data: customer })
        }
    })
}