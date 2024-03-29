const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");


const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],

  email: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String,
    required: true
  },
  profileImage: {
    type: String
  }
});

UserSchema.plugin(plm);
module.exports = mongoose.model('User', UserSchema);

