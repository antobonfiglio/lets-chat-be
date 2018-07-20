var mongoose = require('mongoose')

module.exports = mongoose.model('Post', {

    message: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref:'User' }
    
})