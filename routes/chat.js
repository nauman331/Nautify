const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const date = new Date();

let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();
const myDate = `${day}.${month}.${year}`;
const chatSchema = new Schema({
    createdAt: {
        type: String,
        default: myDate
    },
    chat: {
        type: String
    }
});

module.exports = mongoose.model('Chat', chatSchema);
