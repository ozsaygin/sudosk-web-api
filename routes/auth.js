var express = require('express');
const { route } = require('.');
var router = express.Router();
const crypto = require('crypto');

// FIXME: Remove those secrets to embedd as environment variables
const JWT_SECRET = 'SECRET_KEY'
const refreshTokenSecret = 'yourrefreshtokensecrethere';
const refreshTokens = [];

var jsonwebtoken = require('jsonwebtoken');
const { compileFunction } = require('vm');
const { RSA_NO_PADDING } = require('constants');

// auth middleware
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // authHeader.format: Bearer [JWT_TOKEN]
        const token = authHeader.split(' ')[1]
        jsonwebtoken.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.send({ success: false, message: 'Invalid token' })
            }
            console.log(user)
            req.user = user
            next()
        })
    } else {
        res.send({ success: false, message: 'No token' })
    }
}

const User = require('../models/User')

function hashPassword(password) {
    const sha256 = crypto.createHash('sha256')
    return sha256.update(password).digest('hex')
}

/* POST create a new user account */
router.post('/register', function (req, res, next) {
    if (!req.body.username || !req.body.email || !req.body.password) {
        res.send({ message: 'missing field(s)' })
    } else {
        let newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword(req.body.password)
        })
        newUser.save((err) => {
            if (err) {
                console.log(`error occured while creating new user account: ${err}`)
            } else {
                console.log('route successfully has been posted ')
                res.send({ message: 'user has been registered' })
            }
        })
    }
});

/* POST login with already existing user account */
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body
    // TODO: if user passwd in db === password
    let result = await User.find({ username: username }, (err, data) => {
        if (err) {
            console.log(`error during checking user exists in db: ${err}`)
        }
    })
    console.log(`sent: ${hashPassword(password)}`)
    console.log(`db: ${result[0].password}`)
    if (hashPassword(password) === result[0].password) {
        const accessToken = jsonwebtoken.sign({ username: username }, JWT_SECRET)
        res.send({ message: 'user is authentic', accessToken: accessToken })
    } else {
        res.send({ message: 'user is not authentic' })
    }
})

module.exports.router = router;
module.exports.authenticateJWT = authenticateJWT
