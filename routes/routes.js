var express = require('express');
const { route } = require('.');
const router = express.Router();
var ClimbPath = require('../models/ClimbPath').ClimbPath

router.post('/route', (req, res, next) => {
    console.log(req.body)
    var newPath = new ClimbPath({
        name: req.body.name,
        creator: req.body.creator,
        color: req.body.color,
        dateAdded: new Date()
    })
    newPath.save((err) => {
        console.log(`error occured while saving new climbing path: ${err}`)
    })
    res.send({'success': true, mmesage: 'Route successfully has been posted'})
});

router.get('/route', (req, res, next) => {
    res.send({
        'success': true
    })
})


module.exports = router;