'use strict';

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

var express = require('express');
var path = require('path');
var app = express();
// enable public html
app.use(express.static(path.join(__dirname, 'public')));
// enable POST request decoding
var bodyParser = require('body-parser');
app.use(bodyParser.json());     // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'mysql',
    user: 'root',
    password: 'root',
    database: 'optimiam'
});

pool.getConnection(function (err, connection) {
    if (err)
        throw err;
    console.log("Connected to MYSQL server !");
    pool.query('SELECT COUNT(*) AS `count` FROM food', function (err, rows, fields) {
        if (err)
            throw err;
        console.log(rows[0].count + " registered foods !");
    });
    pool.query('SELECT COUNT(*) AS `count` FROM receipts', function (err, rows, fields) {
        if (err)
            throw err;
        console.log(rows[0].count + " registered receips !");
    });
    console.log("Ready to handle queries.");
    connection.release();
});

// DEBUG
//pool.on('acquire', function (connection) {
//  console.log('Connection %d acquired', connection.threadId);
//});
//pool.on('connection', function (connection) {
//  connection.query('SET SESSION auto_increment_increment=1')
//});
//pool.on('enqueue', function () {
//  console.log('Waiting for available connection slot');
//});
//pool.on('release', function (connection) {
//  console.log('Connection %d released', connection.threadId);
//});

// App
app.get('/api/v1/foods', (req, res) => {
    pool.query('SELECT * FROM food', function (err, rows, fields) {
        if (err)
            throw err;
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows));
    });
});

app.get('/api/v1/shops', (req, res) => {
    pool.query('SELECT * FROM shops', function (err, rows, fields) {
        if (err)
            throw err;
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows));
    });
});

app.get('/api/v1/tools', (req, res) => {
    pool.query('SELECT * FROM tools', function (err, rows, fields) {
        if (err)
            throw err;
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows));
    });
});

app.post('/api/v1/food/add', (req, res) => {
    var data = {
        name: req.body.name,
        country: req.body.country,
        harvest: req.body.harvest || 0,
        shop: req.body.shop,
        retention: req.body.retention,
        type: req.body.type,
        comment: req.body.comment
    };
    // insert in database
    var query = pool.query('INSERT INTO food SET ?', data, function (error, results, fields) {
        if (error)
            throw error;
        // Neat!
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({message: 'food add ok !'}));
});

app.post('/api/v1/shop/add', (req, res) => {
    var data = {
        name: req.body.name,
        comment: req.body.comment
    };
    // insert in database
    var query = pool.query('INSERT INTO shops SET ?', data, function (error, results, fields) {
        if (error)
            throw error;
        // Neat!
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({message: 'food add ok !'}));
});

app.post('/api/v1/tool/add', (req, res) => {
    var data = {
        name: req.body.name,
        comment: req.body.comment
    };
    // insert in database
    var query = pool.query('INSERT INTO tools SET ?', data, function (error, results, fields) {
        if (error)
            throw error;
        // Neat!
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({message: 'food add ok !'}));
});

app.get('/api/v1/receipts', (req, res) => {
    pool.query('SELECT * FROM receipts', function (err, rows, fields) {
        if (err)
            throw err;
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(rows));
    });
});

// Functions
function getMonths(bitmask) { // WARNING, months are adressed from 0 to 11
    var months = [];
    for (var i = 0; i < 12; i++) {
        months[i] = (bitmask & 2 ** i) !== 0;
    }
    return months
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);