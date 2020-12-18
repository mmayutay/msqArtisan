var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('./config/config');
var cors = require('cors');
var app = express();
var port = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
// const auth = require('./routes');
// var User = require('../src/models/artisan-model');

// For Password Resit
const app2 = express();
app2.use(cors());
const server = require('http').createServer(app2);

app2.use(express.json({ limit: '50mb' }));
app2.use(express.urlencoded({ extended: true, limit: '50mb' }));
app2.use(cookieParser());


var messages = [];

// For Pusher
const Pusher = require('pusher');

const pusher = new Pusher({
    appId: "1106641",
    key: "9d4e34bbed57dbddf921",
    secret: "cc0d97cef7e12f74943c",
    cluster: "ap1",
    useTLS: true
});

const app1 = express();
const port1 = process.env.PORT || 5005;

app1.use(bodyParser.json());
app1.use(bodyParser.urlencoded({ extended: false }));
app1.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});
app1.post('/messages', (req, res) => {
    messages.push(req.body);
    pusher.trigger('chat', 'message', messages);
    res.send(messages);
});

app1.get('/api/allMessages', (req, res) => {
    res.send(messages)
})


// for other server
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(passport.initialize());
var passportMiddleware = require('./middleware/passport');
passport.use(passportMiddleware);

var routes = require('./routes');
app.use('/api', routes);
app2.use('/api', routes)


mongoose.connect(config.db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});
connection.on('error', (err) => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});

// Start the server for password reset
server.listen(5010, () => {
    console.log('Listening on port 5010');
});

// Start the pusher server
app1.listen(port1, () => {
    console.log(`Pusher Server started on port ${port1}`);
});
// Start the server
app.listen(port);
console.log('MsQArtisan is listening on http://localhost:' + port);