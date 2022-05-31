const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {type: String, unique: true},
    username: {type: String, unique: true},
    password: {type: String},
    country: {type: String},
    roles: {type: [], default: ['USER']},
})
module.exports = model('User', userSchema)