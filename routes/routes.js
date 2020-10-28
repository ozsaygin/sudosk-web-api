/**
 * routes.js is an endpoint for handling requests about climbing routes
 **/

var express = require('express');
const { route } = require('.');
const router = express.Router();
const multer = require('multer');
const authenticateJWT = require('./auth').authenticateJWT
const { MulterError, diskStorage } = require('multer');

var fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4') {
        cb(null, true)
    } else { cb(null, false) }
}

// TODO: Generate a test for limits
var upload = multer({
    storage: multer.diskStorage({
        destination: 'uploads',
        filename: (res, file, cb) => {
            cb(null, new Date().toISOString() + file.originalname)
        }
    }),
    fileFilter: fileFilter,
    limits: {
        // cannot store file more than 10MB
        fileSize: 10000000
    }
})

var ClimbPath = require('../models/ClimbPath')

/* POST post a new route */
router.post('/route', authenticateJWT, upload.single('recfile'), (req, res, next) => {
    console.log(req.file)
    var newPath = new ClimbPath({
        label: req.body.name,
        creator: req.body.creator,
        color: req.body.color,
        path: req.file.path,
        dateAdded: new Date()
    })
    newPath.save((err) => {
        if (err) {
            console.log(`Error occured while saving new climbing path: ${err}`)
        }
        else {
            console.log('Route successfully has been posted ')
        }
    })
    res.send({ 'success': true, mmesage: 'Route successfully has been posted' })
});

/* GET all routes */
router.get('/getAllRoutes', authenticateJWT, (req, res, next) => {
    ClimbPath.find({}, (err, result) => {
        if (err) {
            console.log(`Error occured during query: ${err}`)
        }
        else {
            res.send(result)
        }
    })
})

/**
 * @swagger
 * 
 * /getRouterByColor:
 *  get:
 *      description: Return all routes with given color
 *      produces: 
 *          - application/json
 *      parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 * 
 */
router.get('/getRouteByColor', authenticateJWT, (req, res, next) => {
    ClimbPath.find({ color: req.body.color }, (err, result) => {
        console.log('here')
        if (err) {
            console.log(`Error occured during query: ${err}`)
        }
        else {
            res.send(result)
        }
    })
})

router.get('getRouteByCreator', authenticateJWT, (req, res, next) => {
    ClimbPath.find({ color: req.body.creator }, (err, result) => {
        console.log('here')
        if (err) {
            console.log(`Error occured during query: ${err}`)
        }
        else {
            res.send(result)
        }
    })
})

module.exports = router;