var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var mongoose = require('mongoose');

/* mongoose */
var MONGO_URI = 'mongodb://localhost:27017/sudosk'
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).
    catch(error => handleError(error));

mongoose.connection.on('connecting', msg => {
    console.log(`connecting to MongoDB server at ${MONGO_URI}`)
})
mongoose.connection.on('error', msg => {
    console.log(`error occured: ${msg}`);
});
mongoose.connection.on('connected', err => {
    console.log(`connected to ${MONGO_URI}`)
})

var indexRouter = require('./routes/index');
var routesRouter = require('./routes/routes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/routes', routesRouter);

module.exports = app;
