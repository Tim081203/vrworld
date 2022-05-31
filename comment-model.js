const {Schema, model} = require('mongoose')

const commentSchema = new Schema({
    text: {type: String, trim: true, required: true},
    date: {type: Date, default: Date.now},
    user : {type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = model('Comment', commentSchema)