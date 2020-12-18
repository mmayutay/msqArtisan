var User = require('../models/artisan-model');
var Orders = require('../models/Bookings')
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var userTask = require('../models/taskOfEveryUsers')
var logsOfHistory = require('../models/logsHistory')
var loggedusers = []

function createToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: 86400 //expires in 24 hours
    });
}

exports.registerUser = (req, res) => {

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ 'msg': 'You need to send email and password' });
    }

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
        }

        if (user) {
            return res.status(400).json({ 'msg': 'The email already exists' });
        }

        let newUser = User(req.body);
        newUser.save((err, user) => {
            if (err) {
                return res.status(400).json({ 'msg': err });
            }
            return res.status(201).json(user);
        });
    });
};

exports.loginUser = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (user == null) {
            res.send({ type: false, msg: 'email' })
        } else {
            if (user.confirmPassword == req.body.password) {
                loggedusers.push(user)
                res.send({ type: true, token: createToken(user), userId: user._id })
            } else {
                res.send({ type: false, msg: 'password' })
            }
        }
    })
};

exports.logoutUser = (req, res) => {
    let count = 0
    User.findOne({ _id: req.body.user }, (err, user) => {
        loggedusers.forEach(element => {
            if (element._id != user._id) {
                count += 1
            }
        })
        loggedusers.pop(count)
    })
}
exports.getUser = (req, res) => {
    User.find({ _id: req.body.id }, (err, user) => {

        if (err) {
            return res.send({ error: err, status: false })


        } else {
            return res.send({ status: true, data: user })
        }
    });
}

exports.addJobOrders = (req, res) => {
    var dataTOAdd = {
        logsOwner: req.body.currentUser,
        jobsOfferedThroughId: req.body.jobOffer._id
    }
    let dataAdd = new logsOfHistory(dataTOAdd)
    dataAdd.save((err, result) => {
        console.log(result)
    })
    Orders.findByIdAndUpdate({_id: req.body.jobOffer._id}, {status: 'Ongoing'}, (err, result) => {
    })
    var sampleObject = {
        currentUser: req.body.currentUser,
        state: req.body.state,
        customerId: req.body.jobOffer._id
    }
    let usersTask = new userTask(sampleObject)
    usersTask.save((err, result) => {
        res.send(result)
    })
}
//array, request, toPassarray
exports.allJobAccepted = (req, res) => {
    userTask.find({currentUser: req.body.user, state: "accept"}).populate('customerId')
    .exec((err, data) => {
        res.send(data)
    })
}

exports.completedJob = (req, res) => {
    userTask.find({currentUser: req.body.user, state: "completed"}).populate('customerId')
    .exec((err, data) => {
        res.send(data)
    })
}
exports.returnAllActiveUsers = (req, res) => {
    res.send(loggedusers)
}