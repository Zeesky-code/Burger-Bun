const mongoose =  require('mongoose')
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    sessionId:{
        type: String,
        required: true
    },
    Orders: [
        {
            food: String,
        }
    ],
    currentOrder: [
        {
            food: String,
        }
    ]
})

module.exports = mongoose.model('Session',sessionSchema);