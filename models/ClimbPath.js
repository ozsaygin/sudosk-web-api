const mongoose = require('mongoose')

const ClimbPath = mongoose.Schema({
    label: String,
    creator: String,
    color: String,
    dateAdded: Date
})

module.exports.ClimbPath = mongoose.model('ClimbPath', ClimbPath)