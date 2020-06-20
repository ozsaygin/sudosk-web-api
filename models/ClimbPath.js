const mongoose = require('mongoose')

const ClimbPath = mongoose.Schema({
    label: String,
    creator: String,
    color: String,
    path: String,
    dateAdded: Date
})


module.exports = mongoose.model('ClimbPath', ClimbPath)