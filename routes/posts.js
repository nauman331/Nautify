const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    posttitle: {
        type: String
    },
    postimage: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('Post', PostSchema);
