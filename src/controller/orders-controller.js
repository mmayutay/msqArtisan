var Orders = require('../models/Bookings');
var userTask = require('../models/taskOfEveryUsers')
var logsOfHistory = require('../models/logsHistory')

exports.getOrders = (req, res) => {
    Orders.find({}, (err, orders) => {
        if (err) {
            return res.send({ error: err, status: false })
        } else {
            return res.send({ status: true, data: orders })

        }
    })
}
exports.getCustomersName = (req, res) => {
    Orders.find({}).populate('author')
        .exec((err, data) => {
            if (err) {
                return res.send({ error: err, status: false })
            } else {
                return res.send({ status: true, data: data })
            }
        })
}
exports.getCustomersData = (req, res) => {
    Orders.findOne({_id: req.body.userId}).populate('author')
    .exec((err, data) => {
        if(err) {
            res.send(err)
        }else {
            res.send(data)
        }
    })
}

exports.acceptedJobToCompleted = (req, res) => {
    userTask.findOneAndUpdate({_id: req.body.jobOffer}, {state: req.body.state}, (err, result) => {
        res.send(result)
    })
}


exports.allLogsHistory = (req, res) => {
    logsOfHistory.find({ logsOwner: req.body.currentUser}, (err, result) => {
        res.send(result)
    })
}


// {
//     user: "id"
//     jobsOffered: "booking_id"

// }