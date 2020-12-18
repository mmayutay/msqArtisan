var express = require('express'),
    routes = express.Router();
var userController = require('./controller/artisans-controller');
var customerController = require('./controller/customer-controller');
var orderController = require('./controller/orders-controller');
const AuthCtrl = require('./controller/resetPassword-controller');

routes.post('/logout', userController.logoutUser)
routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);
routes.post('/account', userController.getUser);
routes.get('/allCustomers', customerController.getAllCustomers);

routes.post('/acceptedJobToCompleted', orderController.acceptedJobToCompleted )
routes.post('/allLogsHistory', orderController.allLogsHistory)

routes.post('/jobOrdersData', userController.addJobOrders);
routes.post('/allJobsAccepted', userController.allJobAccepted);
routes.post('/allCompletedJobs', userController.completedJob)

routes.get('/allActiveUsers', userController.returnAllActiveUsers)

routes.get('/getNewOrder', orderController.getOrders);
routes.get('/getCustomersName', orderController.getCustomersName);
routes.post('/getCustomersData', orderController.getCustomersData)

routes.post('/reqResetPassword', AuthCtrl.ResetPassword);
routes.post('/new-password', AuthCtrl.NewPassword);
routes.post('/valid-password-token', AuthCtrl.ValidPasswordToken);

// routes.get('/special', passport.authenticate('jwt', { session: false }), (req, res) => {
//     return res.json({ msg: `Hey ${req.user.email}! I open at the close.` });
// });

module.exports = routes;