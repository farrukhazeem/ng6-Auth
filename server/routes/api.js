const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
const User = require('../models/user');
// Connect

mongoose.connect('mongodb://taimoortariq:123456q@ds018168.mlab.com:18168/ng6-auth').then((data) => {
    console.log("Connection Establish MongoDb")
}).catch((err) => {
    console.log(err)
})

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get users
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});



router.post('/userData', (req, res) => {

    var body = { email: req.body.email, nickname: req.body.nickname }

    var newUser = new User(body);
    newUser.save().then((data) => {
        return res.status(200).send({ message: data })

    }).catch((e) => {
        console.log(e, "false false");
        return res.status(500).send({ message: err })

    })

});

module.exports = router;