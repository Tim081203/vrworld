const {Schema, model} = require('mongoose')

const goodsModel = new Schema({
    type: {type: String},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    gb: {type: Number},
    quantity: {type: Number},
    cost: {type: Number}
})

module.exports = model('Goods', goodsModel)