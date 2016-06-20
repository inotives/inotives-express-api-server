var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
  title: String,
  author: String,
  body: String,
  comments: [{commentor: String, body: String, Date: String }],
  date: { type: Date, default: Date.now},
  draft: Boolean,
  tags: Array,
  meta: {
    votes: Number,
    faves: Number,
    shared: [{social: String, count: Number}]
  }
})

var Blog = mongoose.model('Blog', blogSchema);
